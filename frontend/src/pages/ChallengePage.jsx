import { useState, useEffect } from 'react';
import { useChallenges } from '../hooks/useChallenges';
import { getChallengeLogs } from '../api/challenges';
import toast from 'react-hot-toast';

const PRESET_CHALLENGES = [
  { title: '100 Days of Coding',    totalDays: 100, color: '#6366f1', category: 'Coding'    },
  { title: '30 Days of Python',     totalDays: 30,  color: '#10b981', category: 'Coding'    },
  { title: '50 Days of UI/UX',      totalDays: 50,  color: '#ec4899', category: 'Design'    },
  { title: '30 Days of Bible Study',totalDays: 30,  color: '#f59e0b', category: 'Spiritual' },
  { title: '30 Days of Fitness',    totalDays: 30,  color: '#ef4444', category: 'Fitness'   },
  { title: '21 Days of Journaling', totalDays: 21,  color: '#8b5cf6', category: 'Wellness'  },
];

const MOODS = [
  { value: 'great', label: 'Great',  color: '#10b981' },
  { value: 'good',  label: 'Good',   color: '#6366f1' },
  { value: 'okay',  label: 'Okay',   color: '#f59e0b' },
  { value: 'hard',  label: 'Hard',   color: '#ef4444' },
];

function getBadge(days) {
  if (days >= 100) return { label: '100 Day Legend', color: '#f59e0b' };
  if (days >= 50)  return { label: '50 Day Master',  color: '#8b5cf6' };
  if (days >= 30)  return { label: '30 Day Warrior', color: '#10b981' };
  if (days >= 7)   return { label: '7 Day Streak',   color: '#6366f1' };
  return null;
}

function ChallengeHeatmap({ logs = [], totalDays, startDate, color }) {
  const start = new Date(startDate);
  const cells = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split('T')[0];
    const log = logs.find(l => l.date === key);
    return { key, done: log?.completed || false, future: d > new Date() };
  });

  return (
    <div className="flex flex-wrap gap-1 mt-3">
      {cells.map((c, i) => (
        <div key={i} title={c.key}
          className="w-3 h-3 rounded-sm transition-transform hover:scale-125"
          style={{
            background: c.done ? color : c.future ? 'transparent' : undefined,
            border: c.future ? `1px solid ${color}33` : undefined,
            backgroundColor: !c.done && !c.future ? 'rgb(229 231 235)' : undefined,
          }} />
      ))}
    </div>
  );
}

function CheckInModal({ challenge, onClose, onSubmit }) {
  const [form, setForm] = useState({
    learned: '', tomorrow: '', mood: 'good', duration: 30
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.learned.trim()) { toast.error('Tell us what you learned today!'); return; }
    setLoading(true);
    await onSubmit(challenge._id, form);
    setLoading(false);
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];
  const start = new Date(challenge.startDate);
  const dayNumber = Math.floor((new Date(today) - start) / 86400000) + 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="card w-full max-w-md p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white">
              Day {dayNumber} Check-In
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{challenge.title}</p>
          </div>
          <button onClick={onClose} className="btn-ghost !px-3 !py-1.5 text-sm">X</button>
        </div>

        {/* Mood */}
        <div className="mb-4">
          <label className="label">How was today?</label>
          <div className="grid grid-cols-4 gap-2">
            {MOODS.map(m => (
              <button key={m.value} onClick={() => setForm(p => ({ ...p, mood: m.value }))}
                className="py-2 rounded-xl text-xs font-bold border-2 transition-all"
                style={{
                  borderColor: form.mood === m.value ? m.color : undefined,
                  background: form.mood === m.value ? m.color + '22' : undefined,
                  color: form.mood === m.value ? m.color : undefined,
                }}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="mb-4">
          <label className="label">Study Duration (minutes)</label>
          <input type="number" value={form.duration} min={1}
            onChange={e => setForm(p => ({ ...p, duration: +e.target.value }))}
            className="input" />
        </div>

        {/* Learned */}
        <div className="mb-4">
          <label className="label">What did you learn today?</label>
          <textarea rows={3} value={form.learned}
            placeholder="I learned how to use useEffect hooks..."
            onChange={e => setForm(p => ({ ...p, learned: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                       bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
        </div>

        {/* Tomorrow */}
        <div className="mb-5">
          <label className="label">Plan for tomorrow?</label>
          <textarea rows={2} value={form.tomorrow}
            placeholder="Tomorrow I will practice..."
            onChange={e => setForm(p => ({ ...p, tomorrow: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                       bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
        </div>

        <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full">
          {loading
            ? <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mx-auto" />
            : 'Submit Check-In'
          }
        </button>
      </div>
    </div>
  );
}

function CreateChallengeModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: '', totalDays: 30, startDate: new Date().toISOString().split('T')[0],
    color: '#6366f1', category: 'Coding', description: ''
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="card w-full max-w-md p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-extrabold text-gray-900 dark:text-white">New Challenge</h3>
          <button onClick={onClose} className="btn-ghost !px-3 !py-1.5 text-sm">X</button>
        </div>

        {/* Presets */}
        <div className="mb-4">
          <label className="label">Quick Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_CHALLENGES.map(p => (
              <button key={p.title}
                onClick={() => setForm(prev => ({ ...prev, ...p }))}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-all
                           border-gray-200 dark:border-gray-700 hover:border-brand-500 text-gray-600 dark:text-gray-400">
                {p.title}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Challenge Title</label>
            <input className="input" value={form.title} placeholder="100 Days of Coding"
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">Description</label>
            <input className="input" value={form.description} placeholder="What is this challenge about?"
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Total Days</label>
              <input type="number" className="input" value={form.totalDays} min={1}
                onChange={e => setForm(p => ({ ...p, totalDays: +e.target.value }))} />
            </div>
            <div>
              <label className="label">Start Date</label>
              <input type="date" className="input" value={form.startDate}
                onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                {['Coding','Design','Spiritual','Fitness','Wellness','Study','Other'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Color</label>
              <input type="color" className="input !p-1 !h-10 cursor-pointer" value={form.color}
                onChange={e => setForm(p => ({ ...p, color: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button onClick={() => form.title.trim() && onCreate(form)}
            className="btn-primary flex-1">
            Start Challenge
          </button>
        </div>
      </div>
    </div>
  );
}

function ChallengeCard({ challenge, onCheckIn, onDelete }) {
  const [logs, setLogs] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const checkedInToday = logs.some(l => l.date === today && l.completed);
  const pct = Math.round((challenge.completedDays / challenge.totalDays) * 100);
  const remaining = challenge.totalDays - challenge.completedDays;
  const badge = getBadge(challenge.currentStreak);

  useEffect(() => {
    getChallengeLogs(challenge._id).then(r => setLogs(r.data)).catch(() => {});
  }, [challenge]);

  return (
    <div className="card p-5 transition-all duration-300"
      style={{ borderColor: checkedInToday ? challenge.color + '66' : undefined }}>

      {/* Top accent */}
      {checkedInToday && (
        <div className="h-1 rounded-t-2xl -mt-5 -mx-5 mb-4 rounded-t-xl"
          style={{ background: `linear-gradient(90deg, ${challenge.color}, ${challenge.color}88)` }} />
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-extrabold text-gray-900 dark:text-white">{challenge.title}</h3>
            {badge && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: badge.color + '22', color: badge.color }}>
                {badge.label}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{challenge.category} • {remaining} days left</p>
        </div>
        <button onClick={() => onDelete(challenge._id)}
          className="text-xs text-red-400 hover:text-red-500 font-semibold px-2 py-1">
          Delete
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Current',   value: challenge.currentStreak, color: challenge.color },
          { label: 'Longest',   value: challenge.longestStreak, color: undefined },
          { label: 'Done',      value: challenge.completedDays, color: undefined },
          { label: 'XP',        value: challenge.xp,            color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl py-2">
            <div className="font-extrabold text-lg leading-none"
              style={{ color: s.color || undefined }}>{s.value}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-gray-500">Progress</span>
        <span className="font-bold" style={{ color: challenge.color }}>{pct}%</span>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden mb-4">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: challenge.color }} />
      </div>

      {/* Heatmap */}
      <ChallengeHeatmap
        logs={logs}
        totalDays={challenge.totalDays}
        startDate={challenge.startDate}
        color={challenge.color}
      />

      {/* Check in button */}
      <button
        onClick={() => !checkedInToday && onCheckIn(challenge)}
        disabled={checkedInToday}
        className={`mt-4 w-full py-2.5 rounded-xl font-bold text-sm transition-all
          ${checkedInToday
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            : 'btn-primary'
          }`}
        style={!checkedInToday ? { background: `linear-gradient(135deg, ${challenge.color}, ${challenge.color}cc)` } : {}}>
        {checkedInToday ? 'Checked In Today' : 'Check In Today'}
      </button>
    </div>
  );
}

export default function ChallengePage() {
  const { challenges, loading, create, remove, doCheckIn } = useChallenges();
  const [showCreate, setShowCreate] = useState(false);
  const [checkInTarget, setCheckInTarget] = useState(null);
  const [tab, setTab] = useState('active');

  const active    = challenges.filter(c => c.status === 'active');
  const completed = challenges.filter(c => c.status === 'completed');
  const shown     = tab === 'active' ? active : completed;

  if (loading) return (
    <div className="space-y-4">
      {[1,2].map(i => (
        <div key={i} className="card p-5 animate-pulse">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-5 animate-fade-in">
      {showCreate && (
        <CreateChallengeModal
          onClose={() => setShowCreate(false)}
          onCreate={async (form) => { await create(form); setShowCreate(false); }}
        />
      )}
      {checkInTarget && (
        <CheckInModal
          challenge={checkInTarget}
          onClose={() => setCheckInTarget(null)}
          onSubmit={doCheckIn}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-extrabold text-xl text-gray-900 dark:text-white">Challenge Mode</h2>
          <p className="text-sm text-gray-400">{active.length} active challenges</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary text-sm">
          + New
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['active', 'completed'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all capitalize
              ${tab === t
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'
              }`}>
            {t} ({t === 'active' ? active.length : completed.length})
          </button>
        ))}
      </div>

      {/* XP Summary */}
      {active.length > 0 && (
        <div className="card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20
                          flex items-center justify-center text-2xl">
            XP
          </div>
          <div>
            <div className="font-extrabold text-2xl text-yellow-500">
              {challenges.reduce((a, c) => a + c.xp, 0)}
            </div>
            <div className="text-xs text-gray-400">Total XP earned across all challenges</div>
          </div>
        </div>
      )}

      {/* Challenge cards */}
      {shown.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-gray-400 font-medium mb-2">
            {tab === 'active' ? 'No active challenges' : 'No completed challenges yet'}
          </p>
          {tab === 'active' && (
            <button onClick={() => setShowCreate(true)} className="btn-primary text-sm mt-2">
              Start your first challenge
            </button>
          )}
        </div>
      ) : (
        shown.map(c => (
          <ChallengeCard
            key={c._id}
            challenge={c}
            onCheckIn={setCheckInTarget}
            onDelete={remove}
          />
        ))
      )}
    </div>
  );
}