"use client";

import { useCustomizerStore } from "@/store/useCustomizerStore";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import ProductGrid from "@/shop/ProductGrid";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
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

        {/* Product Grid - Now with clickable cards linking to detail pages */}
        <ProductGrid />

      </div>
    </div>
  );
}