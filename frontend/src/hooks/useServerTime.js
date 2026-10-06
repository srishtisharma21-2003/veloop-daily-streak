import { useEffect, useState, useRef } from 'react';

export function useServerTime(serverTime, nextClaimAt) {
  const [remaining, setRemaining] = useState(0);
  const driftRef = useRef(0);

  useEffect(() => {
    if (!serverTime || !nextClaimAt) return;
    const serverTs = new Date(serverTime).getTime();
    driftRef.current = serverTs - Date.now();
    const target = new Date(nextClaimAt).getTime();

    const tick = () => {
      const serverNow = Date.now() + driftRef.current;
      setRemaining(Math.max(0, target - serverNow));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [serverTime, nextClaimAt]);

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, '0');

  return {
    remaining,
    formatted: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  };
}
