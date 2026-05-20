import { useState, useEffect, useCallback } from 'react';
import {
  getReflections, saveReflection, updateReflection
} from '../api/reflections';
import toast from 'react-hot-toast';

export function useReflections() {
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading]         = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const { data } = await getReflections();
      setReflections(data);
    } catch {
      toast.error('Could not load reflections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const save = async (formData) => {
    try {
      const { data } = await saveReflection(formData);
      setReflections(prev => {
        const exists = prev.find(r => r.date === formData.date);
        if (exists) return prev.map(r => r.date === formData.date ? data : r);
        return [data, ...prev];
      });
      toast.success('Reflection saved');
      return data;
    } catch {
      toast.error('Could not save reflection');
    }
  };

  const todayReflection = () => {
    const today = new Date().toISOString().split('T')[0];
    return reflections.find(r => r.date === today) || null;
  };

  // Weekly stats
  const weeklyStats = () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - i * 86400000);
      return d.toISOString().split('T')[0];
    });
    const weekReflections = reflections.filter(r => days.includes(r.date));
    const moodMap = { happy: 3, neutral: 2, sad: 1 };
    const avgMood = weekReflections.length
      ? weekReflections.reduce((acc, r) => acc + (moodMap[r.mood] || 2), 0) / weekReflections.length
      : 0;
    return {
      count: weekReflections.length,
      avgMood: avgMood >= 2.5 ? 'happy' : avgMood >= 1.5 ? 'neutral' : 'sad',
      reflections: weekReflections,
    };
  };

  return { reflections, loading, save, todayReflection, weeklyStats, refetch: fetchAll };
}