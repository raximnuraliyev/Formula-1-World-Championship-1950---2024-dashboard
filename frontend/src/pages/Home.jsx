import { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import CodeReveal from '../components/CodeReveal';
import { RacingCar, CheckeredFlag, Helmet, Garage, Calendar, Crown, ChartBar, Trophy, Compass, Gear, Zap } from '../components/F1Icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Home() {
  const [stats, setStats] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(2024);
  const [seasonData, setSeasonData] = useState(null);
  const [loading, setLoading] = useState(true);

  const seasons = Array.from({ length: 75 }, (_, i) => 2024 - i);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchSeasonData(selectedSeason);
  }, [selectedSeason]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats/overview');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSeasonData = async (year) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/seasons/${year}`);
      setSeasonData(response.data);
    } catch (error) {
      console.error('Error fetching season data:', error);
    } finally {
      setLoading(false);
    }
  };

  const winsChartData = {
    labels: seasonData?.topDrivers?.map(d => d.name) || [],
    datasets: [{
      label: 'Wins',
      data: seasonData?.topDrivers?.map(d => d.wins) || [],
      backgroundColor: '#ff1c2e',
      borderRadius: 8,
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
        ticks: { color: '#888' },
        grid: { color: '#1a1a1a' },
      },
      y: {
        ticks: { color: '#888' },
        grid: { color: '#1a1a1a' },
      },
    },
  };

  const seasonWinsSql = `-- Get Top Drivers by Wins for a Specific Season
SELECT 
    CONCAT(d.forename, ' ', d.surname) AS driver_name,
    COUNT(CASE WHEN res.position = 1 THEN 1 END) AS total_wins,
    COUNT(*) AS races_participated,
    ROUND(COUNT(CASE WHEN res.position = 1 THEN 1 END) * 100.0 / COUNT(*), 2) AS win_percentage
FROM results res
INNER JOIN drivers d ON res.driverId = d.driverId
INNER JOIN races r ON res.raceId = r.raceId
WHERE r.year = 2024  -- Change year as needed
GROUP BY d.driverId, d.forename, d.surname
HAVING total_wins > 0
ORDER BY total_wins DESC
LIMIT 10;`;

  return (
    <div className="fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a0a0a] via-[#1a0a0a] to-[#0a0a0a] border border-[#1f1f1f] p-8 mb-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZjFjMmUiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff1c2e]/5 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="flex items-center gap-2 text-[#ff1c2e] mb-2">
            <RacingCar className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wider uppercase">Season Overview</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Formula 1 World Championship
            <br />
            <span className="text-[#ff1c2e]">1950 – 2024</span>
          </h1>
          <p className="text-gray-400 max-w-2xl flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#ff1c2e]" />
            Explore 74 years of racing history. From the legendary battles of Fangio to the modern era of Hamilton and Verstappen.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Races"
          value={stats?.totalRaces?.toLocaleString() || '1,100+'}
          icon={<CheckeredFlag className="w-6 h-6" />}
          subtitle="Since 1950"
        />
        <StatCard
          title="Total Drivers"
          value={stats?.totalDrivers?.toLocaleString() || '850+'}
          icon={<Helmet className="w-6 h-6" />}
          subtitle="All-time"
        />
        <StatCard
          title="Constructors"
          value={stats?.totalConstructors?.toLocaleString() || '210+'}
          icon={<Garage className="w-6 h-6" />}
          subtitle="Teams competed"
        />
        <StatCard
          title="Championships"
          value="74"
          icon={<Calendar className="w-6 h-6" />}
          subtitle="Seasons"
        />
      </div>

      {/* Season Selector */}
      <div className="bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Gear className="w-5 h-5 text-[#ff1c2e]" />
              Select Season
            </h2>
            <p className="text-gray-400 text-sm">Choose a year to explore detailed season data</p>
          </div>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white font-medium focus:outline-none focus:border-[#ff1c2e] transition-colors cursor-pointer"
          >
            {seasons.map((year) => (
              <option key={year} value={year}>
                {year} Season
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Season Stats */}
      {!loading && seasonData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title={`${selectedSeason} Races`}
            value={seasonData.totalRaces || 0}
            icon={<CheckeredFlag className="w-6 h-6" />}
          />
          <StatCard
            title="Champion"
            value={seasonData.champion || 'N/A'}
            icon={<Crown className="w-6 h-6" />}
          />
          <StatCard
            title="Constructor Champion"
            value={seasonData.constructorChampion || 'N/A'}
            icon={<Garage className="w-6 h-6" />}
          />
        </div>
      )}

      {/* Season Wins Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title={`${selectedSeason} Top Drivers`}
          icon={<ChartBar className="w-5 h-5" />}
          codeReveal={
            <CodeReveal
              title="season_top_drivers.sql"
              code={seasonWinsSql}
              explanation="This SQL query retrieves the top-performing drivers for a specific F1 season by counting their race wins and calculating win percentage from the results table joined with drivers and races tables."
              whyNeeded="We need this query to identify which drivers dominated a particular season. It helps analysts understand season dynamics, compare driver performances, and visualize the competitive landscape of any given year."
              keyInsights={[
                "INNER JOIN connects three tables: results, drivers, and races for complete data",
                "HAVING clause filters only drivers with at least one win",
                "Win percentage shows efficiency - wins relative to races entered",
                "ORDER BY DESC ensures top performers appear first"
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

        <ChartCard
          title="Quick Navigation"
          icon={<Compass className="w-5 h-5" />}
        >
          <div className="grid grid-cols-2 gap-4 h-full content-center">
            {[
              { title: 'Driver Legends', desc: 'Compare all-time greats', icon: <Trophy className="w-8 h-8" />, link: '/drivers' },
              { title: 'Team Battles', desc: 'Constructor rivalries', icon: <RacingCar className="w-8 h-8" />, link: '/teams' },
              { title: 'Season Deep Dive', desc: 'Year by year analysis', icon: <Calendar className="w-8 h-8" />, link: '/seasons' },
              { title: 'Performance Stats', desc: 'Advanced analytics', icon: <Gear className="w-8 h-8" />, link: '/stats' },
            ].map((item) => (
              <a
                key={item.title}
                href={item.link}
                className="bg-[#141414] rounded-xl p-4 border border-[#1f1f1f] hover:border-[#ff1c2e]/50 transition-all duration-200 group hover:shadow-lg hover:shadow-[#ff1c2e]/10"
              >
                <div className="text-[#ff1c2e] mb-3 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h4 className="font-semibold text-white group-hover:text-[#ff1c2e] transition-colors">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </a>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
