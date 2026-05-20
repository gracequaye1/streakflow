import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function useReminders(habits = []) {
  useEffect(() => {
    if (!habits.length) return;

    const check = () => {
      const now   = new Date();
      const hhmm  = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      const today = now.toISOString().split('T')[0];

      habits.forEach(habit => {
        if (
          habit.reminder &&
          habit.reminderTime === hhmm &&
          !habit.completionHistory?.[today]
        ) {
          toast(
            `${habit.icon} Time for: ${habit.name}`,
            {
              duration: 6000,
              style: {
                background: habit.color,
                color: '#fff',
                fontWeight: 700,
                borderRadius: '14px',
              },
              icon: '⏰',
            }
          );
        }
      });
    };

    // Check every minute
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [habits]);
}