"use client";
import { useEffect, useMemo, useRef, useState } from 'react';

export type ReplicatorItem = { id: string; content: React.ReactNode };

export function Replicator({
  items,
  maxSoft = 128,
  intervalMs,
  onTick,
}: {
  items: ReplicatorItem[];
  maxSoft?: number;
  intervalMs: number;
  onTick?: (info: { count: number; intervalMs: number }) => void;
}) {
  const [visibleItems, setVisibleItems] = useState<ReplicatorItem[]>([]);
  const lastIndexRef = useRef(0);

  useEffect(() => {
    const tick = () => {
      if (lastIndexRef.current >= items.length) return;
      const next = items[lastIndexRef.current++];
      setVisibleItems((prev) => {
        const updated = [next, ...prev];
        onTick?.({ count: updated.length, intervalMs });
        return updated;
      });
    };
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [items, intervalMs, onTick]);

  const containerClass = useMemo(
    () => (visibleItems.length > maxSoft ? 'opacity-50 transition-opacity' : 'opacity-100'),
    [visibleItems.length, maxSoft]
  );

  return (
    <div className={containerClass}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {visibleItems.map((it, i) => (
          <div
            key={it.id}
            className="template-card relative pop-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="pill-badge">PILL+LASER</span>
            {it.content}
          </div>
        ))}
      </div>
    </div>
  );
}