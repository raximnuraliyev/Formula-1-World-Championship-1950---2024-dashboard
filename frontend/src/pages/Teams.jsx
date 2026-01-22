import { useState, useEffect } from 'react';
import axios from 'axios';
import ChartCard from '../components/ChartCard';
import CodeReveal from '../components/CodeReveal';
import { Garage, RacingCar, Trophy, ChartBar, Grid } from '../components/F1Icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [teamWins, setTeamWins] = useState([]);
  const [decadeData, setDecadeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
    fetchTeamWins();
    fetchDecadeData();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get('/api/constructors');
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchTeamWins = async () => {
    try {
      const response = await axios.get('/api/constructors/top-wins');
      setTeamWins(response.data);
    } catch (error) {
      console.error('Error fetching team wins:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDecadeData = async () => {
    try {
      const response = await axios.get('/api/constructors/wins-by-decade');
      setDecadeData(response.data);
    } catch (error) {
      console.error('Error fetching decade data:', error);
    }
  };

  const teamColors = {
    'Ferrari': '#dc0000',
    'McLaren': '#ff8000',
    'Mercedes': '#00d2be',
    'Red Bull': '#0600ef',
    'Williams': '#005aff',
    'Lotus': '#006400',
    'Brabham': '#00a000',
    'Renault': '#fff500',
    'Benetton': '#00ff00',
    'Tyrrell': '#0000ff',
  };

  const winsChartData = {
    labels: teamWins.slice(0, 12).map(t => t.name),
    datasets: [{
      label: 'Constructor Wins',
      data: teamWins.slice(0, 12).map(t => t.wins),
      backgroundColor: teamWins.slice(0, 12).map(t => teamColors[t.name] || '#ff1c2e'),
      borderRadius: 8,
    }],
  };

  const decadeChartData = decadeData ? {
    labels: decadeData.decades,
    datasets: decadeData.teams.map(team => ({
      label: team.name,
      data: team.winsByDecade,
      backgroundColor: teamColors[team.name] || `hsl(${Math.random() * 360}, 70%, 50%)`,
    })),
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: { color: '#888', maxRotation: 45, minRotation: 45 },
        grid: { color: '#1a1a1a' },
      },
      y: {
        ticks: { color: '#888' },
        grid: { color: '#1a1a1a' },
      },
    },
  };

  const stackedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#888', padding: 20 },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: '#888' },
        grid: { color: '#1a1a1a' },
      },
      y: {
        stacked: true,
        ticks: { color: '#888' },
        grid: { color: '#1a1a1a' },
      },
    },
  };

  const constructorWinsSql = `-- All-Time Constructor Wins Leaderboard
SELECT 
    c.name AS constructor_name,
    c.nationality,
    COUNT(CASE WHEN res.position = 1 THEN 1 END) AS total_wins,
    COUNT(DISTINCT res.driverId) AS total_drivers,
    COUNT(DISTINCT r.year) AS seasons_competed,
    MIN(r.year) AS first_season,
    MAX(r.year) AS last_season
FROM constructors c
INNER JOIN results res ON c.constructorId = res.constructorId
INNER JOIN races r ON res.raceId = r.raceId
GROUP BY c.constructorId, c.name, c.nationality
HAVING total_wins > 0
ORDER BY total_wins DESC
LIMIT 20;`;

  const decadeWinsSql = `-- Constructor Wins Breakdown by Decade
SELECT 
    c.name AS constructor_name,
    CONCAT(FLOOR(r.year / 10) * 10, 's') AS decade,
    COUNT(CASE WHEN res.position = 1 THEN 1 END) AS wins_in_decade
FROM constructors c
INNER JOIN results res ON c.constructorId = res.constructorId
INNER JOIN races r ON res.raceId = r.raceId
WHERE c.constructorId IN (
    -- Subquery: Get top 5 constructors by total wins
    SELECT constructorId 
    FROM results 
    WHERE position = 1 
    GROUP BY constructorId 
    ORDER BY COUNT(*) DESC 
    LIMIT 5
)
GROUP BY c.name, decade
ORDER BY c.name, decade;`;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[#ff1c2e] mb-2">
          <Garage className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wider uppercase">Constructors Battleground</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <RacingCar className="w-10 h-10 text-[#ff1c2e]" />
          Team Dominance Through History
        </h1>
        <p className="text-gray-400">Explore how teams have battled for supremacy across 74 years</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Total Wins Chart */}
        <ChartCard
          title="All-Time Constructor Wins"
          icon={<Trophy className="w-5 h-5" />}
          codeReveal={
            <CodeReveal
              title="constructor_wins_leaderboard.sql"
              code={constructorWinsSql}
              explanation="This MySQL query calculates total race wins for each constructor by joining the constructors, results, and races tables. It also tracks unique drivers and seasons competed."
              whyNeeded="Constructor performance analysis is crucial for understanding which teams have been historically dominant. This helps sponsors, analysts, and fans compare team legacies and investment value."
              keyInsights={[
                "Triple JOIN connects constructors → results → races for complete picture",
                "COUNT(DISTINCT driverId) shows how many different drivers won for each team",
                "Season span (first to last) reveals team longevity in the sport",
                "HAVING clause filters out teams with zero wins"
              ]}
            />
          }
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff1c2e]"></div>
            </div>
          ) : (
            <Bar data={winsChartData} options={chartOptions} />
          )}
        </ChartCard>

        {/* Decade Stacked Chart */}
        <ChartCard
          title="Wins by Decade (Top 5 Teams)"
          icon={<ChartBar className="w-5 h-5" />}
          codeReveal={
            <CodeReveal
              title="constructor_wins_by_decade.sql"
              code={decadeWinsSql}
              explanation="This advanced SQL query uses a subquery to identify top 5 constructors, then breaks down their wins by decade using FLOOR division for decade grouping."
              whyNeeded="Decade-by-decade analysis reveals how team dominance shifts over time. It shows whether a team's success is sustained or concentrated in specific eras, reflecting regulation changes and team investments."
              keyInsights={[
                "FLOOR(year/10)*10 groups years into decades (1950, 1960, etc.)",
                "Subquery pre-filters to top 5 teams for performance",
                "Results show rise and fall of constructor dynasties",
                "Useful for identifying golden eras of each team"
              ]}
            />
          }
        >
          {decadeChartData ? (
            <Bar data={decadeChartData} options={stackedOptions} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff1c2e]"></div>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Team Grid */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Grid className="w-6 h-6 text-[#ff1c2e]" />
          Constructor Hall of Fame
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {teamWins.slice(0, 12).map((team, index) => (
          <div
            key={team.constructorId}
            className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl overflow-hidden card-hover"
          >
            <div 
              className="h-2"
              style={{ backgroundColor: teamColors[team.name] || '#ff1c2e' }}
            ></div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: teamColors[team.name] || '#ff1c2e' }}
                >
                  {index + 1}
                </div>
                <span className="text-gray-500 text-sm">{team.nationality}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{team.name}</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#1a1a1a] rounded-lg p-2 text-center">
                  <p className="text-[#ff1c2e] font-bold text-xl">{team.wins}</p>
                  <p className="text-gray-500 text-xs">Wins</p>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-2 text-center">
                  <p className="text-white font-bold text-xl">{team.championships || '-'}</p>
                  <p className="text-gray-500 text-xs">Titles</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
