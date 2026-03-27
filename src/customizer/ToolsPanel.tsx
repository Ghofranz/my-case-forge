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
    <div className="flex flex-col h-[600px] bg-[#161616] border border-[#2A2A2A] rounded-xl overflow-hidden shadow-2xl">
      <div className="flex bg-[#0D0D0D] border-b border-[#2A2A2A]">
        {['colors', 'text', 'images', 'stickers'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 text-[10px] md:text-xs font-bold uppercase transition-all ${
              activeTab === tab ? 'text-[#C6FF00] border-b-2 border-[#C6FF00] bg-[#161616]' : 'text-gray-500 hover:text-white'
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
            <div className="grid grid-cols-4 gap-3 w-full mt-4">
              {['#C6FF00', '#0A0A0A', '#FFFFFF', '#FF0055', '#00E5FF', '#FFAA00', '#9900FF', '#00FF99'].map(c => (
                <button
                  key={c}
                  onClick={() => handleColorChange(c)}
                  className="w-full aspect-square rounded-full border-2 border-[#2A2A2A] hover:scale-110 transition-transform shadow-md"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="flex flex-col gap-4">
            <input 
              type="text" 
              value={textInput} 
              onChange={e => setTextInput(e.target.value)}
              className="w-full bg-[#0D0D0D] text-white border border-[#2A2A2A] rounded-lg p-3 font-sans"
              placeholder="Type something..."
            />
            {FONTS.map(font => (
              <button
                key={font.name}
                onClick={() => fabricApi.addText(textInput, font.name, '#0A0A0A')}
                className="w-full py-3 px-4 bg-[#0D0D0D] text-left rounded-lg text-white hover:border-[#C6FF00] border border-[#2A2A2A] transition-all group"
              >
                <div style={{ fontFamily: font.name }} className="text-xl">{font.label}</div>
                <div className="text-xs text-gray-500 group-hover:text-[#C6FF00]">{font.name}</div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'stickers' && (
          <div className="flex flex-col gap-6">
            {Object.entries(STICKERS).map(([category, emojis]) => (
              <div key={category}>
                <h4 className="text-xs text-gray-500 font-bold uppercase mb-2">{category}</h4>
                <div className="grid grid-cols-4 gap-2">
                  {emojis.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => fabricApi.addStickerEmoji(emoji)}
                      className="text-4xl hover:scale-110 outline-none transition-transform bg-[#0D0D0D] p-2 rounded-lg border border-[#2A2A2A]"
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
          <div className="flex flex-col gap-4 items-center justify-center p-8 border-2 border-dashed border-[#2A2A2A] rounded-xl bg-[#0D0D0D]">
            <label className="bg-[#C6FF00] text-[#0A0A0A] px-6 py-2 rounded-full font-bold uppercase text-sm cursor-pointer hover:bg-white transition-colors shadow-lg">
              Upload Image
              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  fabricApi.addImage(e.target.files[0]);
                }
              }} />
            </label>
            <p className="text-xs text-gray-500 text-center">JPG, PNG, or SVG under 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
