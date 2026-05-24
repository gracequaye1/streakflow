import {
  Home, CheckSquare, BarChart2, BookOpen,
  Target, Calendar, Grid, Moon, Sun, LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";

const tabs = [
  { id: "dashboard",  icon: Home,        label: "Home"       },
  { id: "habits",     icon: CheckSquare, label: "Habits"     },
  { id: "analytics",  icon: BarChart2,   label: "Stats"      },
  { id: "journal",    icon: BookOpen,    label: "Journal"    },
  { id: "challenges", icon: Target,      label: "Challenges" },
  { id: "timetable",  icon: Grid,        label: "Timetable"  },
  { id: "schedule",   icon: Calendar,    label: "Schedule"   },
];

export default function Navbar({ tab, setTab }) {
  const { user, logout, darkMode, setDarkMode } = useAuth();
  const { resetGame } = useGame();

  const handleLogout = () => {
    resetGame();
    logout();
  };

  return (
    <>
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#161b27]
                          border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500
                            flex items-center justify-center shadow shadow-indigo-200 flex-shrink-0">
              <span className="text-white font-extrabold text-sm">SF</span>
            </div>
            <div>
              <div className="font-extrabold text-gray-900 dark:text-white leading-tight text-sm">
                StreakFlow
              </div>
              <div className="text-xs text-gray-400">
                Hi, {user?.name?.split(" ")[0]}
              </div>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(d => !d)}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800
                         flex items-center justify-center
                         hover:bg-gray-200 dark:hover:bg-gray-700
                         transition-all hover:scale-105"
              title="Toggle dark mode">
              {darkMode
                ? <Sun size={16} className="text-yellow-500" />
                : <Moon size={16} className="text-gray-500" />
              }
            </button>
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800
                         flex items-center justify-center
                         hover:bg-red-50 dark:hover:bg-red-900/20
                         hover:text-red-500 transition-all hover:scale-105"
              title="Logout">
              <LogOut size={16} className="text-gray-500 hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* ── Desktop tab strip ── */}
        <div className="max-w-3xl mx-auto px-4 overflow-x-auto
                        flex gap-0 scrollbar-none hidden sm:flex">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold
                            whitespace-nowrap border-b-2 transition-all flex-shrink-0
                  ${tab === t.id
                    ? "border-brand-500 text-brand-500"
                    : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}>
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50
                      bg-white dark:bg-[#161b27]
                      border-t border-gray-200 dark:border-gray-800
                      sm:hidden">
        <div className="flex overflow-x-auto scrollbar-none
                        divide-x divide-gray-100 dark:divide-gray-800">
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex flex-col items-center justify-center
                            gap-0.5 py-2 flex-1 min-w-[52px]
                            transition-all duration-200
                  ${isActive
                    ? "text-brand-500"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={`text-[9px] font-bold tracking-wide
                  ${isActive ? "text-brand-500" : "text-gray-400"}`}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}