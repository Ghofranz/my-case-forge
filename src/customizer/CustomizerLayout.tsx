"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { useFabric } from "./useFabric";

const PhoneModel3D = dynamic(() => import("./PhoneModel3D"), { ssr: false });
const ToolsPanel = dynamic(() => import("./ToolsPanel"), { ssr: false });
const LayerManager = dynamic(() => import("./LayerManager"), { ssr: false });

export default function CustomizerLayout() {
  const fabricApi = useFabric();
  const { phoneModel, setPhoneModel, canUndo, canRedo } = useCustomizerStore();
  const [show3DModal, setShow3DModal] = useState(false);

  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('findDOMNode')) return;
      originalWarn(...args);
    };
    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1600px] mx-auto items-stretch justify-center min-h-[calc(100vh-80px)] pt-4 pb-20 lg:pb-4">
      
      {/* LEFT COLUMN: Tools & Layers */}
      <div className="hidden lg:flex flex-col w-[320px] flex-shrink-0 gap-4">
        <div className="bg-[#161616] border border-[#2A2A2A] rounded-xl p-3 shadow-lg">
          <select 
            value={phoneModel} 
            onChange={(e) => setPhoneModel(e.target.value)}
            className="w-full bg-[#0D0D0D] text-white border border-[#2A2A2A] rounded-lg p-2 font-sans font-bold outline-none focus:border-[#C6FF00]"
          >
            {['iPhone 15 Pro', 'iPhone 14', 'Samsung S24 Ultra', 'Pixel 8 Pro', 'OnePlus 12', 'Xiaomi 14'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        
        <ToolsPanel fabricApi={fabricApi} />
        <LayerManager fabricApi={fabricApi} />
      </div>

      {/* CENTER COLUMN: Live 2D Canvas */}
      <div className="flex-1 flex flex-col items-center justify-start bg-[#161616] border border-[#2A2A2A] rounded-xl relative overflow-hidden shadow-2xl">
        <div className="w-full p-3 bg-[#0D0D0D] border-b border-[#2A2A2A] flex justify-between items-center z-10 lg:pl-4">
          <div className="flex gap-2">
            <button onClick={fabricApi.undo} disabled={!canUndo} className="px-4 py-2 bg-[#161616] border border-[#2A2A2A] text-white text-[10px] font-bold uppercase rounded-lg hover:border-[#C6FF00] disabled:opacity-30 transition-colors">Undo</button>
            <button onClick={fabricApi.redo} disabled={!canRedo} className="px-4 py-2 bg-[#161616] border border-[#2A2A2A] text-white text-[10px] font-bold uppercase rounded-lg hover:border-[#C6FF00] disabled:opacity-30 transition-colors">Redo</button>
            <button onClick={() => { fabricApi.fabricRef.current?.clear(); fabricApi.setBackgroundColor('#C6FF00'); }} className="px-4 py-2 bg-red-900/20 text-red-500 border border-red-900 text-[10px] uppercase font-bold rounded-lg hover:bg-red-900/40 transition-colors ml-4">Clear All</button>
          </div>
          <div className="flex items-center gap-2 pr-2">
            <span className="w-2 h-2 rounded-full bg-[#C6FF00] shadow-[0_0_8px_#C6FF00]"></span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Synced</span>
          </div>
        </div>
        
        <div className="flex-1 w-full h-[800px] flex items-center justify-center p-8 overflow-hidden bg-[radial-gradient(circle_at_center,_#2A2A2A_1px,_transparent_1px)] bg-[size:20px_20px]">
          {/* Virtual Phone Case Bounding Box */}
          <div className="relative rounded-[40px] border-[14px] border-[#0A0A0A] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden bg-white" style={{ width: 400, height: 800, minHeight: 800 }}>
            <canvas ref={fabricApi.canvasRef} className="absolute inset-0" />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Live 3D Preview */}
      <div className="hidden lg:flex w-[380px] flex-shrink-0 flex-col gap-4">
        <div className="bg-[#161616] border border-[#2A2A2A] rounded-xl p-4 shadow-lg flex-1">
          <h2 className="font-bebas text-2xl uppercase text-white mb-4 tracking-widest">Render View</h2>
          <PhoneModel3D canvasEl={fabricApi.canvasRef.current} />
        </div>
        <div className="flex gap-2">
           <button className="flex-1 py-4 bg-[#0D0D0D] text-white border border-[#2A2A2A] text-xs font-bold uppercase rounded-xl hover:border-white transition-colors">Export PNG</button>
           <button className="flex-1 py-4 bg-[#C6FF00] text-[#0A0A0A] text-xs font-bold uppercase rounded-xl hover:scale-[1.03] transition-transform shadow-[0_0_20px_rgba(198,255,0,0.15)]">Add to Cart</button>
        </div>
      </div>

      {/* MOBILE BOTTOM TABS */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#0D0D0D] border-t border-[#2A2A2A] flex justify-between p-4 z-50">
         <select 
            value={phoneModel} 
            onChange={(e) => setPhoneModel(e.target.value)}
            className="w-1/2 bg-[#161616] text-white font-sans text-xs font-bold rounded-full px-4 outline-none border border-[#2A2A2A]"
          >
            {['iPhone 15 Pro', 'iPhone 14', 'Samsung S24 Ultra'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
         <button onClick={() => setShow3DModal(true)} className="px-6 py-3 bg-[#C6FF00] text-[#0A0A0A] font-bold uppercase text-[10px] rounded-full shadow-lg hover:scale-105 transition-transform">View 3D</button>
      </div>

      {/* MOBILE 3D MODAL */}
      {show3DModal && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-[#0D0D0D]/90 backdrop-blur-xl flex flex-col p-4 pt-20">
          <button onClick={() => setShow3DModal(false)} className="absolute top-6 right-6 text-white font-bold bg-[#2A2A2A] p-2 rounded-full w-10 h-10 flex items-center justify-center uppercase hover:bg-white hover:text-black transition-colors">X</button>
          <PhoneModel3D canvasEl={fabricApi.canvasRef.current} />
          <button className="w-full py-4 mt-8 bg-[#C6FF00] text-[#0A0A0A] text-xs font-bold uppercase rounded-xl shadow-[0_0_20px_rgba(198,255,0,0.15)]">Add to Cart</button>
        </div>
      )}

    </div>
  );
}
