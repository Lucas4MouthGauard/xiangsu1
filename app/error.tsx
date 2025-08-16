'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFD400] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-black mb-4">Something went wrong!</h2>
        <button
          onClick={reset}
          className="rounded-xl bg-black text-white px-6 py-3 font-black border-4 border-black shadow-[0_8px_0_#111] active:translate-y-1"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 