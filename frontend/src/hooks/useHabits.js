import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export function useHabits() {
  const [habits, setHabits]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = useCallback(async () => {
    try {
      const { data } = await api.get("/habits");
      setHabits(data);
    } catch { toast.error("Failed to load habits"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchHabits(); }, [fetchHabits]);

  const toggleToday = async (id) => {
    // Optimistic update
    setHabits(prev => prev.map(h => {
      if (h._id !== id) return h;
      const today = new Date().toISOString().split("T")[0];
      const current = h.completionHistory?.[today];
      return { ...h, completionHistory: { ...h.completionHistory, [today]: !current } };
    }));
    try {
      const { data } = await api.patch(`/habits/${id}/toggle`);
      setHabits(prev => prev.map(h => h._id === id ? data : h));
    } catch {
      toast.error("Couldn't save — retrying...");
      fetchHabits(); // rollback
    }
  };

  const createHabit = async (habitData) => {
    const { data } = await api.post("/habits", habitData);
    setHabits(prev => [...prev, data]);
    toast.success("Habit created! ");
    return data;
  };

  const updateHabit = async (id, updates) => {
    const { data } = await api.put(`/habits/${id}`, updates);
    setHabits(prev => prev.map(h => h._id === id ? data : h));
    toast.success("Habit updated ");
  };

  const deleteHabit = async (id) => {
    await api.delete(`/habits/${id}`);
    setHabits(prev => prev.filter(h => h._id !== id));
    toast.success("Habit removed");
  };

  return { habits, loading, toggleToday, createHabit, updateHabit, deleteHabit, refetch: fetchHabits };
}