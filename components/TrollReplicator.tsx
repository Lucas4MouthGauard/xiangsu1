'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface Troll {
  id: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  delay: number;
  generation: number; // 第几代
  isFullScreen?: boolean; // 是否全屏显示
}

export function TrollReplicator() {
  const [trolls, setTrolls] = useState<Troll[]>([]);
  const [capsuleCount, setCapsuleCount] = useState(0);
  const [isEating, setIsEating] = useState(false);
  const [fullScreenTrolls, setFullScreenTrolls] = useState<Troll[]>([]);

  const eatCapsule = useCallback(() => {
    if (isEating) return;
    
    setIsEating(true);
    const nextCount = capsuleCount + 1;
    setCapsuleCount(nextCount);
    
    // 计算新的 Troll 数量（指数增长）
    const newCount = Math.pow(2, nextCount);
    const currentCount = trolls.length;
    const generation = nextCount;
    const isFullScreen = generation >= 8; // 第8次开始全屏显示
    
    // 创建新的 Troll - 每一代都更大
    const newTrolls: Troll[] = [];
    for (let i = currentCount; i < newCount; i++) {
      const baseScale = 1.0 + (generation * 0.3); // 每一代增加30%大小
      
      // 如果是全屏模式，位置范围扩大到整个视窗
      const xRange = isFullScreen ? 100 : 80;
      const yRange = isFullScreen ? 100 : 80;
      const xOffset = isFullScreen ? 0 : 10;
      const yOffset = isFullScreen ? 0 : 10;
      
      const newTroll = {
        id: `troll-${Date.now()}-${i}`,
        x: Math.random() * xRange + xOffset, // 全屏时 0-100%，否则 10-90%
        y: Math.random() * yRange + yOffset, // 全屏时 0-100%，否则 10-90%
        scale: baseScale + Math.random() * 0.4, // 基础大小 + 随机变化
        rotation: Math.random() * 360,
        delay: Math.random() * 500,
        generation: generation,
        isFullScreen: isFullScreen,
      };
      
      newTrolls.push(newTroll);
      
      // 如果是全屏模式，添加到全屏 Troll 列表，3秒后消失
      if (isFullScreen) {
        setFullScreenTrolls(prev => [...prev, newTroll]);
        setTimeout(() => {
          setFullScreenTrolls(prev => prev.filter(t => t.id !== newTroll.id));
        }, 3000); // 3秒后消失
        
        // 第8次后，3秒后重置所有状态，重新开始
        if (generation === 8) {
          setTimeout(() => {
            setTrolls([]);
            setCapsuleCount(0);
            setFullScreenTrolls([]);
          }, 3000);
        }
      }
    }
    
    setTrolls(prev => [...prev, ...newTrolls]);
    
    // 重置吃胶囊状态
    setTimeout(() => setIsEating(false), 1000);
  }, [trolls.length, capsuleCount, isEating]);

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-2xl border-4 border-black shadow-[0_8px_0_#111] overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-8 h-8 bg-black rounded-full"></div>
        <div className="absolute top-8 right-8 w-6 h-6 bg-black rounded-full"></div>
        <div className="absolute bottom-8 left-8 w-4 h-4 bg-black rounded-full"></div>
      </div>

      {/* 胶囊按钮 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={eatCapsule}
          disabled={isEating}
          className={`
            relative group transition-all duration-300
            ${isEating ? 'scale-90' : 'hover:scale-110 active:scale-95'}
          `}
        >
          <Image 
            src="/images/touming.svg" 
            alt="Pump Pill" 
            width={60} 
            height={60}
            className={`
              transition-all duration-300
              ${isEating ? 'animate-pulse' : 'group-hover:animate-bounce'}
            `}
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
            {capsuleCount} PILLS
          </div>
        </button>
      </div>

      {/* 计数器 */}
      <div className="absolute top-4 right-4 bg-black text-white px-3 py-2 rounded-lg font-bold text-sm">
        🎯 PUMPED: {trolls.length}
      </div>

      {/* 最大 Troll 显示 */}
      {trolls.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-black text-white px-3 py-2 rounded-lg font-bold text-sm">
          🏆 BIGGEST: {Math.max(...trolls.map(t => t.scale)).toFixed(1)}x
        </div>
      )}

      {/* Troll 容器 */}
      <div className="relative w-full h-full">
        {trolls.filter(troll => !troll.isFullScreen).map((troll) => (
          <div
            key={troll.id}
            className="absolute animate-pop-in"
            style={{
              left: `${troll.x}%`,
              top: `${troll.y}%`,
              transform: `scale(${troll.scale}) rotate(${troll.rotation}deg)`,
              animationDelay: `${troll.delay}ms`,
            }}
          >
            <Image 
              src="/images/trolltouming.png" 
              alt="Pumped Troll" 
              width={50} 
              height={50}
              className="sticker animate-jitter"
            />
            {/* 显示代数标签 */}
            {troll.generation > 1 && (
              <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1 rounded-full">
                G{troll.generation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 全屏 Troll 容器 */}
      {fullScreenTrolls.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          {/* 调试信息 */}
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-sm">
            🚨 FULL SCREEN: {fullScreenTrolls.length} trolls
          </div>
          {fullScreenTrolls.map((troll) => (
            <div
              key={troll.id}
              className="absolute animate-pop-in"
              style={{
                left: `${troll.x}%`,
                top: `${troll.y}%`,
                transform: `scale(${troll.scale}) rotate(${troll.rotation}deg)`,
                animationDelay: `${troll.delay}ms`,
              }}
            >
              <Image 
                src="/images/trolltouming.png" 
                alt="Full Screen Troll" 
                width={50} 
                height={50}
                className="sticker animate-jitter"
              />
              {/* 显示代数标签 */}
              {troll.generation > 1 && (
                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1 rounded-full">
                  G{troll.generation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 提示文字 */}
      {trolls.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-black mb-2">💊 CLICK TO PUMP</div>
            <div className="text-sm text-gray-600">Watch trolls get MASSIVE & MULTIPLY</div>
            <div className="text-xs text-gray-500 mt-1">1 → 2 → 4 → 8 → 16...</div>
          </div>
        </div>
      )}

      {/* 裂变效果提示 */}
      {isEating && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-4xl font-bold text-black animate-pulse mb-2">
              💊 PUMPING...
            </div>
            <div className="text-lg text-black animate-bounce">
              GETTING MASSIVE!
            </div>
            {capsuleCount >= 7 && (
              <div className="text-sm text-red-600 animate-pulse mt-2">
                🚨 BREAKING CONTAINMENT!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 