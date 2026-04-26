"use client";

import { useState } from "react";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { Zap, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import ProductGrid from "@/shop/ProductGrid";

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F0] pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="inline-block bg-[#0A0A0A] p-4 rounded-[16px] mb-6 shadow-xl"
          >
            <Zap className="w-10 h-10 text-[#C6FF00]" />
          </motion.div>
          <h1 className="text-7xl font-bebas tracking-wider text-[#0A0A0A] mb-4">KaJi Premium Drop</h1>
          <p className="text-gray-500 max-w-lg mx-auto uppercase tracking-widest text-xs font-bold leading-relaxed">
            Ready-made luxury streetwear cases. Designed by artists, forged for your hardware.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search by name, phone model, or style..."
              className="w-full pl-16 pr-16 py-5 bg-white border-2 border-[#e5e5e0] rounded-full text-lg font-bold text-[#0A0A0A] outline-none focus:border-[#C6FF00] focus:ring-4 focus:ring-[#C6FF00]/10 transition-all shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-[#F5F5F0] rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#888]">Popular:</span>
            {["Cyber", "Retro", "Minimal", "iPhone 15 Pro", "Samsung S24"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-4 py-1.5 bg-white border border-[#e5e5e0] rounded-full text-xs font-bold uppercase tracking-wider text-[#555] hover:border-[#C6FF00] hover:text-[#C6FF00] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid searchQuery={searchQuery} />

      </div>
    </div>
  );
}
