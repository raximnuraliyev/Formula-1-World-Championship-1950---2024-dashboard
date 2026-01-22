import { NavLink } from 'react-router-dom';
import { CheckeredFlag, Trophy, RacingCar, Calendar, Analytics } from './F1Icons';

export default function Layout({ children }) {
  const navItems = [
    { path: '/', label: 'Home', icon: <CheckeredFlag className="w-4 h-4" /> },
    { path: '/drivers', label: 'Drivers', icon: <Trophy className="w-4 h-4" /> },
    { path: '/teams', label: 'Teams', icon: <RacingCar className="w-4 h-4" /> },
    { path: '/seasons', label: 'Seasons', icon: <Calendar className="w-4 h-4" /> },
    { path: '/stats', label: 'Stats', icon: <Analytics className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#ff1c2e] rounded-lg">
                <RacingCar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                F1 <span className="text-[#ff1c2e]">Dashboard</span>
              </span>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
                      isActive
                        ? 'bg-[#ff1c2e] text-white shadow-lg shadow-[#ff1c2e]/30'
                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center gap-2">
            <RacingCar className="w-4 h-4 text-[#ff1c2e]" />
            F1 World Championship Dashboard
            <span className="text-[#ff1c2e]">|</span>
            Data from 1950-2024
          </p>
          <p className="mt-1 text-gray-600">Built with React + Chart.js + Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
