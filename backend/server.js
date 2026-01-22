const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Data storage
let data = {
  drivers: [],
  constructors: [],
  races: [],
  results: [],
  driverStandings: [],
  constructorStandings: [],
  qualifying: [],
  circuits: [],
  lapTimes: [],
};

// Helper function to load CSV
function loadCSV(filename) {
  return new Promise((resolve, reject) => {
    const results = [];
    const datasetPath = path.join(__dirname, '..', 'dataset');
    const filePath = path.join(datasetPath, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      resolve([]);
      return;
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// Load all data on startup
async function loadAllData() {
  console.log('Loading F1 data...');
  
  try {
    data.drivers = await loadCSV('drivers.csv');
    data.constructors = await loadCSV('constructors.csv');
    data.races = await loadCSV('races.csv');
    data.results = await loadCSV('results.csv');
    data.driverStandings = await loadCSV('driver_standings.csv');
    data.constructorStandings = await loadCSV('constructor_standings.csv');
    data.qualifying = await loadCSV('qualifying.csv');
    data.circuits = await loadCSV('circuits.csv');
    data.lapTimes = await loadCSV('lap_times.csv');
    
    console.log(`Loaded: ${data.drivers.length} drivers, ${data.races.length} races, ${data.results.length} results`);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// API Routes

// Overview stats
app.get('/api/stats/overview', (req, res) => {
  res.json({
    totalRaces: data.races.length,
    totalDrivers: data.drivers.length,
    totalConstructors: data.constructors.length,
  });
});

// Get all drivers
app.get('/api/drivers', (req, res) => {
  const drivers = data.drivers.map(d => ({
    driverId: d.driverId,
    name: `${d.forename} ${d.surname}`,
    nationality: d.nationality,
    dob: d.dob,
  }));
  res.json(drivers);
});

// Get top drivers by wins
app.get('/api/drivers/top-wins', (req, res) => {
  // Count wins per driver
  const winsCount = {};
  const podiumCount = {};
  
  data.results.forEach(result => {
    const driverId = result.driverId;
    if (result.position === '1') {
      winsCount[driverId] = (winsCount[driverId] || 0) + 1;
    }
    if (['1', '2', '3'].includes(result.position)) {
      podiumCount[driverId] = (podiumCount[driverId] || 0) + 1;
    }
  });

  // Map to drivers and sort
  const topDrivers = Object.entries(winsCount)
    .map(([driverId, wins]) => {
      const driver = data.drivers.find(d => d.driverId === driverId);
      return {
        driverId,
        name: driver ? `${driver.forename} ${driver.surname}` : 'Unknown',
        nationality: driver?.nationality || 'Unknown',
        wins,
        podiums: podiumCount[driverId] || 0,
      };
    })
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 50);

  res.json(topDrivers);
});

// Get driver performance over years
app.get('/api/drivers/:driverId/performance', (req, res) => {
  const { driverId } = req.params;
  
  // Get standings for this driver across years
  const driverStands = data.driverStandings
    .filter(s => s.driverId === driverId)
    .map(s => {
      const race = data.races.find(r => r.raceId === s.raceId);
      return {
        year: race?.year,
        points: parseFloat(s.points) || 0,
        position: parseInt(s.position) || 0,
      };
    });

  // Group by year and get max points per year
  const yearlyPoints = {};
  driverStands.forEach(s => {
    if (s.year) {
      if (!yearlyPoints[s.year] || s.points > yearlyPoints[s.year]) {
        yearlyPoints[s.year] = s.points;
      }
    }
  });

  const years = Object.keys(yearlyPoints).sort();
  const points = years.map(y => yearlyPoints[y]);

  res.json({ years, points });
});

// Get all constructors
app.get('/api/constructors', (req, res) => {
  const constructors = data.constructors.map(c => ({
    constructorId: c.constructorId,
    name: c.name,
    nationality: c.nationality,
  }));
  res.json(constructors);
});

// Get top constructors by wins
app.get('/api/constructors/top-wins', (req, res) => {
  // Count wins per constructor
  const winsCount = {};
  
  data.results.forEach(result => {
    if (result.position === '1') {
      const constructorId = result.constructorId;
      winsCount[constructorId] = (winsCount[constructorId] || 0) + 1;
    }
  });

  // Count championships
  const championships = {};
  const lastRacePerYear = {};
  
  data.races.forEach(race => {
    const year = race.year;
    const raceId = race.raceId;
    if (!lastRacePerYear[year] || parseInt(race.round) > parseInt(lastRacePerYear[year].round)) {
      lastRacePerYear[year] = race;
    }
  });

  Object.values(lastRacePerYear).forEach(lastRace => {
    const standing = data.constructorStandings
      .filter(s => s.raceId === lastRace.raceId)
      .sort((a, b) => parseInt(a.position) - parseInt(b.position))[0];
    
    if (standing) {
      championships[standing.constructorId] = (championships[standing.constructorId] || 0) + 1;
    }
  });

  // Map to constructors and sort
  const topConstructors = Object.entries(winsCount)
    .map(([constructorId, wins]) => {
      const constructor = data.constructors.find(c => c.constructorId === constructorId);
      return {
        constructorId,
        name: constructor?.name || 'Unknown',
        nationality: constructor?.nationality || 'Unknown',
        wins,
        championships: championships[constructorId] || 0,
      };
    })
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 20);

  res.json(topConstructors);
});

// Get wins by decade for top teams
app.get('/api/constructors/wins-by-decade', (req, res) => {
  const decades = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
  
  // Get top 5 constructors
  const winsCount = {};
  data.results.forEach(result => {
    if (result.position === '1') {
      winsCount[result.constructorId] = (winsCount[result.constructorId] || 0) + 1;
    }
  });
  
  const topConstructorIds = Object.entries(winsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);

  // Calculate wins by decade for each top constructor
  const teams = topConstructorIds.map(constructorId => {
    const constructor = data.constructors.find(c => c.constructorId === constructorId);
    const winsByDecade = decades.map(decade => {
      const decadeStart = parseInt(decade);
      const decadeEnd = decadeStart + 9;
      
      return data.results.filter(result => {
        if (result.constructorId !== constructorId || result.position !== '1') return false;
        const race = data.races.find(r => r.raceId === result.raceId);
        const year = parseInt(race?.year);
        return year >= decadeStart && year <= decadeEnd;
      }).length;
    });

    return {
      name: constructor?.name || 'Unknown',
      winsByDecade,
    };
  });

  res.json({ decades, teams });
});

// Get season data
app.get('/api/seasons/:year', (req, res) => {
  const year = req.params.year;
  
  // Get races for this year
  const seasonRaces = data.races.filter(r => r.year === year);
  
  // Get results for this year
  const raceIds = seasonRaces.map(r => r.raceId);
  const seasonResults = data.results.filter(r => raceIds.includes(r.raceId));
  
  // Count wins per driver
  const winsCount = {};
  seasonResults.forEach(result => {
    if (result.position === '1') {
      winsCount[result.driverId] = (winsCount[result.driverId] || 0) + 1;
    }
  });

  // Get top drivers for the season
  const topDrivers = Object.entries(winsCount)
    .map(([driverId, wins]) => {
      const driver = data.drivers.find(d => d.driverId === driverId);
      return {
        driverId,
        name: driver ? `${driver.forename} ${driver.surname}` : 'Unknown',
        wins,
      };
    })
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 10);

  // Get champion (last race standings position 1)
  const lastRace = seasonRaces.sort((a, b) => parseInt(b.round) - parseInt(a.round))[0];
  let champion = 'N/A';
  let constructorChampion = 'N/A';
  
  if (lastRace) {
    const champStanding = data.driverStandings
      .filter(s => s.raceId === lastRace.raceId && s.position === '1')[0];
    
    if (champStanding) {
      const champDriver = data.drivers.find(d => d.driverId === champStanding.driverId);
      champion = champDriver ? `${champDriver.forename} ${champDriver.surname}` : 'Unknown';
    }

    const constStanding = data.constructorStandings
      .filter(s => s.raceId === lastRace.raceId && s.position === '1')[0];
    
    if (constStanding) {
      const constTeam = data.constructors.find(c => c.constructorId === constStanding.constructorId);
      constructorChampion = constTeam?.name || 'Unknown';
    }
  }

  res.json({
    totalRaces: seasonRaces.length,
    topDrivers,
    champion,
    constructorChampion,
  });
});

// Get races for a season
app.get('/api/races/season/:year', (req, res) => {
  const year = req.params.year;
  
  const seasonRaces = data.races
    .filter(r => r.year === year)
    .sort((a, b) => parseInt(a.round) - parseInt(b.round))
    .map(race => {
      const circuit = data.circuits.find(c => c.circuitId === race.circuitId);
      
      // Find winner
      const winnerResult = data.results.find(
        r => r.raceId === race.raceId && r.position === '1'
      );
      let winner = null;
      if (winnerResult) {
        const driver = data.drivers.find(d => d.driverId === winnerResult.driverId);
        winner = driver ? `${driver.forename} ${driver.surname}` : null;
      }

      return {
        raceId: race.raceId,
        round: race.round,
        name: race.name,
        date: race.date,
        circuitName: circuit?.name || 'Unknown Circuit',
        winner,
      };
    });

  res.json(seasonRaces);
});

// Get driver standings for a season
app.get('/api/standings/season/:year', (req, res) => {
  const year = req.params.year;
  
  // Get last race of the season
  const seasonRaces = data.races
    .filter(r => r.year === year)
    .sort((a, b) => parseInt(b.round) - parseInt(a.round));
  
  if (seasonRaces.length === 0) {
    return res.json([]);
  }

  const lastRace = seasonRaces[0];
  
  // Get standings for last race
  const standings = data.driverStandings
    .filter(s => s.raceId === lastRace.raceId)
    .sort((a, b) => parseInt(a.position) - parseInt(b.position))
    .map(s => {
      const driver = data.drivers.find(d => d.driverId === s.driverId);
      
      // Get constructor
      const lastResult = data.results.find(
        r => r.raceId === lastRace.raceId && r.driverId === s.driverId
      );
      let constructorName = null;
      if (lastResult) {
        const constructor = data.constructors.find(c => c.constructorId === lastResult.constructorId);
        constructorName = constructor?.name;
      }

      return {
        driverId: s.driverId,
        driverName: driver ? `${driver.forename} ${driver.surname}` : 'Unknown',
        constructorName,
        points: parseFloat(s.points) || 0,
        wins: parseInt(s.wins) || 0,
      };
    });

  res.json(standings);
});

// Stats: Qualifying vs Finish position
app.get('/api/stats/quali-vs-finish', (req, res) => {
  const { startYear = 1990, endYear = 2024 } = req.query;
  
  // Get races in range
  const raceIds = data.races
    .filter(r => {
      const year = parseInt(r.year);
      return year >= parseInt(startYear) && year <= parseInt(endYear);
    })
    .map(r => r.raceId);

  // Get qualifying and result data
  const qualiData = data.results
    .filter(r => raceIds.includes(r.raceId) && r.grid && r.position)
    .filter(r => r.grid !== '\\N' && r.position !== '\\N')
    .map(r => ({
      grid: parseInt(r.grid),
      position: parseInt(r.position),
    }))
    .filter(r => !isNaN(r.grid) && !isNaN(r.position) && r.grid > 0 && r.position > 0);

  res.json(qualiData);
});

// Stats: Average lap times by decade
app.get('/api/stats/lap-times-by-decade', (req, res) => {
  // Calculate average lap times by decade from lap_times data
  const decades = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
  
  // If no lap time data, return estimated values
  if (data.lapTimes.length === 0) {
    res.json({
      decades,
      avgTimes: [120, 110, 100, 95, 90, 88, 85, 82],
    });
    return;
  }

  const decadeTimes = {};
  decades.forEach(d => { decadeTimes[d] = []; });

  data.lapTimes.forEach(lap => {
    const race = data.races.find(r => r.raceId === lap.raceId);
    if (!race) return;
    
    const year = parseInt(race.year);
    const decade = `${Math.floor(year / 10) * 10}s`;
    
    if (decadeTimes[decade] && lap.milliseconds && lap.milliseconds !== '\\N') {
      decadeTimes[decade].push(parseInt(lap.milliseconds) / 1000);
    }
  });

  const avgTimes = decades.map(d => {
    const times = decadeTimes[d];
    if (times.length === 0) return null;
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  });

  res.json({ decades, avgTimes });
});

// Stats: Podium frequency by driver
app.get('/api/stats/podium-frequency', (req, res) => {
  const podiumCount = {};
  
  data.results.forEach(result => {
    if (['1', '2', '3'].includes(result.position)) {
      podiumCount[result.driverId] = (podiumCount[result.driverId] || 0) + 1;
    }
  });

  const topPodiums = Object.entries(podiumCount)
    .map(([driverId, podiums]) => {
      const driver = data.drivers.find(d => d.driverId === driverId);
      return {
        driverId,
        name: driver ? `${driver.forename} ${driver.surname}` : 'Unknown',
        podiums,
      };
    })
    .sort((a, b) => b.podiums - a.podiums)
    .slice(0, 20);

  res.json(topPodiums);
});

// Start server
loadAllData().then(() => {
  app.listen(PORT, () => {
    console.log(`F1 Dashboard API running on port ${PORT}`);
  });
});
