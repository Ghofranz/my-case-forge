"use client";

import { useCustomizerStore, LayerItem } from '../store/useCustomizerStore';
import { GripVertical, Eye, EyeOff, Lock, Unlock, Trash2, Layers as LayersIcon } from 'lucide-react';
import { useState } from 'react';

export default function LayerManager({ fabricApi }: { fabricApi: any }) {
  const { layers, setLayers } = useCustomizerStore();
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const getTypeColor = (type: string) => {
    if (type.includes('text')) return 'bg-[#3b82f6]'; // Blue
    if (type.includes('image')) return 'bg-[#a855f7]'; // Purple
    if (type.includes('path') || type.includes('group')) return 'bg-[#C6FF00]'; // Lime
    return 'bg-[#f97316]'; // Orange bg
  };

  const removeLayer = (id: string, e: any) => {
    e.stopPropagation();
    if (!fabricApi.fabricRef.current) return;
    const canvas = fabricApi.fabricRef.current;
    const obj = canvas.getObjects().find((o: any) => o.id === id);
    if (obj) {
      canvas.remove(obj);
      canvas.requestRenderAll();
    }
  };

  const selectLayer = (id: string) => {
    if (!fabricApi.fabricRef.current) return;
    const canvas = fabricApi.fabricRef.current;
    const obj = canvas.getObjects().find((o: any) => o.id === id);
    if (obj) {
      canvas.setActiveObject(obj);
      canvas.requestRenderAll();
    }
  };

  const toggleVisibility = (id: string, currentVis: boolean, e: any) => {
    e.stopPropagation();
    const canvas = fabricApi.fabricRef.current;
    const obj = canvas?.getObjects().find((o: any) => o.id === id);
    if (obj) {
      obj.set('visible', !currentVis);
      canvas.requestRenderAll();
      setLayers(layers.map(l => l.id === id ? { ...l, visible: !currentVis } : l));
    }
  };

  const toggleLock = (id: string, locked: boolean, e: any) => {
    e.stopPropagation();
    const canvas = fabricApi.fabricRef.current;
    const obj = canvas?.getObjects().find((o: any) => o.id === id);
    if (obj) {
      obj.set('selectable', !locked);
      obj.set('evented', !locked);
      canvas.requestRenderAll();
      setLayers(layers.map(l => l.id === id ? { ...l, locked: !locked } : l));
    }
  };

  const updateOpacity = (id: string, opacity: number) => {
    const canvas = fabricApi.fabricRef.current;
    const obj = canvas?.getObjects().find((o: any) => o.id === id);
    if (obj) {
      obj.set('opacity', opacity);
      canvas.requestRenderAll();
      setLayers(layers.map(l => l.id === id ? { ...l, opacity } : l));
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const canvas = fabricApi.fabricRef.current;
    if (!canvas) return;

    const objects = canvas.getObjects();
    const draggedObj = objects.find((o: any) => o.id === draggedId);
    const targetObj = objects.find((o: any) => o.id === targetId);
    
    if (draggedObj && targetObj) {
       const realTargetIndex = objects.indexOf(targetObj);
       draggedObj.moveTo(realTargetIndex);
       canvas.requestRenderAll();
       
       const draggedIndex = layers.findIndex(l => l.id === draggedId);
       const targetIndex = layers.findIndex(l => l.id === targetId);
       const newLayers = [...layers];
       const [removed] = newLayers.splice(draggedIndex, 1);
       newLayers.splice(targetIndex, 0, removed);
       setLayers(newLayers);
    }
    setDraggedId(null);
  };

  return (
    <div className="flex flex-col h-[280px] bg-[#161618] border border-[#2a2a2e] rounded-xl overflow-hidden shadow-2xl mt-4">
      <div className="p-3 bg-[#1a1a1e] border-b border-[#2a2a2e] flex items-center gap-2">
        <LayersIcon className="w-4 h-4 text-gray-400" />
        <h3 className="font-sans text-[10px] font-bold tracking-[0.1em] text-[#555] uppercase">Layers</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
        {layers.map(layer => {
          const isVis = layer.visible ?? true;
          return (
          <div 
            key={layer.id} 
            draggable
            onDragStart={(e) => handleDragStart(e, layer.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, layer.id)}
            onClick={() => selectLayer(layer.id)}
            className={`group relative flex items-center justify-between p-2 lg:p-3 bg-[#1e1e22] hover:bg-[#25252a] border border-transparent hover:border-[#444] cursor-pointer rounded-lg transition-colors ${draggedId === layer.id ? 'opacity-50' : ''}`}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getTypeColor(layer.type)}`} />
            
            <div className="flex items-center gap-2 pl-2 overflow-hidden flex-1">
              <GripVertical className="w-3 h-3 text-[#444] group-hover:text-gray-300 cursor-grab active:cursor-grabbing flex-shrink-0" />
              <input 
                value={layer.name} 
                onChange={(e) => {
                  const newName = e.target.value;
                  const canvas = fabricApi.fabricRef.current;
                  const obj = canvas?.getObjects().find((o: any) => o.id === layer.id);
                  if (obj) { (obj as any).name = newName; }
                  setLayers(layers.map(l => l.id === layer.id ? { ...l, name: newName } : l));
                }}
                className="truncate w-full font-sans text-xs text-gray-300 font-medium bg-transparent outline-none border-b border-transparent focus:border-[#C6FF00]" 
              />
            </div>
            
            <div className="flex items-center gap-[6px] pl-2 flex-shrink-0">
              <input 
                 type="range" min="0" max="1" step="0.1" 
                 value={layer.opacity ?? 1}
                 onChange={(e) => updateOpacity(layer.id, parseFloat(e.target.value))}
                 className="w-10 h-1 bg-[#13131a] rounded-full appearance-none outline-none opacity-0 group-hover:opacity-100 transition-opacity [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-[#C6FF00] [&::-webkit-slider-thumb]:rounded-full cursor-ew-resize hidden lg:block"
                 title="Opacity"
              />
              <span className="text-[9px] text-[#888] w-6 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block text-right">{Math.round((layer.opacity ?? 1)*100)}%</span>
              
              <button onClick={(e) => toggleLock(layer.id, layer.locked ?? false, e)} className={`${layer.locked ? 'text-[#ff3333]' : 'text-[#555] hover:text-white'} transition-colors ml-1`}>
                {layer.locked ? <Lock className="w-[14px] h-[14px]" /> : <Unlock className="w-[14px] h-[14px]" />}
              </button>
              
              <button onClick={(e) => toggleVisibility(layer.id, isVis, e)} className={`${!isVis ? 'text-[#555]' : 'text-[#888] hover:text-white'} transition-colors`}>
                {!isVis ? <EyeOff className="w-[14px] h-[14px]" /> : <Eye className="w-[14px] h-[14px]" />}
              </button>
              
              <button onClick={(e) => removeLayer(layer.id, e)} className="text-[#444] hover:text-[#FF3366] transition-colors">
                <Trash2 className="w-[14px] h-[14px]" />
              </button>
            </div>
          </div>
        )})}
        {layers.length === 0 && (
          <div className="text-center text-[#555] text-xs mt-6 font-medium">No objects on canvas</div>
        )}
      </div>
    </div>
  );
}
