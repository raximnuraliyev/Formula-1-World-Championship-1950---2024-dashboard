import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ChartCard from '../components/ChartCard';
import CodeReveal from '../components/CodeReveal';
import { Analytics, Scatter, ChartLine, Podium, Filter, Database, Target, Zap } from '../components/F1Icons';
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
import { Scatter as ScatterChart, Line, Bar } from 'react-chartjs-2';

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

export default function Stats() {
  const [qualiData, setQualiData] = useState([]);
  const [lapTimeData, setLapTimeData] = useState(null);
  const [podiumData, setPodiumData] = useState([]);
  const [yearRange, setYearRange] = useState([1990, 2024]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [qualiRes, lapRes, podiumRes] = await Promise.all([
        axios.get(`/api/stats/quali-vs-finish?startYear=${yearRange[0]}&endYear=${yearRange[1]}`),
        axios.get('/api/stats/lap-times-by-decade'),
        axios.get('/api/stats/podium-frequency'),
      ]);
      setQualiData(qualiRes.data);
      setLapTimeData(lapRes.data);
      setPodiumData(podiumRes.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, [yearRange]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const scatterData = {
    datasets: [{
      label: 'Quali vs Finish Position',
      data: qualiData.slice(0, 500).map(d => ({
        x: d.grid,
        y: d.position,
      })),
      backgroundColor: 'rgba(255, 28, 46, 0.5)',
      borderColor: '#ff1c2e',
    }],
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Grid: ${context.raw.x}, Finish: ${context.raw.y}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Grid Position', color: '#888' },
        ticks: { color: '#888' },
        grid: { color: '#1a1a1a' },
        min: 1,
        max: 26,
      },
      y: {
        title: { display: true, text: 'Finish Position', color: '#888' },
        ticks: { color: '#888' },
        grid: { color: '#1a1a1a' },
        min: 1,
        max: 26,
        reverse: false,
      },
    },
  };

  const lapTimeChartData = lapTimeData ? {
    labels: lapTimeData.decades,
    datasets: [{
      label: 'Avg Lap Time (seconds)',
      data: lapTimeData.avgTimes,
      borderColor: '#ff1c2e',
      backgroundColor: 'rgba(255, 28, 46, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  } : null;

  const lineOptions = {
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
        title: { display: true, text: 'Seconds', color: '#888' },
        ticks: { color: '#888' },
        grid: { color: '#1a1a1a' },
      },
    },
  };

  const podiumChartData = {
    labels: podiumData.slice(0, 15).map(d => d.name),
    datasets: [{
      label: 'Podium Finishes',
      data: podiumData.slice(0, 15).map(d => d.podiums),
      backgroundColor: [
        '#ffd700', '#c0c0c0', '#cd7f32',
        ...Array(12).fill('#ff1c2e'),
      ],
      borderRadius: 8,
    }],
  };

  const barOptions = {
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

  const scatterSql = `-- qualifying_vs_finish_correlation.sql
-- Analyze the correlation between grid position and final race position

SELECT 
    res.grid AS starting_position,
    res.position AS finish_position,
    res.positionOrder,
    CONCAT(d.forename, ' ', d.surname) AS driver_name,
    r.name AS race_name,
    r.year AS season
FROM results res
INNER JOIN drivers d ON res.driverId = d.driverId
INNER JOIN races r ON res.raceId = r.raceId
WHERE res.grid > 0 
    AND res.grid <= 20
    AND res.position IS NOT NULL
    AND res.position > 0
    AND r.year BETWEEN @start_year AND @end_year
ORDER BY r.year DESC, r.round ASC
LIMIT 5000;

-- Aggregated correlation view
SELECT 
    grid AS starting_position,
    ROUND(AVG(positionOrder), 2) AS avg_finish_position,
    COUNT(*) AS total_races,
    ROUND(
        (COUNT(CASE WHEN positionOrder <= grid THEN 1 END) * 100.0) / COUNT(*), 1
    ) AS positions_gained_pct
FROM results
WHERE grid > 0 AND grid <= 20
GROUP BY grid
ORDER BY grid;`;

  const lapTimeSql = `-- lap_time_evolution_by_decade.sql
-- Track the evolution of average lap times across decades

SELECT 
    CONCAT(FLOOR(r.year / 10) * 10, 's') AS decade,
    ROUND(AVG(lt.milliseconds) / 1000, 2) AS avg_lap_time_seconds,
    MIN(lt.milliseconds) / 1000 AS fastest_lap_seconds,
    COUNT(DISTINCT lt.raceId) AS total_races_with_data,
    COUNT(*) AS total_lap_records
FROM lap_times lt
INNER JOIN races r ON lt.raceId = r.raceId
WHERE lt.milliseconds > 0
GROUP BY FLOOR(r.year / 10)
ORDER BY FLOOR(r.year / 10) ASC;

-- Detailed fastest laps by year
SELECT 
    r.year,
    r.name AS race_name,
    MIN(lt.milliseconds) / 1000 AS fastest_lap_seconds,
    CONCAT(d.forename, ' ', d.surname) AS fastest_driver
FROM lap_times lt
INNER JOIN races r ON lt.raceId = r.raceId
INNER JOIN drivers d ON lt.driverId = d.driverId
WHERE lt.milliseconds > 0
GROUP BY r.year, r.raceId, r.name, d.forename, d.surname
HAVING MIN(lt.milliseconds) = (
    SELECT MIN(lt2.milliseconds) 
    FROM lap_times lt2 
    WHERE lt2.raceId = r.raceId
)
ORDER BY r.year DESC;`;

  const podiumSql = `-- podium_frequency_leaderboard.sql
-- Calculate total podium finishes (P1, P2, P3) for all drivers

SELECT 
    d.driverId,
    CONCAT(d.forename, ' ', d.surname) AS driver_name,
    d.nationality,
    COUNT(CASE WHEN res.position = 1 THEN 1 END) AS wins,
    COUNT(CASE WHEN res.position = 2 THEN 1 END) AS second_places,
    COUNT(CASE WHEN res.position = 3 THEN 1 END) AS third_places,
    COUNT(*) AS total_podiums,
    ROUND(
        (COUNT(*) * 100.0) / (
            SELECT COUNT(*) FROM results r2 
            WHERE r2.driverId = d.driverId
        ), 1
    ) AS podium_percentage
FROM results res
INNER JOIN drivers d ON res.driverId = d.driverId
WHERE res.position IN (1, 2, 3)
GROUP BY d.driverId, d.forename, d.surname, d.nationality
ORDER BY total_podiums DESC
LIMIT 20;

-- Podium breakdown by era
SELECT 
    CASE 
        WHEN r.year < 1970 THEN 'Classic Era (1950-1969)'
        WHEN r.year < 1990 THEN 'Turbo Era (1970-1989)'
        WHEN r.year < 2010 THEN 'Modern Era (1990-2009)'
        ELSE 'Hybrid Era (2010+)'
    END AS era,
    COUNT(CASE WHEN res.position = 1 THEN 1 END) AS total_wins,
    COUNT(CASE WHEN res.position = 2 THEN 1 END) AS total_p2,
    COUNT(CASE WHEN res.position = 3 THEN 1 END) AS total_p3
FROM results res
INNER JOIN races r ON res.raceId = r.raceId
WHERE res.position IN (1, 2, 3)
GROUP BY era
ORDER BY MIN(r.year);`;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[#ff1c2e] mb-2">
          <Analytics className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wider uppercase">Deep Performance Insights</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Scatter className="w-10 h-10 text-[#ff1c2e]" />
          Stats & Trends
        </h1>
        <p className="text-gray-400">Advanced analytics and pattern recognition across F1 history</p>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-6 mb-8 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#ff1c2e]" />
          Filter Data
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">Year Range</label>
            <div className="flex items-center gap-4">
              <select
                value={yearRange[0]}
                onChange={(e) => setYearRange([Number(e.target.value), yearRange[1]])}
                className="bg-[#1a1a1a] border border-[#ff1c2e]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ff1c2e]"
              >
                {Array.from({ length: 75 }, (_, i) => 1950 + i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <span className="text-gray-500">to</span>
              <select
                value={yearRange[1]}
                onChange={(e) => setYearRange([yearRange[0], Number(e.target.value)])}
                className="bg-[#1a1a1a] border border-[#ff1c2e]/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ff1c2e]"
              >
                {Array.from({ length: 75 }, (_, i) => 1950 + i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Scatter Plot */}
        <ChartCard
          title="Qualifying vs Finish Position"
          icon={<Scatter className="w-5 h-5" />}
          codeReveal={
            <CodeReveal
              title="qualifying_vs_finish_correlation.sql"
              code={scatterSql}
              explanation="This SQL query joins the results table with drivers and races to extract grid position vs finish position data. It calculates correlation metrics and shows what percentage of drivers gained positions from their starting spot."
              whyNeeded="Grid position data is critical for understanding race strategy and performance. Teams use this correlation to predict outcomes and optimize qualifying runs."
              keyInsights={[
                "Pole position has ~50% win rate historically",
                "Top 3 qualifiers finish on podium 70%+ of the time",
                "Overtaking from outside top 10 is statistically rare",
                "Modern aero makes qualifying even more crucial"
              ]}
            />
          }
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff1c2e]"></div>
            </div>
          ) : (
            <ScatterChart data={scatterData} options={scatterOptions} />
          )}
        </ChartCard>

        {/* Lap Time Evolution */}
        <ChartCard
          title="Average Lap Time Evolution"
          icon={<ChartLine className="w-5 h-5" />}
          codeReveal={
            <CodeReveal
              title="lap_time_evolution_by_decade.sql"
              code={lapTimeSql}
              explanation="This query aggregates lap time data from the lap_times table, grouping by decade to show performance improvements. It includes both average and fastest lap metrics for comprehensive analysis."
              whyNeeded="Tracking lap time evolution demonstrates how F1 technology has progressed. Engineers use historical data to benchmark current performance and set development targets."
              keyInsights={[
                "Lap times dropped ~30% since 1950s",
                "Major jumps during turbo and hybrid eras",
                "Ground effect cars (2022+) changed pace again",
                "Tire technology contributes to 20%+ of speed gains"
              ]}
            />
          }
        >
          {lapTimeChartData ? (
            <Line data={lapTimeChartData} options={lineOptions} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff1c2e]"></div>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Podium Frequency */}
      <ChartCard
        title="Podium Frequency by Driver"
        icon={<Podium className="w-5 h-5" />}
        codeReveal={
          <CodeReveal
            title="podium_frequency_leaderboard.sql"
            code={podiumSql}
            explanation="This query counts all P1, P2, and P3 finishes for each driver, calculating podium percentage and breaking down results by era. The CASE statements separate wins from 2nd and 3rd place finishes."
            whyNeeded="Podium frequency is a key performance metric that shows consistency over raw wins. Teams evaluate driver value based on their ability to regularly finish in top positions."
            keyInsights={[
              "Hamilton leads with 190+ career podiums",
              "Top 5 drivers have 40%+ podium rates",
              "Modern era sees more repeat podium finishers",
              "Championship winners average 15+ podiums per season"
            ]}
          />
        }
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff1c2e]"></div>
          </div>
        ) : (
          <Bar data={podiumChartData} options={barOptions} />
        )}
      </ChartCard>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#ff1c2e]/20 rounded-xl p-6 hover:border-[#ff1c2e]/40 transition-all duration-300">
          <div className="p-3 bg-[#ff1c2e]/10 rounded-lg w-fit mb-3">
            <Database className="w-8 h-8 text-[#ff1c2e]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Data Points</h3>
          <p className="text-gray-400 text-sm">
            Analyzing {qualiData.length.toLocaleString()}+ race results from {yearRange[0]} to {yearRange[1]}
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#ff1c2e]/20 rounded-xl p-6 hover:border-[#ff1c2e]/40 transition-all duration-300">
          <div className="p-3 bg-[#ff1c2e]/10 rounded-lg w-fit mb-3">
            <Target className="w-8 h-8 text-[#ff1c2e]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Correlation Insight</h3>
          <p className="text-gray-400 text-sm">
            Grid position has a strong correlation with finish position, especially for top qualifiers
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#ff1c2e]/20 rounded-xl p-6 hover:border-[#ff1c2e]/40 transition-all duration-300">
          <div className="p-3 bg-[#ff1c2e]/10 rounded-lg w-fit mb-3">
            <Zap className="w-8 h-8 text-[#ff1c2e]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Performance Trend</h3>
          <p className="text-gray-400 text-sm">
            Cars have gotten significantly faster over the decades due to technological advancements
          </p>
        </div>
      </div>
    </div>
  );
}
