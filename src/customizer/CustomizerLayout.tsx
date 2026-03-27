"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { useFabric } from "./useFabric";
import { ChevronDown, Smartphone, Undo2, Redo2, Trash2, Camera } from 'lucide-react';

const PhoneModel3D = dynamic(() => import("./PhoneModel3D"), { ssr: false });
const ToolsPanel = dynamic(() => import("./ToolsPanel"), { ssr: false });
const LayerManager = dynamic(() => import("./LayerManager"), { ssr: false });
const PhoneCaseSVG = dynamic(() => import("./PhoneCaseSVG"), { ssr: false });

const MODELS = ['iPhone 15 Pro', 'iPhone 14', 'Samsung S24 Ultra', 'Pixel 8 Pro', 'OnePlus 12', 'Xiaomi 14'];

export default function CustomizerLayout() {
  const fabricApi = useFabric();
  const { phoneModel, setPhoneModel, canUndo, canRedo } = useCustomizerStore();
  const [show3DModal, setShow3DModal] = useState(false);
  const [modelDropdown, setModelDropdown] = useState(false);
  const [designName, setDesignName] = useState("Untitled Design");
  const [isSaved, setIsSaved] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('findDOMNode')) return;
      originalWarn(...args);
    };
    return () => { console.warn = originalWarn; };
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#0F0F11]">
        <div className="w-16 h-16 border-4 border-[#333] border-t-[#C6FF00] rounded-full animate-spin"></div>
        <div className="mt-8 font-bebas text-2xl tracking-[0.2em] text-[#C6FF00] animate-pulse">Initializing Forge</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col items-center bg-[#0F0F11]">
      <div className="absolute inset-x-0 bottom-0 top-[10%] bg-[radial-gradient(ellipse_1000px_800px_at_center,_#1a1f2e_0%,_#0F0F11_100%)] pointer-events-none z-0"></div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1700px] mx-auto items-stretch justify-center pt-8 pb-[120px] px-6 z-10">
        
        {/* LEFT COLUMN */}
        <div className="hidden lg:flex flex-col w-[320px] flex-shrink-0 gap-4">
          <div className="relative bg-[#1e1e22] border border-[#333] rounded-[10px] p-2 hover:border-[#444] transition-colors shadow-xl">
            <button onClick={() => setModelDropdown(!modelDropdown)} className="w-full flex items-center justify-between p-2 outline-none">
              <div className="flex items-center gap-3 text-white">
                <Smartphone className="w-4 h-4 text-[#C6FF00]" />
                <span className="font-sans font-bold text-xs uppercase tracking-widest">{phoneModel}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-[#666] transition-transform ${modelDropdown ? 'rotate-180' : ''}`} />
            </button>
            {modelDropdown && (
              <div className="absolute top-16 left-0 w-full bg-[#161618] border border-[#333] rounded-[10px] shadow-2xl overflow-hidden z-[100]">
                {MODELS.map(m => (
                  <button key={m} onClick={() => { setPhoneModel(m); setModelDropdown(false); }} className={`w-full flex items-center gap-3 p-4 text-xs font-bold uppercase transition-colors text-left ${phoneModel === m ? 'bg-[#1a1a1e] text-[#C6FF00]' : 'text-gray-400 hover:bg-[#1a1a1e] hover:text-white'}`}>
                    <Smartphone className="w-4 h-4 opacity-50" /> {m}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <ToolsPanel fabricApi={fabricApi} />
          <LayerManager fabricApi={fabricApi} />
        </div>

        {/* CENTER COLUMN: LIVE CANVAS */}
        <div className="flex-1 flex flex-col items-center justify-start bg-[#13131a] border border-[#252530] rounded-2xl relative shadow-2xl xl:mx-8 overflow-hidden z-10">
          <div className="w-full p-3 border-b border-[#252530] flex justify-between items-center z-10 bg-[#161618]">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-[#1e1e22] p-1 rounded-lg border border-[#2a2a2e]">
                <button onClick={fabricApi.undo} disabled={!canUndo} className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a30] rounded-md disabled:opacity-30 transition-colors" title="Undo"><Undo2 className="w-4 h-4" /></button>
                <div className="w-[1px] h-4 bg-[#333] mx-1"></div>
                <button onClick={fabricApi.redo} disabled={!canRedo} className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a30] rounded-md disabled:opacity-30 transition-colors" title="Redo"><Redo2 className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center bg-[#1e1e22] p-1 rounded-lg border border-[#2a2a2e]">
                 <button onClick={() => { fabricApi.fabricRef.current?.clear(); fabricApi.setBackgroundColor('#161616'); }} className="p-2 text-gray-400 hover:text-[#ff3333] hover:bg-[#ff3333]/10 rounded-md transition-colors group" title="Clear Canvas">
                   <Trash2 className="w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(255,51,102,0.8)]" />
                 </button>
              </div>
            </div>
            {isSaved ? (
              <div className="flex items-center gap-2 bg-[#1a2a1a] border border-[#2a4a2a] px-3 py-1.5 rounded-full shadow-inner">
                <span className="w-[6px] h-[6px] rounded-full bg-[#C6FF00] shadow-[0_0_6px_#C6FF00] animate-pulse"></span>
                <span className="text-[9px] text-[#C6FF00] font-bold tracking-[0.15em] uppercase leading-none mt-0.5">Synced</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-[#2a251a] border border-[#4a402a] px-3 py-1.5 rounded-full shadow-inner">
                <span className="w-[6px] h-[6px] rounded-full bg-[#f59e0b]"></span>
                <span className="text-[9px] text-[#f59e0b] font-bold tracking-[0.15em] uppercase leading-none mt-0.5">Saving</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 w-full flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_#1a1a24_0%,_#13131a_100%)]">
            <div className="relative" style={{ filter: 'drop-shadow(0 40px 80px rgba(198,255,0,0.06))', width: 300, height: 620, minHeight: 620 }}>
              <PhoneCaseSVG model={phoneModel} />
              <canvas ref={fabricApi.canvasRef} className="absolute inset-0" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D PREVIEW */}
        <div className="hidden lg:flex w-[380px] flex-shrink-0 flex-col gap-4">
          <div className="bg-[#161618] border border-[#2a2a2e] rounded-2xl p-5 shadow-2xl flex-1 flex flex-col pt-4">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#2a2a2e]">
              <Camera className="w-4 h-4 text-[#C6FF00]" />
              <h2 className="font-bebas text-lg text-white tracking-[0.15em] uppercase">Render View</h2>
            </div>
            <div className="flex-1 min-h-[480px]">
               <PhoneModel3D canvasEl={fabricApi.canvasRef.current} />
            </div>
            
            <div className="flex justify-between items-center bg-[#1a1a1e] mt-4 p-1.5 rounded-full border border-[#333]">
              <button className="flex-1 text-[9px] font-bold tracking-widest text-black bg-[#C6FF00] py-2 rounded-full uppercase shadow-[0_0_15px_rgba(198,255,0,0.2)]">Studio</button>
              <button className="flex-1 text-[9px] font-bold tracking-widest text-[#777] hover:text-white py-2 rounded-full uppercase transition-colors">Soft</button>
              <button className="flex-1 text-[9px] font-bold tracking-widest text-[#777] hover:text-white py-2 rounded-full uppercase transition-colors">Warm</button>
            </div>
            
            <button className="w-full mt-3 py-3 bg-[#1e1e22] hover:bg-[#25252a] text-gray-300 hover:text-[#C6FF00] border border-[#333] text-[9px] tracking-[0.15em] font-bold uppercase rounded-[10px] transition-colors flex justify-center items-center gap-2">
               📸 Screenshot Render
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 w-full h-[90px] bg-gradient-to-t from-[#0A0A0C] via-[#0F0F11]/95 to-transparent flex items-center justify-between px-8 z-50 pointer-events-none backdrop-blur-sm">
        <div className="w-full max-w-[1700px] mx-auto flex items-end justify-between pointer-events-auto pb-6 gap-4 border-t border-[#2a2a2e]/50 pt-4">
           
           <div className="hidden lg:flex items-center gap-3">
             <input type="text" value={designName} onChange={(e)=>setDesignName(e.target.value)} placeholder="Untitled Design" className="bg-transparent border-b border-transparent hover:border-[#333] focus:border-[#C6FF00] transition-colors text-3xl font-bebas text-white outline-none w-64 pb-1 group-hover:border-[#666]" />
           </div>

           <div className="lg:hidden flex items-center bg-[#1e1e22] rounded-[10px] border border-[#333] shadow-2xl flex-1">
             <input type="text" value={designName} onChange={(e)=>setDesignName(e.target.value)} className="w-full bg-transparent px-4 py-3 text-sm font-bold text-white outline-none" />
           </div>
           
           <div className="flex items-center gap-3">
             <button className="hidden lg:block px-6 py-3 border border-[#333] text-gray-300 font-bold uppercase text-[10px] tracking-widest rounded-full hover:border-[#aaa] hover:text-white transition-colors bg-[#111]">💾 Save to Account</button>
             <button className="hidden lg:block px-6 py-3 border border-[#333] text-gray-300 font-bold uppercase text-[10px] tracking-widest rounded-full hover:border-[#C6FF00] hover:text-[#C6FF00] transition-colors bg-[#111] shadow-inner">⬇ Download PNG</button>
             <button className="px-8 py-3.5 bg-[#C6FF00] text-[#000] font-bold uppercase text-xs rounded-full shadow-[0_0_20px_rgba(198,255,0,0.25)] hover:scale-[1.03] transition-transform tracking-widest flex items-center gap-2">
                🛒 Add to Cart &bull; $34.99
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
