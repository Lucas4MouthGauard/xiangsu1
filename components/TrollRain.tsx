'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FallingTroll {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  speed: number;
  delay: number;
}

interface TrollRainProps {
  isActive: boolean;
  onComplete: () => void;
}

export function TrollRain({ isActive, onComplete }: TrollRainProps) {
  const [trolls, setTrolls] = useState<FallingTroll[]>([]);

  useEffect(() => {
    if (!isActive) {
      setTrolls([]);
      return;
    }

    // 创建掉落的 Troll
    const newTrolls: FallingTroll[] = [];
    const trollCount = 150; // 增加到150个 Troll

    for (let i = 0; i < trollCount; i++) {
      newTrolls.push({
        id: `rain-troll-${Date.now()}-${i}`,
        x: Math.random() * 100, // 0-100% 水平位置
        y: -20 - Math.random() * 50, // 从屏幕上方开始
        rotation: Math.random() * 720 - 360, // -360 到 360 度旋转
        scale: 1.5 + Math.random() * 2.5, // 1.5 到 4.0 倍大小（更大）
        speed: 2 + Math.random() * 4, // 2-6 的掉落速度
                    delay: 0, // 移除延迟，立即开始掉落 // 0-2秒的延迟
      });
    }

    setTrolls(newTrolls);

    // 3秒后完成动画
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {trolls.map((troll) => (
        <div
          key={troll.id}
          className="absolute troll-fall"
          style={{
            left: `${troll.x}%`,
            top: `${troll.y}%`,
            transform: `scale(${troll.scale})`,
            animationDelay: `${troll.delay}ms`,
            animationDuration: `${troll.speed}s`,
            animationIterationCount: 'infinite',
          }}
        >
          <Image 
            src="/images/trolltouming.png" 
            alt="Falling Troll" 
            width={80} 
            height={80}
            className="sticker"
          />
        </div>
      ))}
      
      {/* 移除背景遮罩，保持屏幕亮度不变 */}
    </div>
  );
} 