"use client";

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useCustomizerStore } from '../store/useCustomizerStore';

const FONTS = [
  { name: 'Bebas Neue',       label: 'BOLD DISPLAY' },
  { name: 'Pacifico',         label: 'Retro Round' },
  { name: 'Space Mono',       label: 'Monospace' },
  { name: 'Playfair Display', label: 'Elegant Serif' },
  { name: 'Permanent Marker', label: 'Handwritten' },
  { name: 'Orbitron',         label: 'Futuristic' },
  { name: 'Dancing Script',   label: 'Calligraphy' },
  { name: 'Anton',            label: 'Poster Heavy' },
];

const STICKERS: Record<string, string[]> = {
  Vibes:  ['🔥','💀','⚡','🌊','✨','🎯','💥','🫧'],
  Nature: ['🌸','🍃','🌙','☀️','🌈','❄️','🦋','🌿'],
  Food:   ['🍕','🧋','🍓','🍦','🌮','🍜','🧁','🍉'],
  Faces:  ['😈','🤖','👾','💀','🎭','🫠','🥶','😤'],
};

const PRESET_COLORS = [
  '#C6FF00','#0A0A0A','#FFFFFF','#FF0055',
  '#00E5FF','#FFAA00','#9900FF','#00FF99',
  '#EFEFEF','#222222','#E2FF99','#FF3366',
];

export default function ToolsPanel({ fabricApi }: { fabricApi: any }) {
  const { activeTab, setActiveTab } = useCustomizerStore();
  const [color, setColor]         = useState('#EFEFEF');
  const [textInput, setTextInput] = useState('CASEFORGE');

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    fabricApi.setBackgroundColor(newColor);
  };

  return (
    <div className="flex flex-col h-[500px] bg-white border border-[#e5e5e0] rounded-[24px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all">
      {/* Tab bar */}
      <div className="flex bg-[#F9F9F9] p-2 gap-1 rounded-t-[24px] border-b border-[#f0f0f0]">
        {(['colors','text','images','stickers'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-[10px] uppercase transition-all rounded-[12px] font-bold ${
              activeTab === tab
                ? 'text-[#000] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-[#eeeeee]'
                : 'text-[#888] hover:text-[#000] hover:bg-white/50 border border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {/* ── COLORS ── */}
        {activeTab === 'colors' && (
          <div className="flex flex-col gap-4 items-center">
            
            <div className="w-full p-2 bg-[#F9F9F9] rounded-[16px] border border-[#f0f0f0] shadow-sm">
                <HexColorPicker color={color} onChange={handleColorChange} style={{ width: '100%', height: '160px' }} />
            </div>

            <div className="grid grid-cols-4 gap-3 w-full mt-1 bg-[#F9F9F9] p-4 rounded-[16px] border border-[#eee]">
              <h4 className="col-span-4 text-[9px] tracking-[0.15em] text-[#888] uppercase font-bold mb-1">
                Presets
              </h4>
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => handleColorChange(c)}
                  title={c}
                  style={{ backgroundColor: c }}
                  className="w-full aspect-square rounded-full border border-[#ddd] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:scale-110 hover:border-[#C6FF00] transition-all"
                />
              ))}
            </div>

            {/* Current hex display */}
            <div className="w-full flex items-center justify-between bg-white border border-[#e5e5e0] rounded-[12px] px-4 py-3 shadow-sm">
              <span className="text-[10px] font-bold text-[#888] tracking-widest uppercase">Hex Code</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#0A0A0A]">{color.toUpperCase()}</span>
                <div className="w-4 h-4 rounded-full border border-[#ddd]" style={{ backgroundColor: color }} />
              </div>
            </div>
          </div>
        )}

        {/* ── TEXT ── */}
        {activeTab === 'text' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#F9F9F9] p-4 rounded-[16px] border border-[#eee]">
              <h4 className="text-[9px] tracking-[0.15em] text-[#888] uppercase font-bold mb-3">
                Input Text
              </h4>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full bg-white text-[#0A0A0A] border border-[#e0e0e0] rounded-[12px] p-3.5 font-sans font-bold focus:border-[#C6FF00] focus:ring-2 focus:ring-[#C6FF00]/20 outline-none transition-all text-sm shadow-sm placeholder-[#aaa]"
                placeholder="Type something…"
              />
            </div>

            <div className="bg-[#F9F9F9] p-4 rounded-[16px] border border-[#eee]">
              <h4 className="text-[9px] tracking-[0.15em] text-[#888] uppercase font-bold mb-3">
                Typography Library
              </h4>
              <div className="flex flex-col gap-2">
                {FONTS.map((font) => (
                  <button
                    key={font.name}
                    onClick={() => fabricApi.addText(textInput || 'Sample', font.name, '#0A0A0A')}
                    className="w-full py-3 px-4 bg-white text-left rounded-[12px] text-[#0A0A0A] hover:border-[#C6FF00] border border-[#e0e0e0] transition-all group flex items-center justify-between shadow-sm hover:shadow-md"
                  >
                    <span style={{ fontFamily: font.name }} className="text-lg truncate max-w-[140px]">
                      {font.label}
                    </span>
                    <span className="text-[9px] text-[#888] font-bold uppercase tracking-widest group-hover:text-[#0A0A0A]">
                      {font.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STICKERS ── */}
        {activeTab === 'stickers' && (
          <div className="flex flex-col gap-4">
            {Object.entries(STICKERS).map(([category, emojis]) => (
              <div key={category} className="bg-[#F9F9F9] p-4 rounded-[16px] border border-[#eee]">
                <h4 className="text-[9px] tracking-[0.15em] text-[#888] uppercase font-bold mb-4">
                  {category}
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {emojis.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => fabricApi.addStickerEmoji(emoji)}
                      className="text-3xl hover:scale-125 hover:-rotate-12 outline-none transition-transform bg-white hover:bg-white p-3 rounded-[12px] border border-[#e0e0e0] hover:border-[#C6FF00] hover:shadow-lg shadow-sm flex items-center justify-center"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── IMAGES ── */}
        {activeTab === 'images' && (
          <div className="bg-[#F9F9F9] p-4 rounded-[16px] border border-[#eee]">
            <h4 className="text-[9px] tracking-[0.15em] text-[#888] uppercase font-bold mb-4">
              Custom Uploads
            </h4>
            <div className="flex flex-col gap-4 items-center justify-center p-8 border-2 border-dashed border-[#ddd] rounded-[16px] bg-white hover:border-[#C6FF00] transition-colors group">
              <label className="bg-transparent border-2 border-[#C6FF00] text-[#0A0A0A] px-6 py-3 rounded-full font-bold uppercase text-[10px] cursor-pointer hover:bg-[#C6FF00] transition-colors shadow-sm">
                Choose Image File
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) fabricApi.addImage(e.target.files[0]);
                  }}
                />
              </label>
              <p className="text-[10px] text-[#888] font-bold text-center group-hover:text-[#0A0A0A]">
                Supported: JPG, PNG, SVG (Max 5 MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
