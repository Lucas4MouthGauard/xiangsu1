'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { formatExportName } from '@/lib/exportName';
import { prepareCtx, drawAvatarOutline } from '@/lib/canvasUtils';
import { track } from '@/lib/analytics';

const MEME_TEMPLATES = [
  { id: 'cope', text: 'COPE HARDER', color: '#FF0000' },
  { id: 'based', text: 'BASED & REDPILLED', color: '#00FF00' },
  { id: 'rent', text: 'RENT FREE FOREVER', color: '#0000FF' },
  { id: 'early', text: 'TOO EARLY IS PERFECT', color: '#FFD700' },
  { id: 'pill', text: 'PILL TAKEN. COPE STARTED', color: '#FF69B4' },
  { id: 'print', text: 'PRINT MEMES, NOT EXCUSES', color: '#FF4500' },
  { id: 'flood', text: 'FLOOD THEM WITH YELLOW', color: '#FFD400' },
  { id: 'dose', text: 'DOSE UP OR MISS OUT', color: '#FF1493' },
  { id: 'content', text: 'YOUR COPE, MY CONTENT', color: '#00CED1' },
  { id: 'scroll', text: 'TRY HARDER, SCROLL FASTER', color: '#FF6347' },
];

export function Generator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(MEME_TEMPLATES[0]);
  const [customText, setCustomText] = useState('');
  const [fontSize, setFontSize] = useState(60);
  const [textColor, setTextColor] = useState('#FFD400');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    prepareCtx(ctx);
    const imgSize = 512;
    canvas.width = imgSize;
    canvas.height = imgSize;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 黄色背景
    ctx.fillStyle = '#FFD400';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制基础 Troll 图片
    const img = new window.Image();
    img.src = '/images/Troll.png';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, imgSize, imgSize);

      // 绘制文字
      const text = customText || selectedTemplate.text;
      ctx.font = `900 ${fontSize}px Impact, Arial Black, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // 文字描边
      ctx.strokeStyle = '#000';
      ctx.lineWidth = fontSize * 0.15;
      ctx.strokeText(text, canvas.width / 2, canvas.height * 0.85);
      
      // 文字填充
      ctx.fillStyle = textColor;
      ctx.fillText(text, canvas.width / 2, canvas.height * 0.85);

      // 添加黑色边框
      drawAvatarOutline(ctx, imgSize, imgSize);
    };
  }, [selectedTemplate, customText, fontSize, textColor]);

  useEffect(() => {
    drawMeme();
  }, [drawMeme]);

  const handleExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // 模拟导出进度
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      const dataURL = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataURL;
      const filename = formatExportName({ 
        brand: 'troll', 
        kind: 'pill' 
      });
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      track('export', { 
        type: 'png', 
        size: `${canvas.width}x${canvas.height}`, 
        template: selectedTemplate.id 
      });
      
      // 成功提示
      const event = new CustomEvent('showToast', { 
        detail: { message: '🎉 MEME EXPORTED!', type: 'success' } 
      });
      window.dispatchEvent(event);
      
    } catch (error) {
      console.error('Export failed:', error);
      const event = new CustomEvent('showToast', { 
        detail: { message: '❌ Export failed!', type: 'error' } 
      });
      window.dispatchEvent(event);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleTemplateSelect = (template: typeof MEME_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setTextColor(template.color);
    track('template_selected', { id: template.id });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-black mb-4">🎭 MEME GENERATOR</h2>
        <p className="text-lg text-gray-700">Create viral troll memes with laser eyes & pump effects</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 预览区域 */}
        <div className="space-y-4">
          <div className="relative bg-white border-4 border-black rounded-2xl shadow-[0_8px_0_#111] overflow-hidden">
            <canvas 
              ref={canvasRef} 
              className="w-full h-auto max-h-96 object-contain"
            />
            {isExporting && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl mb-2">🔄 EXPORTING...</div>
                  <div className="w-64 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    ></div>
                  </div>
                  <div className="mt-2">{exportProgress}%</div>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-black text-white py-4 px-6 font-bold text-lg border-4 border-black shadow-[0_8px_0_#111] active:translate-y-1 transition-transform disabled:opacity-50"
          >
            {isExporting ? 'EXPORTING...' : '🚀 EXPORT MEME'}
          </button>
        </div>

        {/* 控制面板 */}
        <div className="space-y-6">
          {/* 模板选择 */}
          <div>
            <h3 className="text-xl font-bold mb-3">🔥 VIRAL TEMPLATES</h3>
            <div className="grid grid-cols-2 gap-2">
              {MEME_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-3 text-sm font-bold border-2 border-black rounded-lg transition-all ${
                    selectedTemplate.id === template.id
                      ? 'bg-black text-white shadow-[0_4px_0_#111]'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {template.text}
                </button>
              ))}
            </div>
          </div>

          {/* 自定义文字 */}
          <div>
            <h3 className="text-xl font-bold mb-3">✍️ CUSTOM TEXT</h3>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Enter your own text..."
              className="w-full p-3 border-2 border-black rounded-lg font-bold text-center"
              maxLength={50}
            />
          </div>



          {/* 字体大小 */}
          <div>
            <h3 className="text-xl font-bold mb-3">📏 FONT SIZE</h3>
            <input
              type="range"
              min="30"
              max="100"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center mt-2 font-bold">{fontSize}px</div>
          </div>

          {/* 文字颜色 */}
          <div>
            <h3 className="text-xl font-bold mb-3">🎨 TEXT COLOR</h3>
            <div className="grid grid-cols-6 gap-2">
              {['#FFD400', '#FF0000', '#00FF00', '#0000FF', '#FF69B4', '#FF4500'].map((color) => (
                <button
                  key={color}
                  onClick={() => setTextColor(color)}
                  className={`w-12 h-12 rounded-lg border-2 border-black ${
                    textColor === color ? 'border-4' : ''
                  }`}
                  style={{ backgroundColor: color }}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}