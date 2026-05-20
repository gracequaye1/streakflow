import { useState } from 'react';
import { useSchedule } from '../hooks/useSchedule';

const TYPES = [
  { id: 'personal', label: '🌅 Personal', color: '#f59e0b' },
  { id: 'work',     label: '💼 Work',     color: '#3b82f6' },
  { id: 'freetime', label: '🎉 Free Time',color: '#10b981' },
];

const COLORS = ['#6366f1','#f59e0b','#ef4444','#10b981','#3b82f6','#ec4899','#8b5cf6','#f97316'];

function ScheduleView({ type }) {
  const { schedule, loading, addTask, toggleTask, deleteTask, resetDone } = useSchedule(type);
  const [form, setForm]       = useState({ title: '', time: '09:00', color: '#6366f1' });
  const [showForm, setShowForm] = useState(false);

  const tasks    = schedule?.tasks ?? [];
  const doneCount = tasks.filter(t => t.done).length;
  const pct       = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    await addTask(form);
    setForm({ title: '', time: '09:00', color: '#6366f1' });
    setShowForm(false);
  };

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3,4].map(i => (
        <div key={i} className="card p-4 animate-pulse flex gap-3 items-center">
          <div className="w-4 h-10 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">

      {/* Progress bar */}
      <div className="card p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-bold text-gray-800 dark:text-white">
            Today's Progress
          </span>
          <span className="font-extrabold text-brand-500">{pct}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-400">
            {doneCount} of {tasks.length} tasks done
          </p>
          <button
            onClick={resetDone}
            className="text-xs text-gray-400 hover:text-brand-500 font-semibold transition-colors"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Task list */}
      <div className="card overflow-hidden">
        {tasks
          .slice()
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((task, i, arr) => (
            <div
              key={task._id}
              className={`flex items-center gap-3 px-5 py-3.5 transition-colors cursor-pointer
                hover:bg-gray-50 dark:hover:bg-gray-800/50
                ${i < arr.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}
                ${task.done ? 'opacity-60' : ''}`}
              onClick={() => toggleTask(task._id)}
            >
              {/* Time */}
              <span className="text-xs font-bold text-gray-400 w-12 flex-shrink-0">
                {task.time}
              </span>

              {/* Color bar */}
              <div
                className="w-1 h-8 rounded-full flex-shrink-0"
                style={{ background: task.color }}
              />

              {/* Checkbox */}
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center
                           flex-shrink-0 text-white text-xs font-bold transition-all"
                style={{
                  background: task.done ? task.color : 'transparent',
                  border: `2px solid ${task.done ? task.color : '#d1d5db'}`,
                }}
              >
                {task.done ? '✓' : ''}
              </div>

              {/* Title */}
              <span
                className={`flex-1 text-sm font-semibold transition-all
                  ${task.done
                    ? 'line-through text-gray-400'
                    : 'text-gray-800 dark:text-gray-200'
                  }`}
              >
                {task.title}
              </span>

              {/* Delete */}
              <button
                onClick={e => { e.stopPropagation(); deleteTask(task._id); }}
                className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg
                           flex items-center justify-center text-gray-300
                           hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
                           transition-all text-sm flex-shrink-0"
              >
                ✕
              </button>
            </div>
          ))}

        {tasks.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-semibold">No tasks yet</p>
            <p className="text-sm mt-1">Add your first task below</p>
          </div>
        )}
      </div>

      {/* Add task form */}
      {showForm ? (
        <div className="card p-5 space-y-4 animate-slide-up">
          <h4 className="font-bold text-gray-800 dark:text-white">New Task</h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="label">Color</label>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setForm(p => ({ ...p, color: c }))}
                    className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                    style={{
                      background: c,
                      ring: form.color === c ? `2px solid ${c}` : 'none',
                      outline: form.color === c ? `2px solid ${c}` : 'none',
                      outlineOffset: '2px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="label">Task Name</label>
            <input
              type="text"
              placeholder="e.g. Team standup"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="input"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button onClick={handleAdd} className="btn-primary flex-1">
              Add Task 
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary w-full"
        >
          ＋ Add Task
        </button>
      )}
    </div>
  );
}

export default function SchedulePage() {
  const [activeType, setActiveType] = useState('personal');

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="font-extrabold text-xl text-gray-900 dark:text-white">
          Schedule Planner
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {new Date().toLocaleDateString('en', {
            weekday: 'long', month: 'long', day: 'numeric'
          })}
        </p>
      </div>

      {/* Type switcher */}
      <div className="grid grid-cols-3 gap-2">
        {TYPES.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveType(t.id)}
            className={`py-2.5 rounded-xl text-sm font-bold transition-all border
              ${activeType === t.id
                ? 'text-white border-transparent shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'
              }`}
            style={activeType === t.id ? { background: t.color, borderColor: t.color } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ScheduleView key={activeType} type={activeType} />
    </div>
  );
}