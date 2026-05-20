import { useState, useEffect } from 'react';
import { useReflections } from '../hooks/useReflections';

const MOODS = [
  { value: 'happy',   label: 'Happy',   bg: 'bg-green-100 dark:bg-green-900/30',  border: 'border-green-400', text: 'text-green-600' },
  { value: 'neutral', label: 'Neutral', bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-400', text: 'text-yellow-600' },
  { value: 'sad',     label: 'Sad',     bg: 'bg-blue-100 dark:bg-blue-900/30',    border: 'border-blue-400',  text: 'text-blue-600'  },
];

const MOOD_ICONS = { happy: '😊', neutral: '😐', sad: '😔' };

function MoodIcon({ mood }) {
  const m = MOODS.find(m => m.value === mood) || MOODS[1];
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.bg} ${m.text}`}>
      {MOOD_ICONS[mood]} {m.label}
    </span>
  );
}

// Today's reflection form
export function TodayReflection({ habits = [] }) {
  const { save, todayReflection } = useReflections();
  const today = new Date().toISOString().split('T')[0];
  const existing = todayReflection();

  const [open, setOpen]       = useState(false);
  const [saved, setSaved]     = useState(false);
  const [form, setForm]       = useState({
    date: today,
    achievements: '',
    feelings: '',
    struggles: '',
    notes: '',
    mood: 'neutral',
    linkedHabits: [],
  });

  // Load existing reflection into form
  useEffect(() => {
    if (existing) {
      setForm({
        date: today,
        achievements: existing.achievements || '',
        feelings:     existing.feelings     || '',
        struggles:    existing.struggles    || '',
        notes:        existing.notes        || '',
        mood:         existing.mood         || 'neutral',
        linkedHabits: existing.linkedHabits || [],
      });
      setSaved(true);
    }
  }, [existing]);

  // Completed habits today
  const completedHabits = habits.filter(h => h.completionHistory?.[today]);

  const toggleLinkedHabit = (name) => {
    setForm(prev => ({
      ...prev,
      linkedHabits: prev.linkedHabits.includes(name)
        ? prev.linkedHabits.filter(h => h !== name)
        : [...prev.linkedHabits, name]
    }));
  };

  const handleSave = async () => {
    await save(form);
    setSaved(true);
    setOpen(false);
  };

  const field = (key, placeholder, rows = 2) => (
    <div>
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                   bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500
                   placeholder-gray-400 transition"
      />
    </div>
  );

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-gray-900 dark:text-white">Daily Reflection</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && existing && <MoodIcon mood={existing.mood} />}
          <button
            onClick={() => setOpen(o => !o)}
            className={`text-sm font-bold px-4 py-2 rounded-xl transition-all
              ${open
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                : 'btn-primary'
              }`}>
            {open ? 'Close' : saved ? 'Edit' : 'Write'}
          </button>
        </div>
      </div>

      {/* Saved preview */}
      {!open && saved && existing && (
        <div className="space-y-2">
          {existing.achievements && (
            <div className="text-sm text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20
                            rounded-xl px-4 py-2.5 border border-green-100 dark:border-green-800">
              <span className="font-semibold text-green-700 dark:text-green-400 block text-xs mb-1 uppercase tracking-wider">
                Achieved
              </span>
              {existing.achievements}
            </div>
          )}
          {existing.struggles && (
            <div className="text-sm text-gray-700 dark:text-gray-300 bg-orange-50 dark:bg-orange-900/20
                            rounded-xl px-4 py-2.5 border border-orange-100 dark:border-orange-800">
              <span className="font-semibold text-orange-700 dark:text-orange-400 block text-xs mb-1 uppercase tracking-wider">
                Struggled with
              </span>
              {existing.struggles}
            </div>
          )}
          {existing.linkedHabits?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {existing.linkedHabits.map(h => (
                <span key={h} className="text-xs font-semibold px-2.5 py-1 rounded-full
                                         bg-brand-50 dark:bg-brand-900/20 text-brand-500 border border-brand-100 dark:border-brand-800">
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No reflection yet */}
      {!open && !saved && (
        <p className="text-sm text-gray-400 italic">
          No reflection yet today. Take 2 minutes to check in with yourself.
        </p>
      )}

      {/* Form */}
      {open && (
        <div className="space-y-4 mt-2 animate-fade-in">
          {/* Mood selector */}
          <div>
            <label className="label">How are you feeling today?</label>
            <div className="flex gap-2">
              {MOODS.map(m => (
                <button key={m.value} onClick={() => setForm(p => ({ ...p, mood: m.value }))}
                  className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all
                    ${form.mood === m.value
                      ? `${m.bg} ${m.border} ${m.text}`
                      : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-gray-300'
                    }`}>
                  {MOOD_ICONS[m.value]} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Completed habits */}
          {completedHabits.length > 0 && (
            <div>
              <label className="label">Link completed habits</label>
              <div className="flex flex-wrap gap-2">
                {completedHabits.map(h => (
                  <button key={h._id} onClick={() => toggleLinkedHabit(h.name)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-all
                      ${form.linkedHabits.includes(h.name)
                        ? 'text-white border-transparent'
                        : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-500'
                      }`}
                    style={form.linkedHabits.includes(h.name)
                      ? { background: h.color, borderColor: h.color }
                      : {}}>
                    {h.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Text fields */}
          <div>
            <label className="label">What did I achieve today?</label>
            {field('achievements', 'I completed my workout, finished a chapter of my book...')}
          </div>
          <div>
            <label className="label">How did I feel?</label>
            {field('feelings', 'I felt productive and calm in the morning but a bit tired by evening...')}
          </div>
          <div>
            <label className="label">What did I struggle with?</label>
            {field('struggles', 'I struggled to focus in the afternoon and almost skipped my walk...')}
          </div>
          <div>
            <label className="label">Additional notes (optional)</label>
            {field('notes', 'Anything else on your mind...', 2)}
          </div>

          {/* Save button */}
          <button onClick={handleSave} className="btn-primary w-full">
            Save Reflection
          </button>
        </div>
      )}
    </div>
  );
}

// Weekly summary card
export function WeeklySummary() {
  const { weeklyStats, reflections } = useReflections();
  const stats = weeklyStats();

  const moodColors = {
    happy:   'text-green-500',
    neutral: 'text-yellow-500',
    sad:     'text-blue-500',
  };

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const key = d.toISOString().split('T')[0];
    const ref = reflections.find(r => r.date === key);
    return {
      label: d.toLocaleDateString('en', { weekday: 'short' }),
      mood: ref?.mood || null,
      written: !!ref,
    };
  });

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-gray-900 dark:text-white">Weekly Reflection</h3>
        <span className={`text-sm font-bold ${moodColors[stats.avgMood]}`}>
          {MOOD_ICONS[stats.avgMood]} Avg mood
        </span>
      </div>

      {/* 7-day mood strip */}
      <div className="flex gap-1.5 mb-4">
        {last7.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-full h-8 rounded-lg flex items-center justify-center text-sm
              ${d.written
                ? 'bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800'
                : 'bg-gray-100 dark:bg-gray-800'
              }`}>
              {d.mood ? MOOD_ICONS[d.mood] : ''}
            </div>
            <span className="text-[10px] text-gray-400">{d.label}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'This week',   value: `${stats.count}/7`,       color: 'text-brand-500' },
          { label: 'Avg mood',    value: MOOD_ICONS[stats.avgMood], color: moodColors[stats.avgMood] },
          { label: 'Total',       value: reflections.length,        color: 'text-gray-700 dark:text-gray-300' },
        ].map(s => (
          <div key={s.label} className="text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl py-3">
            <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Journal history list
export function JournalHistory() {
  const { reflections, loading } = useReflections();
  const [expanded, setExpanded] = useState(null);

  if (loading) return <div className="card p-5 text-center text-gray-400 text-sm">Loading journal...</div>;

  if (!reflections.length) return (
    <div className="card p-8 text-center">
      <p className="text-gray-400 font-medium">No reflections yet.</p>
      <p className="text-sm text-gray-400 mt-1">Start writing today — your future self will thank you.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {reflections.map(r => (
        <div key={r._id} className="card p-4 cursor-pointer hover:border-brand-200 dark:hover:border-brand-800 transition-all"
          onClick={() => setExpanded(expanded === r._id ? null : r._id)}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">
                {new Date(r.date).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
              {r.achievements && (
                <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{r.achievements}</div>
              )}
            </div>
            <MoodIcon mood={r.mood} />
          </div>

          {expanded === r._id && (
            <div className="mt-4 space-y-3 animate-fade-in border-t border-gray-100 dark:border-gray-800 pt-4">
              {[
                { label: 'Achieved',       value: r.achievements, color: 'green' },
                { label: 'Feelings',       value: r.feelings,     color: 'purple' },
                { label: 'Struggled with', value: r.struggles,    color: 'orange' },
                { label: 'Notes',          value: r.notes,        color: 'gray' },
              ].filter(f => f.value).map(f => (
                <div key={f.label}>
                  <div className={`text-xs font-bold uppercase tracking-wider text-${f.color}-500 mb-1`}>
                    {f.label}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{f.value}</p>
                </div>
              ))}
              {r.linkedHabits?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {r.linkedHabits.map(h => (
                    <span key={h} className="text-xs font-semibold px-2.5 py-1 rounded-full
                                             bg-brand-50 dark:bg-brand-900/20 text-brand-500">
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
