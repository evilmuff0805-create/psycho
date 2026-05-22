import { useEffect, useRef } from 'react';

export function useNotification(onTrigger) {
  const firedTodayRef = useRef(null);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const hh = now.getHours();
      const mm = now.getMinutes();
      const dateStr = now.toISOString().split('T')[0];

      if (hh === 9 && mm === 0 && firedTodayRef.current !== dateStr) {
        firedTodayRef.current = dateStr;
        onTrigger();
      }
    };

    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, [onTrigger]);
}
