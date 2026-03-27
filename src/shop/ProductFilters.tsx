"use client";

import { SUPPORTED_MODELS } from "./mockData";

export default function ProductFilters({
  activeFilter,
  setActiveFilter,
}: {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}) {
  return (
    <div className="flex w-full overflow-x-auto gap-3 py-4 mb-6 border-b border-brand-black/10" style={{ scrollbarWidth: 'none' }}>
      {SUPPORTED_MODELS.map((model) => (
        <button
          key={model}
          onClick={() => setActiveFilter(model)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === model
              ? "bg-brand-black text-brand-white"
              : "bg-brand-black/5 text-brand-black hover:bg-brand-black/10"
          }`}
        >
          {model}
        </button>
      ))}
    </div>
  );
}
