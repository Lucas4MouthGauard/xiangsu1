import { useCallback, useRef, useState } from 'react';

export function useSpeedBoost(baseMs = 900) {
  const [intervalMs, setIntervalMs] = useState(baseMs);
  const timerRef = useRef<number | null>(null);

  const onShareSuccess = useCallback(() => {
    setIntervalMs(450);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const start = performance.now();
      const from = 450;
      const to = baseMs;
      const duration = 1500;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(from + (to - from) * eased);
        setIntervalMs(val);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 30000);
  }, [baseMs]);

  return { intervalMs, onShareSuccess };
}