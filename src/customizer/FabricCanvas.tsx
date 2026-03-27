"use client";

import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

export default function FabricCanvas({
  onTextureUpdate,
}: {
  onTextureUpdate: (dataUrl: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [color, setColor] = useState("#C6FF00");

  useEffect(() => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 300,
      height: 600,
      backgroundColor: color,
    });
    fabricRef.current = canvas;

    const processChange = () => {
      onTextureUpdate(canvas.toDataURL({ format: "png", multiplier: 1 }));
    };

    canvas.on("object:modified", processChange);
    canvas.on("object:added", processChange);
    canvas.on("after:render", processChange);
    
    // Initial sync slightly delayed to guarantee canvas render readiness
    setTimeout(processChange, 100);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.backgroundColor = color;
      fabricRef.current.requestRenderAll();
    }
  }, [color]);

  const addText = () => {
    if (!fabricRef.current) return;
    const text = new fabric.IText("CASEFORGE", {
      left: 50,
      top: 100,
      fontFamily: "Arial", // Defaulting to system sans as fallback
      fontSize: 40,
      fill: "#0A0A0A",
      fontWeight: "bold",
    });
    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-brand-white rounded-2xl border border-brand-black/10">
      <div className="flex w-full justify-between items-center">
        <h2 className="font-bebas text-3xl uppercase text-brand-black">2D Canvas</h2>
        
        <div className="flex gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded-full border-2 border-brand-black p-0 overflow-hidden"
            title="Base Color Picker"
          />
          <button
            onClick={addText}
            className="bg-brand-black text-brand-lime px-4 py-2 rounded-full font-bold uppercase text-xs hover:bg-brand-black/80 transition-colors"
          >
            + Add Text
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] border-8 border-brand-black shadow-2xl">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
