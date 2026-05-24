import { useMemo } from "react";
import {
  Flame, Trophy, CheckCircle, Circle,
  Settings, TrendingUp
} from "lucide-react";

function getMilestone(streak) {
  if (streak >= 365) return { label: "365-Day Legend",  color: "#f59e0b" };
  if (streak >= 100) return { label: "100-Day Champion",color: "#f59e0b" };
  if (streak >= 30)  return { label: "30-Day Warrior",  color: "#8b5cf6" };
  if (streak >= 7)   return { label: "7-Day Streak",    color: "#ef4444" };
  if (streak >= 3)   return { label: "3-Day Run",       color: "#10b981" };
  return null;
}

function MiniHeatmap({ completionHistory = {}, color }) {
  const cells = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(Date.now() - (29 - i) * 86400000)
        .toISOString().split("T")[0];
      return { key: d, done: !!completionHistory[d] };
    });
  }, [completionHistory]);

  return (
    <div className="flex gap-0.5 flex-wrap mt-3">
      {cells.map(c => (
        <div key={c.key} title={c.key}
          className="w-3 h-3 rounded-sm transition-transform hover:scale-125 cursor-default"
          style={{ background: c.done ? color : "rgb(229 231 235)" }}
        />
      ))}
    </div>
  );
}

export default function HabitCard({ habit, onToggle, onEdit }) {
  const today = new Date().toISOString().split("T")[0];
  const done  = !!habit.completionHistory?.[today];
  const milestone = getMilestone(habit.currentStreak);
  const pct = habit.longestStreak
    ? Math.round((habit.currentStreak / habit.longestStreak) * 100)
    : 0;

  return (
    <div className={`card p-5 transition-all duration-300 relative overflow-hidden
                     ${done ? "shadow-md" : ""}`}
      style={{
        borderColor:  done ? habit.color + "55" : undefined,
        boxShadow:    done ? `0 4px 20px ${habit.color}18` : undefined,
      }}>

      {/* Top accent bar when done */}
      {done && (
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, ${habit.color}, ${habit.color}66)` }} />
      )}

      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">

          {/* Icon container */}
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center
                          flex-shrink-0 text-xl"
            style={{
              background: habit.color + "18",
              border: `1.5px solid ${habit.color}33`
            }}>
            {habit.icon}
          </div>

          {/* Name + description */}
          <div className="min-w-0">
            <div className="font-bold text-gray-900 dark:text-white text-sm truncate">
              {habit.name}
            </div>
            <div className="text-xs text-gray-400 mt-0.5 truncate">
              {habit.description}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => onEdit(habit)}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800
                       flex items-center justify-center
                       hover:bg-gray-200 dark:hover:bg-gray-700
                       transition-all hover:scale-105">
            <Settings size={14} className="text-gray-400" />
          </button>

          <button onClick={() => onToggle(habit._id)}
            className="w-9 h-9 rounded-full flex items-center justify-center
                       transition-all duration-200 active:scale-90 hover:scale-105"
            style={{
              border:     `2.5px solid ${done ? habit.color : "#d1d5db"}`,
              background: done ? habit.color : "transparent",
              boxShadow:  done ? `0 0 14px ${habit.color}44` : "none",
            }}>
            {done
              ? <CheckCircle size={16} color="#fff" strokeWidth={2.5} />
              : <Circle size={16} color="#d1d5db" />
            }
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mt-4">
        {[
          { label: "Current", value: habit.currentStreak,  color: habit.color, icon: <Flame size={11} /> },
          { label: "Longest", value: habit.longestStreak,  color: undefined,   icon: <Trophy size={11} /> },
          { label: "Total",   value: habit.totalCompleted, color: undefined,   icon: <TrendingUp size={11} /> },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              <span style={{ color: s.color || "#9ca3af" }}>{s.icon}</span>
              <span className="text-xl font-extrabold leading-none"
                style={{ color: s.color || undefined }}>
                {s.value}
              </span>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400">
              {s.label}
            </div>
          </div>
        ))}

        {/* Milestone badge */}
        {milestone && (
          <div className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: milestone.color + "18",
              color: milestone.color,
              border: `1px solid ${milestone.color}33`
            }}>
            {milestone.label}
          </div>
        )}
      </div>

      {/* Progress to longest streak */}
      {habit.longestStreak > 0 && (
        <div className="mt-3">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, pct)}%`, background: habit.color }} />
          </div>
        </div>
      )}

      {/* Mini heatmap */}
      <MiniHeatmap completionHistory={habit.completionHistory} color={habit.color} />
    </div>
  );
}