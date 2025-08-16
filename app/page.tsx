'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { FloatingDoseButton } from '@/components/FloatingDoseButton';
import { useMintedCounter } from '@/hooks/useMintedCounter';
import { useSpeedBoost } from '@/hooks/useSpeedBoost';
import { useLaser } from '@/hooks/useLaser';
import { useCallback, useEffect, useState } from 'react';
import { ShareButtons } from '@/components/ShareButtons';
import { chooseVariant, getCopy } from '@/lib/ab';
import { track } from '@/lib/analytics';
import { TrollReplicator } from '@/components/TrollReplicator';
import { TrollRain } from '@/components/TrollRain';

const MBTIGenerator = dynamic(() => import('@/components/MBTIGenerator'), {
  ssr: false,
  loading: () => <div className="mt-10 h-64 grid place-items-center text-sm">Loading MBTI generator…</div>,
});

function GeneratorPlaceholder({ intervalMs }: { intervalMs: number }) {
  const intensity = useLaser(true);
  return (
    <div className="mt-10 grid place-items-center">
      <div className="w-64 h-64 bg-white border-4 border-black shadow-[0_8px_0_#111] grid place-items-center rounded-xl sticker">
        <div
          style={{ opacity: intensity, filter: `blur(${2 + intensity * 6}px)` }}
          className="text-2xl font-black"
        >
          LASER {Math.round(intensity * 100)}%
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const minted = useMintedCounter(3000);
  const { intervalMs, onShareSuccess } = useSpeedBoost(900);
  const [toast, setToast] = useState<string | null>(null);
  const [isTrollRaining, setIsTrollRaining] = useState(false);
  const variant = chooseVariant();
  const copy = getCopy(variant);

  useEffect(() => {
    track('ab_exposure', { variant });
  }, [variant]);

  const handleGenerate = useCallback(() => {
    track('cta_click', { variant, cta: 'generate' });
    setToast('GENERATING...');
    setTimeout(() => setToast(null), 1200);
  }, [variant]);

  const doseX2 = useCallback(() => {
    track('cta_click', { variant, cta: 'dose_x2' });
    onShareSuccess();
    setIsTrollRaining(true);
  }, [onShareSuccess, variant]);

  const handleTrollRainComplete = useCallback(() => {
    setIsTrollRaining(false);
  }, []);

  return (
    <main>
      <section className="relative bg-[#FFD400] grain">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20 drop-shadow-[0_16px_0_#111]">
          <h1 className="thick-outline select-none text-4xl md:text-6xl lg:text-7xl leading-[1.15] md:leading-[1.1] lg:leading-[1.08] tracking-tight">
            <span className="block">TAKE THE PUMP.</span>
            <span className="block mt-2 md:mt-3">WATCH THEM GROW.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl lg:text-2xl font-black leading-relaxed">
            💊 Every pill = MASSIVE troll growth. 1→2→4→8→16... Exponential FOMO incoming.
          </p>
          <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-3 md:gap-4">
            <button
              aria-label="Generate Meme"
              onClick={handleGenerate}
              className="rounded-xl bg-black text-white px-5 md:px-6 py-3 font-black border-4 border-black shadow-[0_8px_0_#111] active:translate-y-1"
            >
              🚀 PUMP GENERATOR
            </button>
            <button
              onClick={doseX2}
              className="rounded-xl bg-white px-5 md:px-6 py-3 font-black border-4 border-black shadow-[0_8px_0_#111] active:translate-y-1"
            >
              💊 DOSE ×2
            </button>
            <ShareButtons onSuccess={doseX2} />
          </div>
          <div className="mt-6 md:mt-8 text-sm text-black" style={{ textShadow: 'none' }}>
            🎯 Trolls pumped today: {minted} • 🏆 Top pumpers: 🇺🇸 🇨🇳 🇯🇵
          </div>
          
          {/* Hero 视频 */}
          <div className="absolute right-4 bottom-4 md:right-8 md:bottom-8">
            <video 
              src="/images/daofang.mov" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="sticker w-[140px] h-[140px] object-cover rounded-lg"
              style={{ filter: 'contrast(1.05) saturate(1.1)' }}
            />
          </div>
        </div>
      </section>

      {/* $TROLLPUMP Token 展示 */}
      <section className="relative bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 py-16 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-black text-black mb-4 thick-outline">
              $TROLLPUMP
            </h2>
            <p className="text-xl md:text-2xl font-bold text-black mb-2">
              🚀 THE OFFICIAL TROLL TOKEN 🚀
            </p>
            <p className="text-lg text-gray-800">
              Join the TROLL REVOLUTION • Every pump = MASSIVE growth
            </p>
          </div>

          <div className="bg-white rounded-2xl border-4 border-black shadow-[0_12px_0_#111] p-8 mb-12">
            <div className="flex items-center mb-6">
              <Image 
                src="/images/trolltouming.png" 
                alt="TrollPump Token" 
                width={60} 
                height={60}
                className="rounded-full border-2 border-black"
              />
              <div className="ml-4">
                <h3 className="text-2xl font-black text-black">$TROLLPUMP</h3>
                <p className="text-gray-600">Troll Revolution Token</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
                              <div className="flex justify-between items-center p-3 bg-yellow-100 rounded-lg border-2 border-black">
                  <span className="font-bold text-black">Contract Address:</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText('AB18b6W3JXJ5E51vMcka9bLNeXi8ej4PuLd6FNoqpump')}
                    className="font-mono text-sm bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    AB18b6...qpump
                  </button>
                </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-3xl font-black text-black mb-4">💊 BUY $TROLLPUMP</h3>
              <p className="text-lg text-gray-700 mb-6">
                Join the TROLL REVOLUTION and watch your investment multiply!
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-3">🔥</span>
                  <span className="font-bold text-black">Viral Marketing Campaign</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-3">💊</span>
                  <span className="font-bold text-black">PUMP LABORATORY Integration</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-3">🎭</span>
                  <span className="font-bold text-black">MBTI Meme Generator Access</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-3">🚀</span>
                  <span className="font-bold text-black">Exponential Growth Potential</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.open('https://dexscreener.com/ethereum/AB18b6W3JXJ5E51vMcka9bLNeXi8ej4PuLd6FNoqpump', '_blank')}
              className="relative group w-full py-4 px-6 rounded-xl font-black text-lg border-4 border-black shadow-[0_8px_0_#111] bg-yellow-300 hover:bg-yellow-400 transition-all duration-300 active:translate-y-1"
            >
              <div className="flex items-center justify-center">
                <Image 
                  src="/images/trolltouming.png" 
                  alt="Troll" 
                  width={32} 
                  height={32}
                  className="mr-3 animate-bounce"
                  style={{ animationDuration: '0.6s' }}
                />
                <span className="text-black">BUY $TROLLPUMP</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Troll 裂变系统 */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">💊 PUMP LABORATORY</h2>
          <p className="text-lg text-gray-700 mb-2">Click the pill to witness MASSIVE troll multiplication</p>
          <p className="text-sm text-gray-600">Each pill = Exponential growth. Watch them get BIGGER and MULTIPLY faster!</p>
        </div>
        <TrollReplicator />
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <MBTIGenerator />
      </section>

      <FloatingDoseButton doseX2={doseX2} />

      {/* Troll 雨效果 */}
      <TrollRain isActive={isTrollRaining} onComplete={handleTrollRainComplete} />

      {toast && (
        <div aria-live="polite" className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 rounded-xl bg-black text-white px-5 py-3 font-black border-4 border-black shadow-[0_8px_0_#111]">
          {toast}
        </div>
      )}
    </main>
  );
}