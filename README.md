# 🏎️ F1 World Championship Dashboard (1950-2024)

A comprehensive data visualization dashboard for Formula 1 World Championship statistics spanning 74 years of racing history.

![F1 Dashboard](https://img.shields.io/badge/F1-Dashboard-red?style=for-the-badge&logo=formula1)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?style=flat-square&logo=chart.js)

## ✨ Features

### 🏁 Home - Season Overview
- Welcome banner with championship history
- Total stats cards (Races, Drivers, Teams)
- Season selector (1950-2024)
- Quick navigation to other sections

### 🏆 Drivers - Driver Legends
- **Bar Chart**: Most Race Wins (All-Time)
- **Line Chart**: Driver performance over years
- **Driver Cards**: Top 12 drivers with nationality, wins, and podiums
- Interactive code reveal for each visualization

### 🏎️ Teams - Constructors Battleground
- **Bar Chart**: All-Time Constructor Wins
- **Stacked Bar Chart**: Wins by Decade (Top 5 Teams)
- **Team Cards**: Hall of Fame with team colors
- Color-coded by actual F1 team colors

### 📅 Seasons - Year by Year
- Interactive year slider (1950-2024)
- Horizontal scrollable race calendar
- Championship standings bar chart
- Full standings table with gold/silver/bronze highlighting

### ⚙️ Stats & Trends - Deep Performance Insights
- **Scatter Plot**: Qualifying vs Finish Position correlation
- **Line Chart**: Average Lap Time Evolution by decade
- **Bar Chart**: Podium Frequency by driver
- Year range filter

## 🎨 Design Features

- **Dark Mode**: Core background (#0a0a0a)
- **Red Accents**: F1 red (#ff1c2e) for interactive elements
- **Modern Typography**: Inter font family
- **Smooth Animations**: Card hover effects, fade-in transitions
- **Interactive Code Reveal**: Each chart has a "Show Code" button with syntax-highlighted code and explanations

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS 4
- **Charts**: Chart.js, react-chartjs-2
- **Routing**: React Router DOM
- **Backend**: Express.js, Node.js
- **Data**: CSV parsing from Kaggle F1 dataset

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- Python 3.8+ (for dataset download)
- npm or yarn

### Step 1: Install Dependencies

```bash
# Install all dependencies
npm run install:all

# Or manually:
npm install
cd frontend && npm install
cd ../backend && npm install
```

### Step 2: Download F1 Dataset

```bash
python download_data.py
```

This downloads the F1 World Championship dataset from Kaggle and copies CSV files to the `dataset/` folder.

### Step 3: Run the Dashboard

**Option 1: Run both servers (Windows)**
```bash
npm run dev:all
```

**Option 2: Run separately in two terminals**

Terminal 1 (Backend):
```bash
cd backend
node server.js
```

Terminal 2 (Frontend):
```bash
cd frontend
node node_modules/vite/bin/vite.js
```

### Step 4: Open the Dashboard

Navigate to: **http://localhost:5173**

## 📁 Project Structure

```
big_data_dashboard/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── ChartCard.jsx
│   │   │   ├── CodeReveal.jsx
│   │   │   └── StatCard.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Drivers.jsx
│   │   │   ├── Teams.jsx
│   │   │   ├── Seasons.jsx
│   │   │   └── Stats.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── backend/                  # Express API server
│   ├── server.js
│   └── package.json
├── dataset/                  # F1 CSV data files
│   ├── drivers.csv
│   ├── constructors.csv
│   ├── races.csv
│   ├── results.csv
│   └── ...
├── download_data.py          # Dataset downloader
├── package.json              # Root package.json
└── README.md
```

## 🔌 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/stats/overview` | Total races, drivers, constructors |
| `GET /api/drivers` | All drivers list |
| `GET /api/drivers/top-wins` | Top 50 drivers by wins |
| `GET /api/drivers/:id/performance` | Driver yearly performance |
| `GET /api/constructors` | All constructors |
| `GET /api/constructors/top-wins` | Top constructors by wins |
| `GET /api/constructors/wins-by-decade` | Decade breakdown |
| `GET /api/seasons/:year` | Season overview |
| `GET /api/races/season/:year` | Races in a season |
| `GET /api/standings/season/:year` | Driver standings |
| `GET /api/stats/quali-vs-finish` | Quali/finish correlation |
| `GET /api/stats/lap-times-by-decade` | Lap time evolution |
| `GET /api/stats/podium-frequency` | Podium counts |

## 📊 Data Source

Dataset from Kaggle: [Formula 1 World Championship (1950-2020)](https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020)

Contains:
- 861 drivers
- 1,125 races
- 26,759 race results
- 210+ constructors
- 74 seasons of data

## 🎯 Interactive Code Reveal

Each chart card includes a "Show Code" button that reveals:
1. **React + Chart.js code** - The actual component code
2. **Explanation** - What the chart shows and why it's useful

Example:
```jsx
<CodeReveal
  title="DriversWinsChart.jsx"
  code={barChartCode}
  explanation="This bar chart shows the all-time race win leaders..."
/>
```
## 📜 License

MIT License - Feel free to use and modify for educational purposes.

---

Built with ❤️ for F1 fans and data enthusiasts
#

