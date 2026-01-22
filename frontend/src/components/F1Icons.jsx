// Modern F1-themed SVG Icons - No emojis, pure racing aesthetics

export const Icons = {
  // Racing & Speed
  RacingCar: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 17h14M3 13l2-3h2l2-3h6l2 3h2l2 3M5 13v4h14v-4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="7" cy="17" r="2" fill="currentColor"/>
      <circle cx="17" cy="17" r="2" fill="currentColor"/>
    </svg>
  ),
  
  Speedometer: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 3" strokeLinecap="round"/>
      <path d="M12 3v2M3 12h2M21 12h-2M12 21v-2" strokeLinecap="round"/>
    </svg>
  ),

  Flag: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 21V4M4 4h12l-2 4 2 4H4" fill="currentColor" fillOpacity="0.2"/>
      <path d="M4 21V4M4 4h12l-2 4 2 4H4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  CheckeredFlag: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4v17h2V4H4zm4 0v4h4V4H8zm4 0v4h4V4h-4zm4 0v4h4V4h-4zM8 8v4h4V8H8zm4 0v4h4V8h-4zm4 0v4h4V8h-4zM8 12v4h4v-4H8zm4 0v4h4v-4h-4zm4 0v4h4v-4h-4zM8 16v4h4v-4H8zm4 0v4h4v-4h-4zm4 0v4h4v-4h-4z" fillOpacity="0.8"/>
    </svg>
  ),

  // Trophy & Achievement
  Trophy: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z"/>
      <path d="M7 8H4a1 1 0 01-1-1V5a1 1 0 011-1h3M17 8h3a1 1 0 001-1V5a1 1 0 00-1-1h-3"/>
      <path d="M12 13v4" strokeLinecap="round"/>
    </svg>
  ),

  Medal: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="15" r="5"/>
      <path d="M8 4l-3 7h3M16 4l3 7h-3M12 4v6"/>
      <path d="M12 13l1.5 1 1.5-1v3l-3 2-3-2v-3l1.5 1 1.5-1z" fill="currentColor" fillOpacity="0.3"/>
    </svg>
  ),

  Crown: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 8l4 12h12l4-12-5 4-5-8-5 8-5-4z" fill="currentColor" fillOpacity="0.2"/>
      <path d="M2 8l4 12h12l4-12-5 4-5-8-5 8-5-4z" strokeLinejoin="round"/>
      <circle cx="12" cy="4" r="1" fill="currentColor"/>
    </svg>
  ),

  Podium: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="14" width="6" height="8" rx="1" fillOpacity="0.6"/>
      <rect x="9" y="8" width="6" height="14" rx="1"/>
      <rect x="16" y="11" width="6" height="11" rx="1" fillOpacity="0.6"/>
      <text x="5" y="19" fontSize="5" fill="white" textAnchor="middle">2</text>
      <text x="12" y="15" fontSize="5" fill="white" textAnchor="middle">1</text>
      <text x="19" y="17" fontSize="5" fill="white" textAnchor="middle">3</text>
    </svg>
  ),

  // Driver & Helmet
  Helmet: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C7 2 3 6 3 11v4c0 2 1 4 3 5h12c2-1 3-3 3-5v-4c0-5-4-9-9-9z" fill="currentColor" fillOpacity="0.1"/>
      <path d="M12 2C7 2 3 6 3 11v4c0 2 1 4 3 5h12c2-1 3-3 3-5v-4c0-5-4-9-9-9z"/>
      <path d="M3 13h18M9 13v7M15 10h4" strokeLinecap="round"/>
    </svg>
  ),

  SteeringWheel: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 3v6M4.5 17l5-3M19.5 17l-5-3" strokeLinecap="round"/>
    </svg>
  ),

  // Data & Analytics
  ChartBar: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="12" width="4" height="9" rx="1" fill="currentColor" fillOpacity="0.3"/>
      <rect x="10" y="6" width="4" height="15" rx="1" fill="currentColor" fillOpacity="0.5"/>
      <rect x="17" y="9" width="4" height="12" rx="1" fill="currentColor" fillOpacity="0.3"/>
      <path d="M3 12h4M10 6h4M17 9h4" strokeLinecap="round"/>
    </svg>
  ),

  ChartLine: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 3v18h18"/>
      <path d="M6 15l4-4 4 2 5-7" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6" cy="15" r="1.5" fill="currentColor"/>
      <circle cx="10" cy="11" r="1.5" fill="currentColor"/>
      <circle cx="14" cy="13" r="1.5" fill="currentColor"/>
      <circle cx="19" cy="6" r="1.5" fill="currentColor"/>
    </svg>
  ),

  Analytics: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M7 13l3-3 3 3 4-4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="17" cy="9" r="1" fill="currentColor"/>
    </svg>
  ),

  Scatter: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 3v18h18"/>
      <circle cx="7" cy="14" r="2" fill="currentColor"/>
      <circle cx="11" cy="10" r="2" fill="currentColor"/>
      <circle cx="15" cy="12" r="2" fill="currentColor"/>
      <circle cx="18" cy="7" r="2" fill="currentColor"/>
    </svg>
  ),

  // Calendar & Time
  Calendar: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M3 10h18M8 2v4M16 2v4"/>
      <rect x="6" y="13" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.5"/>
      <rect x="10.5" y="13" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.3"/>
    </svg>
  ),

  Clock: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 6v6l4 2" strokeLinecap="round"/>
    </svg>
  ),

  Stopwatch: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="13" r="8"/>
      <path d="M12 9v4l2 2" strokeLinecap="round"/>
      <path d="M10 2h4M12 2v3M19 6l1.5-1.5" strokeLinecap="round"/>
    </svg>
  ),

  // Team & Garage
  Garage: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21V9l9-6 9 6v12" fill="currentColor" fillOpacity="0.1"/>
      <path d="M3 21V9l9-6 9 6v12"/>
      <path d="M9 21V14h6v7"/>
      <rect x="9" y="14" width="6" height="3" fill="currentColor" fillOpacity="0.3"/>
    </svg>
  ),

  Wrench: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  ),

  Gear: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
    </svg>
  ),

  // Navigation & UI
  Home: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"/>
    </svg>
  ),

  Search: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7"/>
      <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
    </svg>
  ),

  Filter: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
    </svg>
  ),

  Compass: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.3"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  ),

  // Data & Code
  Database: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="5" rx="8" ry="3"/>
      <path d="M20 5v14c0 1.66-3.58 3-8 3s-8-1.34-8-3V5"/>
      <path d="M20 12c0 1.66-3.58 3-8 3s-8-1.34-8-3"/>
    </svg>
  ),

  Code: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),

  Terminal: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M6 10l4 2-4 2M12 16h6" strokeLinecap="round"/>
    </svg>
  ),

  // Info & Status
  Info: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round"/>
    </svg>
  ),

  Lightbulb: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 18h6M10 22h4"/>
      <path d="M12 2a7 7 0 00-4 12.7V17a1 1 0 001 1h6a1 1 0 001-1v-2.3A7 7 0 0012 2z" fill="currentColor" fillOpacity="0.2"/>
      <path d="M12 2a7 7 0 00-4 12.7V17a1 1 0 001 1h6a1 1 0 001-1v-2.3A7 7 0 0012 2z"/>
    </svg>
  ),

  Target: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
    </svg>
  ),

  Zap: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),

  Fire: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2c1 3 3 5 3 8a5 5 0 01-10 0c0-3 2-5 3-8 1 2 3 3 4 0z" fill="currentColor" fillOpacity="0.3"/>
      <path d="M12 2c1 3 3 5 3 8a5 5 0 01-10 0c0-3 2-5 3-8 1 2 3 3 4 0z"/>
      <path d="M12 14a2 2 0 01-2-2c0-1 .5-2 1-3 .5 1 1.5 1.5 2 0 .5 1.5 1 2 1 3a2 2 0 01-2 2z"/>
    </svg>
  ),

  // Arrows & Direction
  ArrowDown: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  ArrowRight: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  TrendUp: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),

  // Misc Racing
  Tire: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>
    </svg>
  ),

  PitStop: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <path d="M6 6v12M10 6v12M14 6v12M18 6v12"/>
      <circle cx="6" cy="18" r="2"/>
      <circle cx="18" cy="18" r="2"/>
    </svg>
  ),

  Circuit: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 8c0-2 2-4 4-4h8c2 0 4 2 4 4v8c0 2-2 4-4 4H8c-2 0-4-2-4-4V8z"/>
      <path d="M8 4v4c0 1 1 2 2 2h4c1 0 2-1 2-2V4"/>
      <circle cx="12" cy="14" r="2" fill="currentColor"/>
    </svg>
  ),

  Position: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="10" r="3"/>
      <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z" fill="currentColor" fillOpacity="0.2"/>
      <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z"/>
    </svg>
  ),

  Table: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
    </svg>
  ),

  Grid: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" fillOpacity="0.3"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" fillOpacity="0.3"/>
    </svg>
  ),

  Spark: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L9 9H2l6 5-2.5 8L12 16l6.5 6-2.5-8 6-5h-7L12 2z"/>
    </svg>
  ),

  // Status markers
  Bullet: ({ className = "w-2 h-2" }) => (
    <svg className={className} viewBox="0 0 8 8" fill="currentColor">
      <circle cx="4" cy="4" r="3"/>
    </svg>
  ),

  Chevron: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// Export individual icons for easier imports
export const {
  RacingCar, Speedometer, Flag, CheckeredFlag,
  Trophy, Medal, Crown, Podium,
  Helmet, SteeringWheel,
  ChartBar, ChartLine, Analytics, Scatter,
  Calendar, Clock, Stopwatch,
  Garage, Wrench, Gear,
  Home, Search, Filter, Compass,
  Database, Code, Terminal,
  Info, Lightbulb, Target, Zap, Fire,
  ArrowDown, ArrowRight, TrendUp,
  Tire, PitStop, Circuit, Position,
  Table, Grid, Spark, Bullet, Chevron
} = Icons;
