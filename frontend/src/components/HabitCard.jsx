import { useMemo } from "react";

function getMilestone(streak) {
  if (streak >= 365) return { label: "365-Day Legend 👑", color: "text-yellow-500" };
  if (streak >= 100) return { label: "100-Day Champion 🏆", color: "text-yellow-500" };
  if (streak >= 30)  return { label: "30-Day Streak 🌟",   color: "text-purple-500" };
  if (streak >= 7)   return { label: "7-Day Streak 🔥",    color: "text-red-500" };
  if (streak >= 3)   return { label: "3-Day Streak ⚡",    color: "text-green-500" };
  return null;
}

function MiniHeatmap({ completionHistory = {}, color }) {
  const cells = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0];
      return { key: d, done: !!completionHistory[d] };
    });
  }, [completionHistory]);

  return (
    <div className="flex gap-0.5 flex-wrap mt-3">
      {cells.map(c => (
        <div key={c.key} title={c.key}
          style={{ background: c.done ? color : undefined }}
          className={`w-3 h-3 rounded-sm transition-transform hover:scale-125
            ${c.done ? "" : "bg-gray-100 dark:bg-gray-800"}`} />
      ))}
    </div>
  );
}

export default function HabitCard({ habit, onToggle, onEdit }) {
  const today = new Date().toISOString().split("T")[0];
  const done  = !!habit.completionHistory?.[today];
  const milestone = getMilestone(habit.currentStreak);

  return (
    <div
      className="card p-5 transition-all duration-300 animate-slide-up"
      style={{ borderColor: done ? habit.color + "66" : undefined,
               boxShadow: done ? `0 4px 24px ${habit.color}22` : undefined }}>

      {/* Top accent bar when done */}
      {done && (
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${habit.color}, ${habit.color}88)` }} />
      )}

      <div className="flex items-start justify-between">
        {/* Left: icon + info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: habit.color + "22", border: `1.5px solid ${habit.color}44` }}>
            {habit.icon}
          </div>
          <div>
            <div className="font-bold text-gray-900 dark:text-white">{habit.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">{habit.description}</div>
          </div>
        </div>

        {/* Right: edit + check */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => onEdit(habit)}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800
                       flex items-center justify-center text-sm hover:scale-105 transition-transform">
            ⚙️
          </button>
          <button onClick={() => onToggle(habit._id)}
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm
                       transition-all duration-200 active:scale-90"
            style={{
              border: `2.5px solid ${done ? habit.color : "#d1d5db"}`,
              background: done ? habit.color : "transparent",
              color: done ? "#fff" : "transparent",
              boxShadow: done ? `0 0 16px ${habit.color}55` : "none",
            }}>
            ✓
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-5 mt-4">
        {[
          { label: "Current", value: habit.currentStreak, color: habit.color },
          { label: "Longest", value: habit.longestStreak, color: undefined },
          { label: "Total",   value: habit.totalCompleted, color: undefined },
        ].map(s => (
          <div key={s.label}>
            <div className="text-2xl font-extrabold leading-none"
              style={{ color: s.color || undefined }}
              >{s.value}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
        {milestone && (
          <div className={`ml-auto text-xs font-bold px-3 py-1 rounded-full bg-opacity-10 ${milestone.color}`}
            style={{ background: "currentColor" }}>
            <span style={{ mixBlendMode: "normal" }}>{milestone.label}</span>
          </div>
        )}
      </div>

      {/* Mini heatmap */}
      <MiniHeatmap completionHistory={habit.completionHistory} color={habit.color} />
    </div>
  );
}
