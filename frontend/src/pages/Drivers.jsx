import { useState, useEffect } from 'react';
import axios from 'axios';
import ChartCard from '../components/ChartCard';
import CodeReveal from '../components/CodeReveal';
import { Crown, Trophy, ChartLine, ChartBar, Medal } from '../components/F1Icons';
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

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [topDrivers, setTopDrivers] = useState([]);
  const [driverPerformance, setDriverPerformance] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
    fetchTopDrivers();
  }, []);

  useEffect(() => {
    if (selectedDriver) {
      fetchDriverPerformance(selectedDriver);
    }
  }, [selectedDriver]);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('/api/drivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const fetchTopDrivers = async () => {
    try {
      const response = await axios.get('/api/drivers/top-wins');
      setTopDrivers(response.data);
      if (response.data.length > 0) {
        setSelectedDriver(response.data[0].driverId);
      }
    } catch (error) {
      console.error('Error fetching top drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverPerformance = async (driverId) => {
    try {
      const response = await axios.get(`/api/drivers/${driverId}/performance`);
      setDriverPerformance(response.data);
    } catch (error) {
      console.error('Error fetching driver performance:', error);
    }
  };

  const winsChartData = {
    labels: topDrivers.slice(0, 15).map(d => d.name),
    datasets: [{
      label: 'Race Wins',
      data: topDrivers.slice(0, 15).map(d => d.wins),
      backgroundColor: '#ff1c2e',
      borderRadius: 8,
    }],
  };

  const performanceChartData = {
    labels: driverPerformance?.years || [],
    datasets: [{
      label: 'Season Points',
      data: driverPerformance?.points || [],
      borderColor: '#ff1c2e',
      backgroundColor: 'rgba(255, 28, 46, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#888' }
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

  const topWinsSql = `-- All-Time Driver Wins Leaderboard
SELECT 
    CONCAT(d.forename, ' ', d.surname) AS driver_name,
    d.nationality,
    COUNT(CASE WHEN res.position = 1 THEN 1 END) AS total_wins,
    COUNT(CASE WHEN res.position <= 3 THEN 1 END) AS podiums,
    COUNT(*) AS total_races,
    MIN(r.year) AS debut_year,
    MAX(r.year) AS last_year
FROM drivers d
INNER JOIN results res ON d.driverId = res.driverId
INNER JOIN races r ON res.raceId = r.raceId
GROUP BY d.driverId, d.forename, d.surname, d.nationality
HAVING total_wins > 0
ORDER BY total_wins DESC
LIMIT 50;`;

  const performanceSql = `-- Driver Career Performance Over Years
SELECT 
    r.year AS season,
    MAX(ds.points) AS championship_points,
    MIN(ds.position) AS best_standing,
    COUNT(CASE WHEN res.position = 1 THEN 1 END) AS wins_that_year
FROM driver_standings ds
INNER JOIN races r ON ds.raceId = r.raceId
INNER JOIN results res ON res.raceId = r.raceId 
    AND res.driverId = ds.driverId
WHERE ds.driverId = ?  -- Parameter: driver_id
GROUP BY r.year
ORDER BY r.year ASC;`;

  const nationalities = {
    'British': 'GB', 'German': 'DE', 'Brazilian': 'BR', 'Finnish': 'FI',
    'Spanish': 'ES', 'French': 'FR', 'Italian': 'IT', 'Dutch': 'NL',
    'Australian': 'AU', 'Austrian': 'AT', 'Argentine': 'AR', 'American': 'US',
    'Mexican': 'MX', 'Belgian': 'BE', 'Canadian': 'CA', 'Monegasque': 'MC',
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[#ff1c2e] mb-2">
          <Crown className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wider uppercase">Driver Legends</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Trophy className="w-10 h-10 text-[#ff1c2e]" />
          The Greatest of All Time
        </h1>
        <p className="text-gray-400">Compare drivers across 74 years of Formula 1 history</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Most Wins Chart */}
        <ChartCard
          title="Most Race Wins (All-Time)"
          icon={<ChartBar className="w-5 h-5" />}
          codeReveal={
            <CodeReveal
              title="all_time_wins_leaderboard.sql"
              code={topWinsSql}
              explanation="This MySQL query aggregates race results to find drivers with the most career wins. It joins drivers, results, and races tables to calculate total wins, podiums, and career span for each driver."
              whyNeeded="Understanding the all-time winners helps identify the greatest drivers in F1 history. This data powers the bar chart visualization and enables historical comparisons across different eras of racing."
              keyInsights={[
                "CASE WHEN counts conditional wins (position = 1) and podiums (position ≤ 3)",
                "GROUP BY aggregates stats per driver across their entire career",
                "MIN/MAX year shows career span from debut to retirement",
                "HAVING filters out drivers with zero wins for cleaner results"
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

        {/* Driver Performance Over Years */}
        <ChartCard
          title="Driver Performance Over Years"
          icon={<ChartLine className="w-5 h-5" />}
          codeReveal={
            <CodeReveal
              title="driver_career_performance.sql"
              code={performanceSql}
              explanation="This parameterized SQL query tracks a specific driver's championship performance year by year. It retrieves points, standings, and win counts for each season they competed in."
              whyNeeded="Career trajectory analysis reveals peak performance periods, consistency patterns, and how drivers improved or declined over time. Essential for comparing drivers across different team changes and regulation eras."
              keyInsights={[
                "Parameterized query (?) allows dynamic driver selection",
                "MAX(points) gets final season points after all races",
                "MIN(position) shows best championship standing achieved",
                "GROUP BY year creates one row per season for trend analysis"
              ]}
            />
          }
        >
          <div className="mb-4">
            <select
              value={selectedDriver || ''}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="bg-[#1a1a1a] border border-[#ff1c2e]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ff1c2e]"
            >
              {topDrivers.slice(0, 20).map((driver) => (
                <option key={driver.driverId} value={driver.driverId}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>
          {driverPerformance ? (
            <div className="h-[250px]">
              <Line data={performanceChartData} options={chartOptions} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[250px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff1c2e]"></div>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Driver Cards Grid */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Medal className="w-6 h-6 text-[#ff1c2e]" />
          Top Drivers
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {topDrivers.slice(0, 12).map((driver, index) => (
          <div
            key={driver.driverId}
            className="bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-4 card-hover shadow-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff1c2e] to-[#cc1625] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#ff1c2e]/20">
                {index + 1}
              </div>
              <span className="text-xs font-bold bg-[#1a1a1a] px-2 py-1 rounded text-gray-400">
                {nationalities[driver.nationality] || driver.nationality?.slice(0,2).toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{driver.name}</h3>
            <p className="text-gray-500 text-sm mb-3">{driver.nationality}</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#1a1a1a] rounded-lg p-2 text-center">
                <p className="text-[#ff1c2e] font-bold text-xl">{driver.wins}</p>
                <p className="text-gray-500 text-xs">Wins</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-2 text-center">
                <p className="text-white font-bold text-xl">{driver.podiums || '-'}</p>
                <p className="text-gray-500 text-xs">Podiums</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
