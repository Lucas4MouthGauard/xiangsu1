'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { formatExportName } from '@/lib/exportName';
import { prepareCtx, drawAvatarOutline } from '@/lib/canvasUtils';
import { track } from '@/lib/analytics';

const MBTI_TYPES = {
  'ISTJ': { name: 'The Inspector', color: '#2E8B57', textColor: '#FFFFFF' },
  'ISFJ': { name: 'The Protector', color: '#4682B4', textColor: '#FFFFFF' },
  'INFJ': { name: 'The Counselor', color: '#8A2BE2', textColor: '#FFFFFF' },
  'INTJ': { name: 'The Mastermind', color: '#2F4F4F', textColor: '#FFFFFF' },
  'ISTP': { name: 'The Craftsman', color: '#FF6347', textColor: '#FFFFFF' },
  'ISFP': { name: 'The Composer', color: '#FF69B4', textColor: '#FFFFFF' },
  'INFP': { name: 'The Healer', color: '#9370DB', textColor: '#FFFFFF' },
  'INTP': { name: 'The Architect', color: '#708090', textColor: '#FFFFFF' },
  'ESTP': { name: 'The Dynamo', color: '#FF4500', textColor: '#FFFFFF' },
  'ESFP': { name: 'The Performer', color: '#FF1493', textColor: '#FFFFFF' },
  'ENFP': { name: 'The Champion', color: '#FFD700', textColor: '#FFFFFF' },
  'ENTP': { name: 'The Visionary', color: '#32CD32', textColor: '#FFFFFF' },
  'ESTJ': { name: 'The Supervisor', color: '#8B4513', textColor: '#FFFFFF' },
  'ESFJ': { name: 'The Provider', color: '#FF8C00', textColor: '#FFFFFF' },
  'ENFJ': { name: 'The Teacher', color: '#00CED1', textColor: '#FFFFFF' },
  'ENTJ': { name: 'The Commander', color: '#DC143C', textColor: '#FFFFFF' },
};

const MBTI_STEPS = [
  {
    question: 'How do you prefer to spend your energy?',
    options: [
      { value: 'E', label: 'Extraversion (E)', desc: 'Outward, social, action-oriented' },
      { value: 'I', label: 'Introversion (I)', desc: 'Inward, reflective, thought-oriented' }
    ]
  },
  {
    question: 'How do you prefer to take in information?',
    options: [
      { value: 'S', label: 'Sensing (S)', desc: 'Concrete, practical, detail-oriented' },
      { value: 'N', label: 'Intuition (N)', desc: 'Abstract, theoretical, big-picture' }
    ]
  },
  {
    question: 'How do you prefer to make decisions?',
    options: [
      { value: 'T', label: 'Thinking (T)', desc: 'Logical, objective, analytical' },
      { value: 'F', label: 'Feeling (F)', desc: 'Values-based, subjective, empathetic' }
    ]
  },
  {
    question: 'How do you prefer to approach the outer world?',
    options: [
      { value: 'J', label: 'Judging (J)', desc: 'Structured, planned, decisive' },
      { value: 'P', label: 'Perceiving (P)', desc: 'Flexible, spontaneous, adaptable' }
    ]
  }
];

function MBTIGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [mbtiResult, setMbtiResult] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [customText, setCustomText] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [showPill, setShowPill] = useState(true);

  const handleMBTIChoice = (choice: string) => {
    const newAnswers = [...selectedAnswers, choice];
    setSelectedAnswers(newAnswers);
    
    if (newAnswers.length === 4) {
      const mbtiType = newAnswers.join('');
      setMbtiResult(mbtiType);
      setCurrentStep(4);
      track('mbti_completed', { type: mbtiType });
    } else {
      setCurrentStep(newAnswers.length);
    }
  };

  const resetMBTI = () => {
    setCurrentStep(0);
    setMbtiResult('');
    setSelectedAnswers([]);
    setCustomText('');
    setShowPill(true);
  };

  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mbtiResult) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    prepareCtx(ctx);
    const imgSize = 512;
    canvas.width = imgSize;
    canvas.height = imgSize;

    const mbtiConfig = MBTI_TYPES[mbtiResult as keyof typeof MBTI_TYPES];
    if (!mbtiConfig) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = mbtiConfig.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new window.Image();
    img.src = '/images/trolltouming.png';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, imgSize, imgSize);

      // 绘制 MBTI 类型文本（主要文本）
      const mbtiText = `${mbtiResult} - ${mbtiConfig.name}`;
      ctx.font = '900 48px Impact, Arial Black, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 8;
      ctx.strokeText(mbtiText, canvas.width / 2, canvas.height * 0.85);
      
      ctx.fillStyle = mbtiConfig.textColor;
      ctx.fillText(mbtiText, canvas.width / 2, canvas.height * 0.85);

      // 如果有自定义文本，作为半透明水印绘制在6个随机位置
      if (customText) {
        ctx.font = 'bold 20px Impact, Arial Black, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 半透明效果
        ctx.globalAlpha = 0.25;
        
        // 6个随机位置
        const positions = [
          { x: 100, y: 80 },
          { x: 400, y: 120 },
          { x: 150, y: 300 },
          { x: 350, y: 250 },
          { x: 80, y: 400 },
          { x: 420, y: 380 }
        ];
        
        // 为每个位置绘制45度角的水印
        positions.forEach((pos) => {
          ctx.save(); // 保存当前状态
          
          // 移动到位置并旋转45度
          ctx.translate(pos.x, pos.y);
          ctx.rotate(-Math.PI / 4); // 45度角
          
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2;
          ctx.strokeText(customText, 0, 0);
          
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(customText, 0, 0);
          
          ctx.restore(); // 恢复状态
        });
        
        // 恢复透明度
        ctx.globalAlpha = 1.0;
      }

      drawAvatarOutline(ctx, imgSize, imgSize);
    };
  }, [mbtiResult, customText]);

  useEffect(() => {
    drawMeme();
  }, [drawMeme]);

  const handleExport = async () => {
    if (isExporting || !mbtiResult) return;
    
    setIsExporting(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const dataURL = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataURL;
      const filename = formatExportName({ brand: 'troll', kind: 'mbti' });
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      track('export', { type: 'png', size: `${canvas.width}x${canvas.height}`, mbti: mbtiResult });
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const startMBTI = () => {
    setShowPill(false);
    setCurrentStep(0);
    track('mbti_started');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-black mb-4">🎭 MBTI MEME GENERATOR</h2>
        <p className="text-lg text-gray-700">Discover your personality type & create unique memes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative bg-white border-4 border-black rounded-2xl shadow-[0_8px_0_#111] overflow-hidden min-h-96">
            {showPill ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <button onClick={startMBTI} className="group transition-all duration-300 hover:scale-110">
                  <Image src="/images/touming.svg" alt="Start MBTI" width={80} height={80} className="animate-bounce" />
                  <div className="text-center mt-4">
                    <div className="text-xl font-bold text-black">💊 CLICK TO START</div>
                    <div className="text-sm text-gray-600">Discover your MBTI type</div>
                  </div>
                </button>
              </div>
            ) : currentStep < 4 ? (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-black mb-6">{MBTI_STEPS[currentStep].question}</div>
                  <div className="space-y-4">
                    {MBTI_STEPS[currentStep].options.map((option) => (
                      <button key={option.value} onClick={() => handleMBTIChoice(option.value)} className="block w-full p-4 bg-white border-2 border-black rounded-lg hover:bg-gray-100 transition-all text-left">
                        <div className="font-bold text-lg">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 text-sm text-gray-500">Step {currentStep + 1} of 4</div>
                </div>
              </div>
            ) : (
              <canvas ref={canvasRef} className="w-full h-auto max-h-96 object-contain" />
            )}
            {isExporting && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl mb-2">🔄 EXPORTING...</div>
                </div>
              </div>
            )}
          </div>
          
          {mbtiResult && (
            <button onClick={handleExport} disabled={isExporting} className="w-full bg-black text-white py-4 px-6 font-bold text-lg border-4 border-black shadow-[0_8px_0_#111] active:translate-y-1 transition-transform disabled:opacity-50">
              {isExporting ? 'EXPORTING...' : '🚀 EXPORT MBTI MEME'}
            </button>
          )}
        </div>

        <div className="space-y-6">
          {mbtiResult ? (
            <>
              <div className="bg-white border-4 border-black rounded-xl p-6">
                <h3 className="text-2xl font-bold text-black mb-4">🎯 YOUR MBTI TYPE</h3>
                <div className="text-4xl font-bold p-4 rounded-lg mb-4" style={{ backgroundColor: MBTI_TYPES[mbtiResult as keyof typeof MBTI_TYPES]?.color, color: MBTI_TYPES[mbtiResult as keyof typeof MBTI_TYPES]?.textColor }}>
                  {mbtiResult}
                </div>
                <div className="text-lg font-bold text-black">{MBTI_TYPES[mbtiResult as keyof typeof MBTI_TYPES]?.name}</div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">✍️ CUSTOM TEXT</h3>
                <input type="text" value={customText} onChange={(e) => setCustomText(e.target.value)} placeholder="Enter custom text..." className="w-full p-3 border-2 border-black rounded-lg font-bold text-center" maxLength={50} />
              </div>

              <button onClick={resetMBTI} className="w-full py-3 px-6 font-bold border-4 border-black rounded-lg bg-white hover:bg-gray-100 transition-all">
                🔄 RESTART MBTI TEST
              </button>
            </>
          ) : (
            <div className="bg-white border-4 border-black rounded-xl p-6">
              <h3 className="text-xl font-bold text-black mb-4">💊 MBTI PERSONALITY TEST</h3>
              <p className="text-gray-700 mb-4">Click the pill to start your MBTI personality test. Answer 4 questions to discover your unique personality type.</p>
              <div className="text-sm text-gray-600">
                • 16 different personality types<br/>
                • Unique color schemes<br/>
                • Personalized meme generation
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MBTIGenerator;