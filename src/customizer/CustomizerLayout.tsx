"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { useFabric } from "./useFabric";
import { ChevronDown, Smartphone, Undo2, Redo2, Trash2, Check, ShoppingCart } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ToolsPanel = dynamic(() => import("./ToolsPanel"), { ssr: false });
const LayerManager = dynamic(() => import("./LayerManager"), { ssr: false });
const PhoneCaseSVG = dynamic(() => import("./PhoneCaseSVG"), { ssr: false });
import { DEVICE_METRICS } from "./PhoneCaseSVG";

const MODELS = ['iPhone 15 Pro', 'iPhone 14', 'Samsung S24 Ultra', 'Pixel 8 Pro', 'OnePlus 12', 'Xiaomi 14'];

export default function CustomizerLayout() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const fabricApi = useFabric(mounted);
  const { phoneModel, setPhoneModel, canUndo, canRedo, addToCart, cart } = useCustomizerStore();
  
  const [modelDropdown, setModelDropdown] = useState(false);
  const [designName, setDesignName] = useState("Untitled Design");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('findDOMNode')) return;
      originalWarn(...args);
    };
    return () => { console.warn = originalWarn; };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const proceedToCart = () => {
    // 1. Snapshot the 2D layout perfectly rendering the mask 
    // Best way: Fabric native export with multiplier for high res
    const dataURL = fabricApi.fabricRef.current?.toDataURL({ format: 'png', multiplier: 2 });
    if (!dataURL) {
       triggerToast("Failed to render. Please try again.");
       return;
    }

    addToCart({
      id: uuidv4(),
      phoneModel,
      designName: designName || "Untitled Forge",
      previewImage: dataURL,
      price: 34.99,
    });

    triggerToast("Design Sent to Cart!");
    setTimeout(() => {
      router.push('/cart');
    }, 1000);
  };

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

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1400px] mx-auto items-stretch justify-center pt-8 pb-[180px] px-6 z-10">

        {/* ── LEFT PANEL (Tools & Layers) ── */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="hidden lg:flex flex-col w-[340px] flex-shrink-0 gap-5"
        >
          {/* Model selector */}
          <div className="relative bg-white border border-[#e5e5e0] rounded-[16px] p-2 transition-all shadow-sm">
            <button
              onClick={() => setModelDropdown(!modelDropdown)}
              className="w-full flex items-center justify-between p-3 outline-none group"
            >
              <div className="flex items-center gap-3 text-[#0A0A0A]">
                <div className="bg-[#f0f0ea] p-2 rounded-lg group-hover:bg-[#C6FF00]/20 transition-colors">
                  <Smartphone className="w-5 h-5 text-[#000]" />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[9px] font-bold text-[#888] uppercase tracking-widest leading-none">Target Device</span>
                  <span className="font-sans font-bold text-sm uppercase tracking-wider text-[#000] leading-none">
                    {phoneModel}
                  </span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-[#888] transition-transform ${modelDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {modelDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-[80px] left-0 w-full bg-white border border-[#e5e5e0] rounded-[16px] shadow-2xl overflow-hidden z-[100]"
                >
                  {MODELS.map((m) => (
                    <button
                      key={m}
                      onClick={() => { setPhoneModel(m); setModelDropdown(false); triggerToast(`Canvas scaled to ${m}`); }}
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

        {/* ── CENTER: MASSIVE LIVE CANVAS (3D Engine Removed) ── */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.1 }}
          className="flex-1 flex flex-col items-center justify-start bg-white border border-[#e5e5e0] rounded-[32px] relative shadow-[0_20px_60px_rgba(0,0,0,0.04)] overflow-hidden z-10"
        >
          {/* Toolbar row */}
          <div className="w-full p-5 flex justify-between items-center z-10 bg-white/90 backdrop-blur-xl border-b border-[#f0f0f0]">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-[#f9f9f9] p-1.5 rounded-xl border border-[#eeeeee]">
                <button
                  onClick={() => fabricApi.undo()}
                  disabled={!canUndo}
                  className="p-2.5 text-gray-500 hover:text-black hover:bg-white hover:shadow-sm rounded-lg disabled:opacity-30 transition-all font-bold"
                  title="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-5 bg-[#e0e0e0] mx-1" />
                <button
                  onClick={() => fabricApi.redo()}
                  disabled={!canRedo}
                  className="p-2.5 text-gray-500 hover:text-black hover:bg-white hover:shadow-sm rounded-lg disabled:opacity-30 transition-all font-bold"
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
                    triggerToast("Workspace Erased");
                  }}
                  className="p-2.5 text-gray-500 hover:text-[#ff3333] hover:bg-[#ff3333]/10 hover:border-[#ff3333]/20 rounded-lg transition-all"
                  title="Clear Canvas"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Viewport label */}
            <div className="flex items-center gap-2 bg-[#F9F9F9] border border-[#e5e5e0] px-4 py-2 rounded-full shadow-sm">
              <span className="w-[8px] h-[8px] rounded-full bg-[#C6FF00] shadow-[0_0_12px_#C6FF00] animate-pulse" />
              <span className="text-[10px] text-[#0A0A0A] font-bold tracking-[0.2em] uppercase leading-none mt-0.5">
                Studio View
              </span>
            </div>
          </div>

          {/* Centered expanded 2D area */}
          <div className="flex-1 w-full flex items-center justify-center p-12 bg-[#FDFDFD] relative">
            
            {/* Ambient shadow behind the phone for extreme pop */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[360px] h-[680px] bg-[#0A0A0A] opacity-[0.03] blur-[40px] rounded-[60px]" />
            </div>

            <div
              className="relative transition-transform duration-500 hover:scale-[1.02]"
              style={{
                width: 300,
                height: 620,
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
      </div>

      {/* ── BOTTOM BAR Elevated Action Space ── */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 150 }}
        className="fixed bottom-12 left-0 w-full flex items-center justify-center z-50 pointer-events-none px-6"
      >
        <div className="w-full max-w-[1000px] bg-white/90 backdrop-blur-xl border border-[#e5e5e0] shadow-[0_40px_80px_rgba(0,0,0,0.1)] rounded-[24px] mx-auto flex items-center justify-between pointer-events-auto p-4 gap-4">
          <div className="flex items-center gap-3 px-6 w-1/2">
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="bg-transparent border-b-2 border-transparent hover:border-[#eee] focus:border-[#C6FF00] transition-colors text-3xl font-bebas text-[#0A0A0A] outline-none w-full pb-1"
              placeholder="Name your case..."
            />
          </div>

          <div className="flex items-center gap-4 justify-end w-1/2 pr-2">
            <button
              onClick={() => {
                const dataURL = fabricApi.fabricRef.current?.toDataURL({ format: 'png', multiplier: 2 });
                if (!dataURL) return;
                const a = document.createElement('a');
                a.href = dataURL;
                a.download = `${designName.replace(/\s+/g, '-').toLowerCase()}-flat.png`;
                a.click();
              }}
              className="px-6 py-4 border border-[#eee] text-[#0A0A0A] font-bold uppercase text-[11px] tracking-widest rounded-full hover:bg-[#F9F9F9] transition-colors bg-white shadow-sm flex items-center gap-2"
            >
              Download PNG
            </button>
            <button 
              onClick={proceedToCart}
              className="px-10 py-4 bg-[#0A0A0A] text-[#C6FF00] font-bold uppercase text-[13px] rounded-full shadow-[0_5px_20px_rgba(0,0,0,0.2)] hover:scale-[1.03] hover:shadow-[0_10px_35px_rgba(198,255,0,0.3)] transition-all tracking-widest flex items-center gap-3"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart · $34.99
            </button>
          </div>
        </div>
      </motion.div>

      {/* Floating Application Toast Event System */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] bg-[#0A0A0A] text-white px-6 py-3 rounded-[12px] shadow-2xl flex items-center gap-3"
          >
            <div className="bg-[#C6FF00] rounded-full p-1 border-2 border-[#0A0A0A]">
              <Check className="w-4 h-4 text-[#000] stroke-[3]" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
