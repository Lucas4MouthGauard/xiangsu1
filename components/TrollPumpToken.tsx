'use client';

import Image from 'next/image';
import { useState } from 'react';

export function TrollPumpToken() {
  const [isHovered, setIsHovered] = useState(false);
  
  const contractAddress = "0x1234567890abcdef1234567890abcdef12345678";
  const shortCA = `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`;
  
  const handleBuyClick = () => {
    window.open('https://dexscreener.com/ethereum/0x1234567890abcdef1234567890abcdef12345678', '_blank');
  };

  const handleCopyCA = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
    } catch (err) {
      console.error('Failed to copy CA');
    }
  };

  return (
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

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl border-4 border-black shadow-[0_12px_0_#111] p-8">
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
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-yellow-100 rounded-lg border-2 border-black">
                <span className="font-bold text-black">Contract Address:</span>
                <button 
                  onClick={handleCopyCA}
                  className="font-mono text-sm bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {shortCA}
                </button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-yellow-100 rounded-lg border-2 border-black">
                <span className="font-bold text-black">Network:</span>
                <span className="font-bold text-black">Ethereum</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-yellow-100 rounded-lg border-2 border-black">
                <span className="font-bold text-black">Supply:</span>
                <span className="font-bold text-black">1,000,000,000</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-yellow-100 rounded-lg border-2 border-black">
                <span className="font-bold text-black">Status:</span>
                <span className="font-bold text-green-600">🚀 LIVE & PUMPING</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-4 border-black shadow-[0_12px_0_#111] p-8 flex flex-col justify-center">
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
              onClick={handleBuyClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`
                relative group w-full py-6 px-8 rounded-xl font-black text-xl border-4 border-black shadow-[0_8px_0_#111] 
                transition-all duration-300 active:translate-y-1
                ${isHovered ? 'bg-yellow-400 scale-105' : 'bg-yellow-300 hover:bg-yellow-400'}
              `}
            >
              <div className="flex items-center justify-center">
                <Image 
                  src="/images/trolltouming.png" 
                  alt="Troll" 
                  width={40} 
                  height={40}
                  className={`mr-3 transition-transform duration-300 ${isHovered ? 'animate-bounce' : ''}`}
                />
                <span className="text-black">BUY $TROLLPUMP NOW</span>
              </div>
              
              {isHovered && (
                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  🚀 PUMP!
                </div>
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Available on major DEXs
              </p>
              <div className="flex justify-center space-x-4 text-xs">
                <span className="bg-gray-200 px-2 py-1 rounded">Uniswap</span>
                <span className="bg-gray-200 px-2 py-1 rounded">PancakeSwap</span>
                <span className="bg-gray-200 px-2 py-1 rounded">1inch</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border-4 border-black shadow-[0_8px_0_#111] p-4 text-center">
            <div className="text-2xl font-black text-black">$0.0001</div>
            <div className="text-sm text-gray-600">Current Price</div>
          </div>
          <div className="bg-white rounded-xl border-4 border-black shadow-[0_8px_0_#111] p-4 text-center">
            <div className="text-2xl font-black text-green-600">+420%</div>
            <div className="text-sm text-gray-600">24h Change</div>
          </div>
          <div className="bg-white rounded-xl border-4 border-black shadow-[0_8px_0_#111] p-4 text-center">
            <div className="text-2xl font-black text-black">$69K</div>
            <div className="text-sm text-gray-600">Market Cap</div>
          </div>
          <div className="bg-white rounded-xl border-4 border-black shadow-[0_8px_0_#111] p-4 text-center">
            <div className="text-2xl font-black text-black">1,337</div>
            <div className="text-sm text-gray-600">Holders</div>
          </div>
        </div>
      </div>
    </section>
  );
} 