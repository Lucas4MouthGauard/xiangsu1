'use client';
import { useEffect, useState } from 'react';

export function FloatingDoseButton({ doseX2 }: { doseX2: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      aria-label="Dose ×2"
      className="fixed bottom-6 md:bottom-6 right-6 z-50 rounded-full bg-white px-5 py-3 font-black border-4 border-black shadow-[0_8px_0_#111] active:translate-y-1 transition-transform md:mb-0 mb-2"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      onClick={doseX2}
    >
      Dose ×2
    </button>
  );
}