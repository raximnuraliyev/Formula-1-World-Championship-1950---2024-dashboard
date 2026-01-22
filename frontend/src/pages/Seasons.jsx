import { useState, useEffect } from 'react';
import axios from 'axios';
import ChartCard from '../components/ChartCard';
import CodeReveal from '../components/CodeReveal';
import { Calendar, Search, Target, CheckeredFlag, Trophy, Table } from '../components/F1Icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Seasons() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [seasonRaces, setSeasonRaces] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  const years = Array.from({ length: 75 }, (_, i) => 2024 - i);

  useEffect(() => {
    fetchSeasonData(selectedYear);
  }, [selectedYear]);

  const fetchSeasonData = async (year) => {
    setLoading(true);
    try {
      const [racesRes, standingsRes] = await Promise.all([
        axios.get(`/api/races/season/${year}`),
        axios.get(`/api/standings/season/${year}`),
      ]);
      setSeasonRaces(racesRes.data);
      setStandings(standingsRes.data);
    } catch (error) {
      console.error('Error fetching season data:', error);
    } finally {
      setLoading(false);
    }
  };

  const pointsChartData = {
    labels: standings.slice(0, 10).map(d => d.driverName),
    datasets: [{
      label: 'Championship Points',
      data: standings.slice(0, 10).map(d => d.points),
      backgroundColor: (context) => {
        const index = context.dataIndex;
        if (index === 0) return '#ffd700';
        if (index === 1) return '#c0c0c0';
        if (index === 2) return '#cd7f32';
        return '#ff1c2e';
      },
      borderRadius: 8,
    }],
  };

  const winsTimelineData = {
    labels: seasonRaces.map(r => r.name?.replace('Grand Prix', 'GP') || r.round),
    datasets: [{
      label: 'Race Round',
      data: seasonRaces.map((_, i) => i + 1),
      borderColor: '#ff1c2e',
      backgroundColor: 'rgba(255, 28, 46, 0.2)',
      tension: 0.1,
      fill: true,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: '#888', maxRotation: 45, minRotation: 45, font: { size: 10 } },
        grid: { color: '#1a1a1a' },
      },
      y: {
        ticks: { color: '#888' },
        grid: { color: '#1a1a1a' },
      },
    },
  };

  const standingsSql = `-- Season Championship Standings
SELECT 
    CONCAT(d.forename, ' ', d.surname) AS driver_name,
    c.name AS constructor_name,
    ds.points AS total_points,
    ds.wins AS race_wins,
    ds.position AS championship_position
FROM driver_standings ds
INNER JOIN drivers d ON ds.driverId = d.driverId
INNER JOIN races r ON ds.raceId = r.raceId
INNER JOIN results res ON res.raceId = r.raceId 
    AND res.driverId = ds.driverId
INNER JOIN constructors c ON res.constructorId = c.constructorId
WHERE r.year = 2024  -- Specify season year
    AND r.round = (
        -- Get the last race of the season
        SELECT MAX(round) 
        FROM races 
        WHERE year = 2024
    )
ORDER BY ds.position ASC;`;

  const raceCalendarSql = `-- Season Race Calendar with Winners
SELECT 
    r.round,
    r.name AS grand_prix,
    r.date AS race_date,
    cir.name AS circuit_name,
    cir.location,
    cir.country,
    CONCAT(d.forename, ' ', d.surname) AS race_winner,
    c.name AS winning_constructor
FROM races r
INNER JOIN circuits cir ON r.circuitId = cir.circuitId
LEFT JOIN results res ON r.raceId = res.raceId AND res.position = 1
LEFT JOIN drivers d ON res.driverId = d.driverId
LEFT JOIN constructors c ON res.constructorId = c.constructorId
WHERE r.year = 2024  -- Specify season year
ORDER BY r.round ASC;`;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[#ff1c2e] mb-2">
          <Calendar className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wider uppercase">Year by Year</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Search className="w-10 h-10 text-[#ff1c2e]" />
          Season Explorer
        </h1>
        <p className="text-gray-400">Deep dive into any F1 season from 1950 to 2024</p>
      </div>

      {/* Year Selector */}
      <div className="bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#ff1c2e]" />
              Select Season
            </h2>
            <input
              type="range"
              min="1950"
              max="2024"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#ff1c2e]"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>1950</span>
              <span className="text-[#ff1c2e] font-bold text-lg">{selectedYear}</span>
              <span>2024</span>
            </div>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-[#1a1a1a] border border-[#ff1c2e]/30 rounded-lg px-4 py-3 text-white font-medium focus:outline-none focus:border-[#ff1c2e]"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Race Timeline */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CheckeredFlag className="w-6 h-6 text-[#ff1c2e]" />
            Race Calendar
          </h2>
          <span className="text-gray-400">{seasonRaces.length} Races</span>
        </div>
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff1c2e]"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
                {seasonRaces.map((race, index) => (
                  <div
                    key={race.raceId || index}
                    className="flex-shrink-0 w-48 bg-[#1a1a1a] rounded-xl p-4 border border-transparent hover:border-[#ff1c2e]/30 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#ff1c2e] font-bold">R{index + 1}</span>
                      <span className="text-gray-500 text-sm">{race.date}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1 line-clamp-2">
                      {race.name || `Round ${race.round}`}
                    </h4>
                    <p className="text-gray-500 text-xs mb-2">{race.circuitName}</p>
                    {race.winner && (
                      <div className="flex items-center gap-2 pt-2 border-t border-[#2a2a2a]">
                        <Trophy className="w-4 h-4 text-[#ff1c2e]" />
                        <span className="text-xs text-gray-300">{race.winner}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <CodeReveal
            title="race_calendar_with_winners.sql"
            code={raceCalendarSql}
            explanation="This MySQL query retrieves the complete race calendar for a season, including circuit details and race winners. Uses LEFT JOINs to handle races without recorded winners."
            whyNeeded="A complete race calendar provides the foundation for season analysis. It connects races with circuits, locations, and results to give a comprehensive view of each Grand Prix weekend."
            keyInsights={[
                "LEFT JOIN preserves races even if winner data is missing",
                "Circuit table provides geographical context (country, location)",
                "Position = 1 filter in JOIN condition finds race winner",
                "ORDER BY round ensures chronological race order"
            ]}
          />
        </div>
      </div>

      {/* Championship Standings */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title={`${selectedYear} Driver Standings`}
          icon={<Trophy className="w-5 h-5" />}
          codeReveal={
            <CodeReveal
              title="season_championship_standings.sql"
              code={standingsSql}
              explanation="This complex MySQL query retrieves final championship standings by joining driver_standings with the last race of the season. It includes driver names, teams, points, and positions."
              whyNeeded="Championship standings are the ultimate measure of success in F1. This query captures the final points table which determines the World Champion and the overall season hierarchy."
              keyInsights={[
                "Subquery finds MAX(round) to get the season's final race",
                "Multiple JOINs connect drivers with their constructors",
                "Final standings reflect cumulative season performance",
                "ORDER BY position ASC shows champion at top"
              ]}
            />
          }
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff1c2e]"></div>
            </div>
          ) : (
            <Bar data={pointsChartData} options={chartOptions} />
          )}
        </ChartCard>

        {/* Standings Table */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#ff1c2e]/10 rounded-lg">
              <Table className="w-5 h-5 text-[#ff1c2e]" />
            </div>
            <h3 className="text-lg font-semibold text-white">Full Standings</h3>
          </div>
          <div className="overflow-auto max-h-[400px]">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#0d0d0d]">
                <tr className="text-left text-gray-400 text-sm">
                  <th className="pb-3 pr-4">Pos</th>
                  <th className="pb-3 pr-4">Driver</th>
                  <th className="pb-3 pr-4">Team</th>
                  <th className="pb-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((driver, index) => (
                  <tr
                    key={driver.driverId || index}
                    className="border-t border-[#1a1a1a] text-sm"
                  >
                    <td className="py-3 pr-4">
                      <span className={`font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        index === 2 ? 'text-orange-400' :
                        'text-gray-500'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-white font-medium">
                      {driver.driverName}
                    </td>
                    <td className="py-3 pr-4 text-gray-400">
                      {driver.constructorName || '-'}
                    </td>
                    <td className="py-3 text-right text-[#ff1c2e] font-bold">
                      {driver.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
