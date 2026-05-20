import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export function useSchedule(type) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading]   = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/schedule/${type}`);
      setSchedule(data);
    } catch { toast.error('Failed to load schedule'); }
    finally { setLoading(false); }
  }, [type]);

  useEffect(() => { fetch(); }, [fetch]);

  const addTask = async (task) => {
    const { data } = await api.post(`/schedule/${type}/tasks`, task);
    setSchedule(data);
    toast.success('Task added ');
  };

  const toggleTask = async (taskId) => {
    // Optimistic update
    setSchedule(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t._id === taskId ? { ...t, done: !t.done } : t
      ),
    }));
    try {
      const { data } = await api.patch(`/schedule/${type}/tasks/${taskId}/toggle`);
      setSchedule(data);
    } catch {
      toast.error('Could not save');
      fetch();
    }
  };

  const deleteTask = async (taskId) => {
    const { data } = await api.delete(`/schedule/${type}/tasks/${taskId}`);
    setSchedule(data);
    toast.success('Task removed');
  };

  const resetDone = async () => {
    const { data } = await api.post(`/schedule/${type}/reset`);
    setSchedule(data);
    toast.success('Schedule reset for today ');
  };

  return { schedule, loading, addTask, toggleTask, deleteTask, resetDone };
}
