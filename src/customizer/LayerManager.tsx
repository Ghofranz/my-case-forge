"use client";

import { useCustomizerStore } from '../store/useCustomizerStore';
import { Trash2, GripVertical, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function LayerManager({ fabricApi }: { fabricApi: any }) {
  const { layers } = useCustomizerStore();

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('layer-id', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('layer-id');
    if (!draggedId || draggedId === targetId || !fabricApi.fabricRef.current) return;

    const canvas = fabricApi.fabricRef.current;
    const objects = canvas.getObjects();
    const draggedObj = objects.find((o: any) => o.id === draggedId);
    const targetObj = objects.find((o: any) => o.id === targetId);

    if (draggedObj && targetObj) {
      const draggedZ = objects.indexOf(draggedObj);
      const targetZ = objects.indexOf(targetObj);
      draggedObj.moveTo(targetZ);
      canvas.requestRenderAll();
    }
  };

  const toggleVisibility = (id: string) => {
    const canvas = fabricApi.fabricRef.current;
    if (!canvas) return;
    const obj = canvas.getObjects().find((o: any) => o.id === id);
    if (obj) {
      obj.set('visible', !obj.visible);
      canvas.requestRenderAll();
    }
  };

  const toggleLock = (id: string) => {
    const canvas = fabricApi.fabricRef.current;
    if (!canvas) return;
    const obj = canvas.getObjects().find((o: any) => o.id === id);
    if (obj) {
      const locked = obj.selectable;
      obj.set({
        selectable: !locked,
        evented: !locked,
      });
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  };

  const deleteLayer = (id: string) => {
    const canvas = fabricApi.fabricRef.current;
    if (!canvas) return;
    const obj = canvas.getObjects().find((o: any) => o.id === id);
    if (obj) {
      canvas.remove(obj);
      canvas.requestRenderAll();
    }
  };

  return (
    <div className="flex flex-col bg-white border border-[#e5e5e0] rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden mt-2">
      <div className="bg-[#F9F9F9] p-4 flex items-center justify-between border-b border-[#f0f0f0] rounded-t-[24px]">
        <h3 className="font-bebas text-lg text-[#0A0A0A] tracking-wider uppercase">Layers</h3>
        <span className="text-[10px] font-bold text-[#888] uppercase bg-white px-3 py-1 border border-[#eee] rounded-full shadow-sm">
          {layers.length} Objects
        </span>
      </div>

      <div className="p-3 max-h-[300px] overflow-y-auto flex flex-col gap-2 bg-[#FCFCFC]">
        <AnimatePresence>
          {layers.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-[#999] text-xs py-8 font-bold"
            >
              No objects on canvas
            </motion.p>
          ) : (
            layers.map((layer) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                draggable
                onDragStart={(e: any) => handleDragStart(e, layer.id)}
                onDragOver={handleDragOver}
                onDrop={(e: any) => handleDrop(e, layer.id)}
                className="flex items-center gap-3 w-full bg-white p-3 rounded-[12px] border border-[#eee] hover:border-[#ddd] hover:shadow-md transition-all group cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="w-4 h-4 text-[#CCC] group-hover:text-[#888] flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#0A0A0A] font-bold truncate">{layer.name}</p>
                  <p className="text-[9px] text-[#888] font-bold uppercase">{layer.type}</p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleVisibility(layer.id)} className="p-1.5 hover:bg-[#F2F2F2] rounded-lg text-[#888] hover:text-[#0A0A0A] transition-colors">
                    {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => toggleLock(layer.id)} className="p-1.5 hover:bg-[#F2F2F2] rounded-lg text-[#888] hover:text-[#0A0A0A] transition-colors">
                    {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                  <button onClick={() => deleteLayer(layer.id)} className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg text-[#888] transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
