"use client";

import { useCustomizerStore } from '../store/useCustomizerStore';

export default function LayerManager({ fabricApi }: { fabricApi: any }) {
  const { layers } = useCustomizerStore();

  const removeLayer = (id: string) => {
    // Basic fabric array scan
    if (!fabricApi.fabricRef.current) return;
    const canvas = fabricApi.fabricRef.current;
    const obj = canvas.getObjects().find((o: any) => o.id === id);
    if (obj) {
      canvas.remove(obj);
      canvas.requestRenderAll();
    }
  };

  return (
    <div className="flex flex-col h-64 bg-[#161616] border border-[#2A2A2A] rounded-xl overflow-hidden mt-6">
      <div className="p-3 bg-[#0D0D0D] border-b border-[#2A2A2A]">
        <h3 className="font-sans text-xs font-bold text-gray-400 uppercase">Layer Manager</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
        {layers.map(layer => (
          <div key={layer.id} className="flex items-center justify-between p-2 bg-[#0D0D0D] rounded border border-[#2A2A2A] text-white">
            <span className="truncate w-32 font-sans text-xs">{layer.name}</span>
            <div className="flex gap-3 text-gray-400">
              <button className="hover:text-red-500 text-xs font-bold" onClick={() => removeLayer(layer.id)}>DEL</button>
            </div>
          </div>
        ))}
        {layers.length === 0 && (
          <div className="text-center text-gray-500 text-xs mt-4">No elements</div>
        )}
      </div>
    </div>
  );
}
