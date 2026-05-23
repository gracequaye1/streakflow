import { useState, useEffect } from "react";
import { getTimetable, addSlot, removeSlot } from "../api/challenges";
import toast from "react-hot-toast";

const DAYS_SCHOOL   = ["Saturday", "Sunday"];
const DAYS_PERSONAL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const COLORS = ["#6366f1","#10b981","#ef4444","#f59e0b","#ec4899","#3b82f6","#8b5cf6","#06b6d4"];

function SlotCard({ slot, onDelete, type }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800
                    bg-gray-50 dark:bg-gray-800/50 group">
      <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ background: slot.color }} />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{slot.subject}</div>
        <div className="text-xs text-gray-400 mt-0.5">
          {slot.startTime} - {slot.endTime}
          {slot.lecturer && ` • ${slot.lecturer}`}
        </div>
        {slot.notes && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{slot.notes}</div>
        )}
      </div>
      <button onClick={() => onDelete(slot._id)}
        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500
                   text-xs font-bold px-2 py-1 transition-all">
        Remove
      </button>
    </div>
  );
}

function AddSlotModal({ onClose, onAdd, days, type }) {
  const [form, setForm] = useState({
    day: days[0], startTime: "09:00", endTime: "10:00",
    subject: "", lecturer: "", notes: "", color: COLORS[0],
    goals: "", duration: 60,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="card w-full max-w-md p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-extrabold text-gray-900 dark:text-white">Add Class / Session</h3>
          <button onClick={onClose} className="btn-ghost !px-3 !py-1.5 text-sm">X</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Day</label>
            <select className="input" value={form.day}
              onChange={e => setForm(p => ({ ...p, day: e.target.value }))}>
              {days.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="label">
              {type === "school" ? "Course Name" : "Subject / Topic"}
            </label>
            <input className="input" value={form.subject}
              placeholder={type === "school" ? "e.g. Web Development" : "e.g. Python Basics"}
              onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Start Time</label>
              <input type="time" className="input" value={form.startTime}
                onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} />
            </div>
            <div>
              <label className="label">End Time</label>
              <input type="time" className="input" value={form.endTime}
                onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))} />
            </div>
          </div>

          {type === "school" ? (
            <div>
              <label className="label">Lecturer / Note</label>
              <input className="input" value={form.lecturer} placeholder="e.g. Dr. Smith"
                onChange={e => setForm(p => ({ ...p, lecturer: e.target.value }))} />
            </div>
          ) : (
            <div>
              <label className="label">Session Goals</label>
              <input className="input" value={form.goals}
                placeholder="What do you want to achieve?"
                onChange={e => setForm(p => ({ ...p, goals: e.target.value }))} />
            </div>
          )}

          <div>
            <label className="label">Notes (optional)</label>
            <input className="input" value={form.notes} placeholder="Any extra notes..."
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>

          <div>
            <label className="label">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} onClick={() => setForm(p => ({ ...p, color: c }))}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{
                    background: c,
                    borderColor: form.color === c ? "#fff" : "transparent",
                    boxShadow: form.color === c ? `0 0 0 2px ${c}` : "none",
                  }} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button
            onClick={() => form.subject.trim() && onAdd(form)}
            className="btn-primary flex-1">
            Add to Timetable
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TimetablePage() {
  const [type, setType]           = useState("school");
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [showAdd, setShowAdd]     = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const days = type === "school" ? DAYS_SCHOOL : DAYS_PERSONAL;

  useEffect(() => {
    setLoading(true);
    getTimetable(type)
      .then(r => {
        setTimetable(r.data);
        setSelectedDay(r.data.activeDays?.[0] || days[0]);
      })
      .catch(() => toast.error("Could not load timetable"))
      .finally(() => setLoading(false));
  }, [type]);

  const handleAdd = async (form) => {
    try {
      const { data } = await addSlot(type, form);
      setTimetable(data);
      setShowAdd(false);
      toast.success("Added to timetable!");
    } catch { toast.error("Could not add slot"); }
  };

  const handleDelete = async (slotId) => {
    try {
      const { data } = await removeSlot(type, slotId);
      setTimetable(data);
      toast.success("Removed!");
    } catch { toast.error("Could not remove slot"); }
  };

  const slotsForDay = timetable?.slots
    ?.filter(s => s.day === selectedDay)
    ?.sort((a, b) => a.startTime.localeCompare(b.startTime)) || [];

  return (
    <div className="space-y-5 animate-fade-in">
      {showAdd && (
        <AddSlotModal
          onClose={() => setShowAdd(false)}
          onAdd={handleAdd}
          days={timetable?.activeDays || days}
          type={type}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-extrabold text-xl text-gray-900 dark:text-white">Timetable</h2>
          <p className="text-sm text-gray-400">
            {type === "school" ? "Weekend school schedule" : "Monday to Friday study plan"}
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm">+ Add</button>
      </div>

      {/* Type switcher */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { id: "school",   label: "School Timetable",  sub: "Weekends"    },
          { id: "personal", label: "Study Planner",     sub: "Mon - Fri"   },
        ].map(t => (
          <button key={t.id} onClick={() => setType(t.id)}
            className={`p-4 rounded-2xl border-2 text-left transition-all
              ${type === t.id
                ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              }`}>
            <div className={`font-bold text-sm ${type === t.id ? "text-brand-500" : "text-gray-700 dark:text-gray-300"}`}>
              {t.label}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{t.sub}</div>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card p-10 text-center">
          <div className="w-8 h-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
        </div>
      ) : (
        <>
          {/* Day tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(timetable?.activeDays || days).map(d => (
              <button key={d} onClick={() => setSelectedDay(d)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border-2 transition-all
                  ${selectedDay === d
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700"
                  }`}>
                {d}
              </button>
            ))}
          </div>

          {/* Slots */}
          <div className="space-y-3">
            {slotsForDay.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-gray-400 font-medium">No classes added for {selectedDay}</p>
                <button onClick={() => setShowAdd(true)} className="btn-primary text-sm mt-3">
                  Add a class
                </button>
              </div>
            ) : (
              slotsForDay.map(slot => (
                <SlotCard key={slot._id} slot={slot} onDelete={handleDelete} type={type} />
              ))
            )}
          </div>

          {/* Summary */}
          {timetable?.slots?.length > 0 && (
            <div className="card p-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Total Classes", value: timetable.slots.length },
                  { label: "Today",         value: slotsForDay.length     },
                  { label: "Days Active",   value: timetable.activeDays?.length || days.length },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-2xl font-extrabold text-brand-500">{s.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}