import { useState, useEffect, useCallback } from 'react';
import {
  getChallenges, createChallenge, updateChallenge,
  deleteChallenge, checkIn, getChallengeLogs
} from '../api/challenges';
import toast from 'react-hot-toast';

export function useChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading]       = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const { data } = await getChallenges();
      setChallenges(data);
    } catch { toast.error('Could not load challenges'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = async (form) => {
    const { data } = await createChallenge(form);
    setChallenges(prev => [...prev, data]);
    toast.success('Challenge created! You got this!');
    return data;
  };

  const update = async (id, form) => {
    const { data } = await updateChallenge(id, form);
    setChallenges(prev => prev.map(c => c._id === id ? data : c));
    toast.success('Challenge updated!');
  };

  const remove = async (id) => {
    await deleteChallenge(id);
    setChallenges(prev => prev.filter(c => c._id !== id));
    toast.success('Challenge removed');
  };

  const doCheckIn = async (id, form) => {
    const { data } = await checkIn(id, form);
    setChallenges(prev => prev.map(c => c._id === id ? data.challenge : c));
    toast.success(`Day checked in! +${data.log.xpEarned} XP`);
    return data;
  };

  return { challenges, loading, create, update, remove, doCheckIn, refetch: fetchAll };
}