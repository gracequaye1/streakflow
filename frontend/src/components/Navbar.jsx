import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";

export default function Navbar({ tab, setTab }) {
  const { user, logout, darkMode, setDarkMode } = useAuth();
  const { resetGame } = useGame();

  const handleLogout = () => {
    resetGame();   // reset game first
    logout();      // then log out
  };

  // ... rest of component stays the same ...

  // Change the logout button to use handleLogout:
  <button onClick={handleLogout}   // CHANGE logout to handleLogout
    className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800
               flex items-center justify-center text-lg hover:scale-105 transition-transform"
    title="Logout">
    Sign out
  </button>


  const tabs = [
    { id: "dashboard", icon: "🏠", label: "Home"     },
    { id: "habits",    icon: "✅", label: "Habits"   },
    { id: "analytics", icon: "📈", label: "Stats"    },
    { id: "schedule",  icon: "📅", label: "Schedule" },
    { id: "journal",    icon: "📓", label: "Journal" },
  ];

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#161b27]
                          border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500
                            flex items-center justify-center text-xl shadow shadow-indigo-200">
              🔥
            </div>
            <div>
              <div className="font-extrabold text-gray-900 dark:text-white leading-tight">StreakFlow</div>
              <div className="text-xs text-gray-400">Hi, {user?.name?.split(" ")[0]} 👋</div>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode(d => !d)}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800
                         flex items-center justify-center text-lg hover:scale-105 transition-transform">
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button onClick={logout}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800
                         flex items-center justify-center text-lg hover:scale-105 transition-transform"
              title="Logout">
              🚪
            </button>
          </div>
        </div>

        {/* Tab strip */}
        <div className="max-w-3xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all
                ${tab === t.id
                  ? "border-brand-500 text-brand-500"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50
                      bg-white dark:bg-[#161b27] border-t border-gray-200 dark:border-gray-800
                      flex justify-around py-2 pb-safe sm:hidden">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-opacity
              ${tab === t.id ? "opacity-100" : "opacity-40"}`}>
            <span className="text-2xl">{t.icon}</span>
            <span className={`text-[10px] font-bold ${tab === t.id ? "text-brand-500" : "text-gray-400"}`}>
              {t.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
}