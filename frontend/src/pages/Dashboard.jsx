import { useState } from "react";
import Navbar from "../components/Navbar";
import HabitCard from "../components/HabitCard";
import SkeletonCard from "../components/SkeletonCard";
import SchedulePage from "./SchedulePage";
import Footer from "../components/Footer";
import { TodayReflection, WeeklySummary, JournalHistory } from "../components/DailyReflection";
import { useHabits } from "../hooks/useHabits";
import { useReminders } from "../hooks/useReminders";
import toast from "react-hot-toast";

const CATEGORIES = ["All","Spiritual","Fitness","Health","Wellness","Growth","Productivity"];
const QUOTES = [
  { text: "We are what we repeatedly do. Excellence is not an act, but a habit.", author: "Aristotle" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear" },
];

const DEFAULT_HABITS = [
  { name:"Bible Reading",    icon:"📖", category:"Spiritual",    color:"#f59e0b", description:"Daily scripture reading" },
  { name:"Prayer Time",      icon:"🙏", category:"Spiritual",    color:"#8b5cf6", description:"Morning & evening prayer" },
  { name:"Workout / Gym",    icon:"💪", category:"Fitness",      color:"#ef4444", description:"Strength training session" },
  { name:"Walk 30 Minutes",  icon:"🚶", category:"Fitness",      color:"#10b981", description:"30-min walk outdoors" },
  { name:"Coding / Study",   icon:"💻", category:"Growth",       color:"#3b82f6", description:"Programming or studying" },
  { name:"Skincare Routine", icon:"✨", category:"Wellness",     color:"#ec4899", description:"AM & PM skincare" },
  { name:"Medicine/Vitamins",icon:"💊", category:"Health",       color:"#f97316", description:"Daily supplements" },
  { name:"Water Intake",     icon:"💧", category:"Health",       color:"#06b6d4", description:"Drink 8 glasses" },
];

function FullHeatmap({ habits }) {
  const days = Array.from({ length: 84 }, (_, i) => {
    const d = new Date(Date.now() - (83 - i) * 86400000);
    return { key: d.toISOString().split("T")[0], d };
  });

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1" style={{ width: "max-content" }}>
        {Array.from({ length: 12 }, (_, col) => (
          <div key={col} className="flex flex-col gap-1">
            {Array.from({ length: 7 }, (_, row) => {
              const idx = col * 7 + row;
              if (idx >= days.length) return <div key={row} className="w-3.5 h-3.5" />;
              const { key } = days[idx];
              const count = habits.filter(h => h.completionHistory?.[key]).length;
              const pct = count / Math.max(habits.length, 1);
              return (
                <div key={row} title={`${key}: ${count}/${habits.length}`}
                  className="w-3.5 h-3.5 rounded-sm hover:scale-125 transition-transform cursor-default"
                  style={{
                    background: pct === 0
                      ? "rgb(243 244 246)"
                      : `rgba(99,102,241,${0.15 + pct * 0.85})`
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function HabitModal({ habit, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(habit || {
    name: "", icon: "", category: "Growth", description: "", color: "#6366f1"
  });
  const isEdit = !!habit?._id;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-md p-7 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
            {isEdit ? "Edit Habit" : "New Habit"}
          </h3>
          <button onClick={onClose} className="btn-ghost !px-3 !py-1.5 text-sm">X</button>
        </div>

        <div className="space-y-4">
          {[
            { label: "Name",        key: "name",        placeholder: "e.g. Morning Run" },
            { label: "Icon",        key: "icon",        placeholder: "e.g. star, sun" },
            { label: "Description", key: "description", placeholder: "What is this habit?" },
          ].map(f => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <input
                className="input"
                type="text"
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select
                className="input"
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              >
                {CATEGORIES.filter(c => c !== "All").map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Color</label>
              <input
                type="color"
                value={form.color}
                className="input !p-1 !h-10 cursor-pointer"
                onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
            <div>
              <div className="text-sm font-semibold text-gray-800 dark:text-white">Daily Reminder</div>
              <div className="text-xs text-gray-400">Get notified at a set time</div>
            </div>
            <input
              type="checkbox"
              checked={form.reminder || false}
              onChange={e => setForm(p => ({ ...p, reminder: e.target.checked }))}
              className="w-5 h-5 accent-indigo-500 cursor-pointer"
            />
          </div>

          {form.reminder && (
            <div>
              <label className="label">Reminder Time</label>
              <input
                type="time"
                value={form.reminderTime || "08:00"}
                className="input"
                onChange={e => setForm(p => ({ ...p, reminderTime: e.target.value }))}
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          {isEdit && (
            <button
              onClick={() => onDelete(habit._id)}
              className="btn-ghost !bg-red-50 dark:!bg-red-900/20 !text-red-500 px-4"
            >
              Delete
            </button>
          )}
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button
            onClick={() => form.name.trim() && onSave(form)}
            className="btn-primary flex-1"
          >
            {isEdit ? "Save Changes" : "Add Habit"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────
export default function Dashboard() {
  const { habits, loading, toggleToday, createHabit, updateHabit, deleteHabit } = useHabits();
  useReminders(habits);

  const [tab, setTab]          = useState("dashboard");
  const [filterCat, setFilter] = useState("All");
  const [modal, setModal]      = useState(null);

  const quote   = QUOTES[new Date().getDay() % QUOTES.length];
  const today   = new Date().toISOString().split("T")[0];
  const todayDone = habits.filter(h => h.completionHistory?.[today]).length;
  const pct     = habits.length ? Math.round((todayDone / habits.length) * 100) : 0;
  const filtered = filterCat === "All" ? habits : habits.filter(h => h.category === filterCat);

  const handleSeed = async () => {
    for (const h of DEFAULT_HABITS) await createHabit(h);
    toast.success("Starter habits added!");
  };

  const handleSave = async (form) => {
    if (form._id) await updateHabit(form._id, form);
    else await createHabit(form);
    setModal(null);
  };

  const handleDelete = async (id) => {
    await deleteHabit(id);
    setModal(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] pb-24">
      <Navbar tab={tab} setTab={setTab} />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] pb-24">
      <Navbar tab={tab} setTab={setTab} />

      {modal && (
        <HabitModal
          habit={modal === "add" ? null : modal}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      )}

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* ── DASHBOARD TAB ── */}
        {tab === "dashboard" && (
          <div className="space-y-5 animate-fade-in">

            {/* Quote banner */}
            <div className="relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br from-brand-500 to-purple-600">
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
              <p className="font-semibold text-base italic leading-relaxed max-w-md">"{quote.text}"</p>
              <p className="text-sm mt-2 opacity-70">— {quote.author}</p>
            </div>

            {/* Progress ring card */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-extrabold text-lg text-gray-900 dark:text-white">Today's Progress</h2>
                  <p className="text-sm text-gray-400">
                    {new Date().toLocaleDateString("en", { weekday:"long", month:"long", day:"numeric" })}
                  </p>
                </div>
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor"
                      className="text-gray-100 dark:text-gray-800" strokeWidth="6" />
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#6366f1" strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${pct * 1.759} 175.9`}
                      className="transition-all duration-700" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-brand-500">
                    {pct}%
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">{todayDone} of {habits.length} habits completed</p>
            </div>

            {/* Quick checklist */}
            <div className="card p-5">
              <h3 className="font-extrabold text-gray-900 dark:text-white mb-4">Quick Check-in</h3>
              <div className="space-y-2">
                {habits.map(h => {
                  const done = !!h.completionHistory?.[today];
                  return (
                    <div
                      key={h._id}
                      onClick={() => toggleToday(h._id)}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      style={{ background: done ? h.color + "11" : undefined }}
                    >
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs text-white transition-all"
                        style={{
                          background: done ? h.color : "transparent",
                          border: `2px solid ${done ? h.color : "#d1d5db"}`
                        }}
                      >
                        {done ? "✓" : ""}
                      </div>
                      <span className="text-lg">{h.icon}</span>
                      <span className={`text-sm font-semibold ${done ? "line-through text-gray-400" : "text-gray-800 dark:text-gray-200"}`}>
                        {h.name}
                      </span>
                      {h.currentStreak > 0 && (
                        <span className="ml-auto text-xs font-bold" style={{ color: h.color }}>
                          {h.currentStreak} streak
                        </span>
                      )}
                    </div>
                  );
                })}
                {habits.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No habits yet. Add your first one!</p>
                    <button onClick={handleSeed} className="btn-primary text-sm">
                      Load Starter Habits
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Heatmap */}
            {habits.length > 0 && (
              <div className="card p-5">
                <h3 className="font-extrabold text-gray-900 dark:text-white mb-1">12-Week Overview</h3>
                <p className="text-xs text-gray-400 mb-4">Combined completions across all habits</p>
                <FullHeatmap habits={habits} />
              </div>
            )}

            {/* Today's reflection */}
            <TodayReflection habits={habits} />

            {/* Weekly reflection summary */}
            <WeeklySummary />

          </div>
        )}

        {/* ── HABITS TAB ── */}
        {tab === "habits" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-extrabold text-xl text-gray-900 dark:text-white">Your Habits</h2>
                <p className="text-sm text-gray-400">{habits.length} habits tracked</p>
              </div>
              <button onClick={() => setModal("add")} className="btn-primary text-sm">+ Add</button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border
                    ${filterCat === c
                      ? "bg-brand-500 text-white border-brand-500"
                      : "bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-brand-500"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {filtered.length === 0
              ? <div className="card p-10 text-center text-gray-400">No habits in this category</div>
              : filtered.map(h => (
                  <HabitCard key={h._id} habit={h} onToggle={toggleToday} onEdit={setModal} />
                ))
            }
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {tab === "analytics" && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-extrabold text-xl text-gray-900 dark:text-white">Analytics</h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Best Streak",  value: `${Math.max(...habits.map(h => h.longestStreak), 0)} days`, color: "text-red-500" },
                { label: "Avg Streak",   value: `${habits.length ? Math.round(habits.reduce((a,h) => a + h.currentStreak, 0) / habits.length) : 0}d`, color: "text-brand-500" },
                { label: "Total Habits", value: habits.length, color: "text-green-500" },
                { label: "All-Time Done", value: habits.reduce((a,h) => a + h.totalCompleted, 0), color: "text-yellow-500" },
              ].map(s => (
                <div key={s.label} className="card p-5 text-center">
                  <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="card p-5">
              <h3 className="font-extrabold text-gray-900 dark:text-white mb-4">Streak Leaderboard</h3>
              {[...habits].sort((a,b) => b.currentStreak - a.currentStreak).map((h, i) => (
                <div key={h._id} className="flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span className="w-6 text-center font-bold text-sm text-gray-400">{i + 1}</span>
                  <span className="text-lg">{h.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{h.name}</div>
                    <div className="mt-1 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, (h.currentStreak / 30) * 100)}%`, background: h.color }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: h.color }}>{h.currentStreak} streak</span>
                </div>
              ))}
              {habits.length === 0 && (
                <p className="text-center text-gray-400 py-6">No habits to rank yet</p>
              )}
            </div>

            <div className="card p-5">
              <h3 className="font-extrabold text-gray-900 dark:text-white mb-4">30-Day Consistency</h3>
              {habits.map(h => {
                const rate = Math.round(
                  Array.from({ length: 30 }, (_, i) =>
                    h.completionHistory?.[new Date(Date.now() - i * 86400000).toISOString().split("T")[0]]
                  ).filter(Boolean).length / 30 * 100
                );
                return (
                  <div key={h._id} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{h.icon} {h.name}</span>
                      <span className="font-bold" style={{ color: h.color }}>{rate}%</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${rate}%`, background: h.color }}
                      />
                    </div>
                  </div>
                );
              })}
              {habits.length === 0 && (
                <p className="text-center text-gray-400 py-6">No data yet</p>
              )}
            </div>
          </div>
        )}

        {/* ── JOURNAL TAB ── */}
        {tab === "journal" && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="font-extrabold text-xl text-gray-900 dark:text-white">Journal</h2>
              <p className="text-sm text-gray-400 mt-1">Your daily reflections and growth notes</p>
            </div>
            <TodayReflection habits={habits} />
            <WeeklySummary />
            <div>
              <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-3">Past Reflections</h3>
              <JournalHistory />
            </div>
          </div>
        )}

        {/* ── SCHEDULE TAB ── */}
        {tab === "schedule" && <SchedulePage />}

      </main>
      <Footer />
    </div>
  );
}