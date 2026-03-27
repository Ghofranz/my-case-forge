"use client";

import { useState, useMemo } from "react";
import ProductFilters from "./ProductFilters";
import ProductCard from "./ProductCard";
import { MOCK_CASES } from "./mockData";

export default function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredCases = useMemo(() => {
    if (activeFilter === "All") return MOCK_CASES;
    return MOCK_CASES.filter((c) => c.supportedModels.includes(activeFilter));
  }, [activeFilter]);

  return (
    <div className="w-full">
      <ProductFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCases.map((product, index) => (
          <ProductCard key={`${product.id}-${index}`} product={product} />
        ))}
      </div>
      
      {filteredCases.length === 0 && (
        <div className="py-20 text-center text-brand-black/60 font-sans">
          No cases found for {activeFilter}.
        </div>
      )}
    </div>
  );
}
