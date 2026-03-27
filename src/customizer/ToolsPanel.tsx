"use client";

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useCustomizerStore } from '../store/useCustomizerStore';

const FONTS = [
  { name: 'Bebas Neue', label: 'BOLD DISPLAY' },
  { name: 'Pacifico', label: 'Retro Round' },
  { name: 'Space Mono', label: 'Monospace' },
  { name: 'Playfair Display', label: 'Elegant Serif' },
  { name: 'Permanent Marker', label: 'Handwritten' },
  { name: 'Orbitron', label: 'Futuristic' },
  { name: 'Dancing Script', label: 'Calligraphy' },
  { name: 'Anton', label: 'Poster Heavy' },
];

const STICKERS = {
  Vibes: ["🔥","💀","⚡","🌊","✨","🎯","💥","🫧"],
  Nature: ["🌸","🍃","🌙","☀️","🌈","❄️","🦋","🌿"],
  Food: ["🍕","🧋","🍓","🍦","🌮","🍜","🧁","🍉"],
  Faces: ["😈","🤖","👾","💀","🎭","🫠","🥶","😤"],
};

export default function ToolsPanel({ fabricApi }: { fabricApi: any }) {
  const { activeTab, setActiveTab } = useCustomizerStore();
  const [color, setColor] = useState("#C6FF00");
  const [textInput, setTextInput] = useState("CASEFORGE");

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    fabricApi.setBackgroundColor(newColor);
  };

  return (
    <div className="flex flex-col h-[500px] bg-[#161618] border-r border-[#2a2a2e] rounded-xl overflow-hidden shadow-2xl">
      <div className="flex bg-[#1a1a1e] p-2 gap-1 rounded-t-xl">
        {['colors', 'text', 'images', 'stickers'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-2 text-[10px] md:text-xs uppercase transition-all rounded-full ${
              activeTab === tab ? 'text-[#000] bg-[#C6FF00] font-bold' : 'text-[#666] hover:text-[#fff] font-medium'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {activeTab === 'colors' && (
          <div className="flex flex-col gap-6 items-center">
            <HexColorPicker color={color} onChange={handleColorChange} />
            <div className="grid grid-cols-4 gap-3 w-full mt-4 bg-[#1a1a1e] p-3 rounded-xl border border-[#2a2a2e]">
              <h4 className="col-span-4 text-[9px] tracking-[0.15em] text-[#555] uppercase font-bold">Presets</h4>
              {['#C6FF00', '#0A0A0A', '#FFFFFF', '#FF0055', '#00E5FF', '#FFAA00', '#9900FF', '#00FF99'].map(c => (
                <button
                  key={c}
                  onClick={() => handleColorChange(c)}
                  className="w-full aspect-square rounded-full border border-[#2A2A2A] hover:scale-110 hover:shadow-[0_0_15px_rgba(198,255,0,0.4)] hover:border-[#C6FF00] transition-all"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#1a1a1e] p-3 rounded-xl border border-[#2a2a2e]">
              <h4 className="text-[9px] tracking-[0.15em] text-[#555] uppercase font-bold mb-2">Input Layer</h4>
              <input 
                type="text" 
                value={textInput} 
                onChange={e => setTextInput(e.target.value)}
                className="w-full bg-[#0D0D0D] text-white border border-[#2A2A2A] rounded-[8px] p-3 font-sans focus:border-[#C6FF00] outline-none transition-colors"
                placeholder="Type something..."
              />
            </div>
            
            <div className="bg-[#1a1a1e] p-3 rounded-xl border border-[#2a2a2e]">
              <h4 className="text-[9px] tracking-[0.15em] text-[#555] uppercase font-bold mb-2">Typography Library</h4>
              <div className="flex flex-col gap-2">
                {FONTS.map(font => (
                  <button
                    key={font.name}
                    onClick={() => fabricApi.addText(textInput, font.name, '#0A0A0A')}
                    className="w-full py-2 px-3 bg-[#13131a] text-left rounded-lg text-white hover:border-[#C6FF00] hover:shadow-[0_0_10px_rgba(198,255,0,0.1)] border border-[#2A2A2A] transition-all group flex items-center justify-between"
                  >
                    <div style={{ fontFamily: font.name }} className="text-lg truncate max-w-[140px]">{font.label}</div>
                    <div className="text-[9px] text-[#555] group-hover:text-[#C6FF00]">{font.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stickers' && (
          <div className="flex flex-col gap-6">
            {Object.entries(STICKERS).map(([category, emojis]) => (
              <div key={category} className="bg-[#1a1a1e] p-3 rounded-xl border border-[#2a2a2e]">
                <h4 className="text-[9px] tracking-[0.15em] text-[#555] uppercase font-bold mb-3">{category}</h4>
                <div className="grid grid-cols-4 gap-2">
                  {emojis.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => fabricApi.addStickerEmoji(emoji)}
                      className="text-3xl hover:scale-110 outline-none transition-transform bg-[#1e1e22] hover:bg-[#2a2a30] p-2 rounded-[8px] border border-transparent hover:border-[#C6FF00] hover:shadow-[0_0_0_2px_#C6FF00]"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'images' && (
           <div className="bg-[#1a1a1e] p-3 rounded-xl border border-[#2a2a2e]">
            <h4 className="text-[9px] tracking-[0.15em] text-[#555] uppercase font-bold mb-3">Custom Uploads</h4>
            <div className="flex flex-col gap-4 items-center justify-center p-8 border-2 border-dashed border-[#2a2a2e] rounded-[10px] bg-[#13131a] hover:border-[#C6FF00] transition-colors group">
              <label className="bg-transparent border border-[#C6FF00] text-[#C6FF00] px-6 py-2 rounded-full font-bold uppercase text-[10px] cursor-pointer hover:bg-[#C6FF00] hover:text-[#000] transition-colors shadow-lg">
                Choose Image File
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    fabricApi.addImage(e.target.files[0]);
                  }
                }} />
              </label>
              <p className="text-[10px] text-[#555] text-center group-hover:text-[#666]">Supported: JPG, PNG, SVG (Max 5MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
