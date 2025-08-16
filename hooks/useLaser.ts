import { useEffect, useMemo, useState } from 'react';

export function useLaser(enabled: boolean) {
  const [frame, setFrame] = useState(0);

  // 动效降级：尊重 prefers-reduced-motion
  const reduceMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (!enabled || reduceMotion) return;
    let raf = 0;
    const loop = () => {
      setFrame((f) => (f + 1) % 12);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled, reduceMotion]);

  const intensity = reduceMotion
    ? 0.8
    : Math.sin((frame / 12) * Math.PI * 2) * 0.5 + 0.5; // 0..1

  return intensity;
}