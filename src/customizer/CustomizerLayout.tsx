"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { useFabric } from "./useFabric";
import { ChevronDown, Smartphone, Undo2, Redo2, Trash2, Camera } from 'lucide-react';

const PhoneModel3D = dynamic(() => import("./PhoneModel3D"), { ssr: false });
const ToolsPanel = dynamic(() => import("./ToolsPanel"), { ssr: false });
const LayerManager = dynamic(() => import("./LayerManager"), { ssr: false });
const PhoneCaseSVG = dynamic(() => import("./PhoneCaseSVG"), { ssr: false });
import { DEVICE_METRICS } from "./PhoneCaseSVG";

const MODELS = ['iPhone 15 Pro', 'iPhone 14', 'Samsung S24 Ultra', 'Pixel 8 Pro', 'OnePlus 12', 'Xiaomi 14'];

export default function CustomizerLayout() {
  const [mounted, setMounted] = useState(false);
  const fabricApi = useFabric(mounted);
  const { phoneModel, setPhoneModel, canUndo, canRedo } = useCustomizerStore();
  const [modelDropdown, setModelDropdown] = useState(false);
  const [designName, setDesignName] = useState("Untitled Design");

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
      <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#F5F5F0]">
        <div className="w-16 h-16 border-4 border-[#e0e0d8] border-t-[#C6FF00] rounded-full animate-spin" />
        <div className="mt-8 font-bebas text-2xl tracking-[0.2em] text-[#0A0A0A] animate-pulse">
          INITIALIZING FORGE
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col items-center bg-[#F5F5F0] transition-colors duration-1000">
      
      {/* Soft Glow Core */}
      <div className="absolute inset-x-0 bottom-0 top-[10%] bg-[radial-gradient(ellipse_1000px_800px_at_center,_#ffffff_0%,_#F5F5F0_100%)] pointer-events-none z-0" />
      
      {/* Noise Texture Lightened */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] z-0 mix-blend-multiply"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1700px] mx-auto items-stretch justify-center pt-8 pb-[120px] px-6 z-10">

        {/* ── LEFT PANEL : Animations Added ── */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="hidden lg:flex flex-col w-[320px] flex-shrink-0 gap-4"
        >
          {/* Model selector - Light Mode */}
          <div className="relative bg-white border border-[#e5e5e0] rounded-[16px] p-2 hover:border-[#d0d0c8] transition-all shadow-sm hover:shadow-md">
            <button
              onClick={() => setModelDropdown(!modelDropdown)}
              className="w-full flex items-center justify-between p-2 outline-none group"
            >
              <div className="flex items-center gap-3 text-[#0A0A0A]">
                <div className="bg-[#f0f0ea] p-1.5 rounded-lg group-hover:bg-[#C6FF00]/20 transition-colors">
                  <Smartphone className="w-4 h-4 text-[#000]" />
                </div>
                <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#000]">
                  {phoneModel}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#888] transition-transform ${modelDropdown ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {modelDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-16 left-0 w-full bg-white border border-[#e5e5e0] rounded-[16px] shadow-xl overflow-hidden z-[100]"
                >
                  {MODELS.map((m) => (
                    <button
                      key={m}
                      onClick={() => { setPhoneModel(m); setModelDropdown(false); }}
                      className={`w-full flex items-center gap-3 p-4 text-xs font-bold uppercase transition-colors text-left ${
                        phoneModel === m
                          ? 'bg-[#F2F2F2] text-[#0A0A0A] border-l-4 border-[#C6FF00]'
                          : 'text-gray-500 hover:bg-[#F9F9F9] hover:text-[#0A0A0A] border-l-4 border-transparent'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 opacity-70" />
                      {m}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ToolsPanel fabricApi={fabricApi} />
          <LayerManager fabricApi={fabricApi} />
        </motion.div>

        {/* ── CENTER: LIVE CANVAS ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.1 }}
          className="flex-1 flex flex-col items-center justify-start bg-white border border-[#e5e5e0] rounded-[24px] relative shadow-[0_10px_40px_rgba(0,0,0,0.03)] xl:mx-8 overflow-hidden z-10"
        >
          {/* Toolbar row Light Pattern */}
          <div className="w-full p-4 flex justify-between items-center z-10 bg-white/80 backdrop-blur-md border-b border-[#f0f0f0]">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-[#f9f9f9] p-1.5 rounded-xl border border-[#eeeeee]">
                <button
                  onClick={fabricApi.undo}
                  disabled={!canUndo}
                  className="p-2 text-gray-500 hover:text-black hover:bg-white hover:shadow-sm rounded-lg disabled:opacity-30 transition-all font-bold"
                  title="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-4 bg-[#e0e0e0] mx-1" />
                <button
                  onClick={fabricApi.redo}
                  disabled={!canRedo}
                  className="p-2 text-gray-500 hover:text-black hover:bg-white hover:shadow-sm rounded-lg disabled:opacity-30 transition-all font-bold"
                  title="Redo"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center bg-[#f9f9f9] p-1.5 rounded-xl border border-[#eeeeee]">
                <button
                  onClick={() => {
                    fabricApi.fabricRef.current?.clear();
                    fabricApi.setBackgroundColor('#EFEFEF');
                  }}
                  className="p-2 text-gray-500 hover:text-[#ff3333] hover:bg-[#ff3333]/10 hover:border-[#ff3333]/20 rounded-lg transition-all"
                  title="Clear Canvas"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Synced badge */}
            <div className="flex items-center gap-2 bg-[#F9F9F9] border border-[#e5e5e0] px-3 py-1.5 rounded-full shadow-sm">
              <span className="w-[6px] h-[6px] rounded-full bg-[#C6FF00] shadow-[0_0_8px_#C6FF00] animate-pulse" />
              <span className="text-[9px] text-[#0A0A0A] font-bold tracking-[0.15em] uppercase leading-none mt-0.5">
                Synced
              </span>
            </div>
          </div>

          {/* Canvas area cozy white styling */}
          <div className="flex-1 w-full flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_#ffffff_0%,_#F8F8F8_100%)] relative">
            
            {/* Subtle glow behind phone mask */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[340px] h-[660px] bg-[#C6FF00] opacity-[0.03] blur-[60px] rounded-full mix-blend-multiply" />
            </div>

            <div
              className="relative"
              style={{
                width: 300,
                height: 620,
                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.06))',
              }}
            >
              <canvas
                ref={fabricApi.canvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  borderRadius: DEVICE_METRICS[phoneModel]?.rx ?? 42,
                  overflow: 'hidden',
                  zIndex: 10,
                }}
              />
              <PhoneCaseSVG model={phoneModel} />
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT: 3D PREVIEW ── */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          className="hidden lg:flex w-[380px] flex-shrink-0 flex-col gap-4"
        >
          <div className="bg-white border border-[#e5e5e0] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex-1 flex flex-col pt-5">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#f0f0f0]">
              <div className="bg-[#F5F5F0] p-2 rounded-lg">
                 <Camera className="w-4 h-4 text-[#000]" />
              </div>
              <h2 className="font-bebas text-lg text-[#0A0A0A] tracking-[0.12em] uppercase mt-1">
                Render View
              </h2>
            </div>

            <div className="flex-1 min-h-[480px]">
              <PhoneModel3D canvasEl={fabricApi.canvasRef.current} model={phoneModel} />
            </div>

            <div className="flex justify-between items-center bg-[#f9f9f9] mt-5 p-1.5 rounded-full border border-[#eee]">
              <button className="flex-1 text-[9px] font-bold tracking-widest text-[#000] bg-[#C6FF00] py-2.5 rounded-full uppercase shadow-sm">
                Studio
              </button>
              <button className="flex-1 text-[9px] font-bold tracking-widest text-[#888] hover:text-[#000] py-2.5 rounded-full uppercase transition-colors">
                Soft
              </button>
              <button className="flex-1 text-[9px] font-bold tracking-widest text-[#888] hover:text-[#000] py-2.5 rounded-full uppercase transition-colors">
                Warm
              </button>
            </div>

            <button className="w-full mt-3 py-3.5 bg-white hover:bg-[#F9F9F9] text-[#0A0A0A] hover:text-[#C6FF00] border border-[#eee] hover:border-[#ddd] text-[10px] tracking-[0.15em] font-bold uppercase rounded-[14px] transition-all flex justify-center items-center gap-2 shadow-sm">
              📸 Screenshot Render
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── BOTTOM BAR Floating Light Style ── */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 150 }}
        className="fixed bottom-6 left-0 w-full flex items-center justify-center z-50 pointer-events-none px-6"
      >
        <div className="w-full max-w-[1200px] bg-white/90 backdrop-blur-xl border border-[#e5e5e0] shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-[24px] mx-auto flex items-center justify-between pointer-events-auto p-4 gap-4">
          <div className="hidden lg:flex items-center gap-3 px-4 w-1/3">
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="bg-transparent border-b border-transparent hover:border-[#ddd] focus:border-[#000] transition-colors text-2xl font-bebas text-[#0A0A0A] outline-none w-full pb-1"
            />
          </div>

          <div className="lg:hidden flex items-center bg-[#f5f5f0] rounded-[16px] border border-[#eee] flex-1">
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="w-full bg-transparent px-4 py-3 text-sm font-bold text-[#000] outline-none"
            />
          </div>

          <div className="flex items-center gap-3 justify-end w-2/3 pr-2">
            <button className="hidden lg:block px-6 py-3 border border-[#eee] text-[#666] font-bold uppercase text-[10px] tracking-widest rounded-full hover:bg-[#f9f9f9] hover:text-[#000] transition-colors bg-white shadow-sm">
              💾 Save to Account
            </button>
            <button
              onClick={() => {
                const dataURL = fabricApi.fabricRef.current?.toDataURL({ format: 'png', multiplier: 2 });
                if (!dataURL) return;
                const a = document.createElement('a');
                a.href = dataURL;
                a.download = `${designName}.png`;
                a.click();
              }}
              className="hidden lg:block px-6 py-3 border border-[#eee] text-[#666] font-bold uppercase text-[10px] tracking-widest rounded-full hover:bg-[#C6FF00] hover:text-[#0A0A0A] hover:border-[#C6FF00] transition-all bg-white shadow-sm"
            >
              ⬇ Download PNG
            </button>
            <button className="px-8 py-3.5 bg-[#0A0A0A] text-[#C6FF00] font-bold uppercase text-xs rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.2)] hover:scale-[1.03] hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] transition-all tracking-widest flex items-center gap-2">
              🛒 Add to Cart · $34.99
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
