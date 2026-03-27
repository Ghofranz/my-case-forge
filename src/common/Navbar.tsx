"use client";

import Link from "next/link";
import { Leaf, Battery, ShoppingCart } from "lucide-react";
import { useEcoStore } from "../store/ecoStore";
import { motion } from "framer-motion";

export default function Navbar() {
  const { ecoMode, toggleEcoMode } = useEcoStore();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-brand-black/10 bg-brand-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          {!ecoMode ? (
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <h1 className="text-3xl font-bold tracking-wider text-brand-black font-bebas uppercase">
                CaseForge
              </h1>
            </motion.div>
          ) : (
            <h1 className="text-3xl font-bold tracking-wider text-brand-black font-bebas uppercase">
              CaseForge
            </h1>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-center space-x-8">
          <Link href="/shop" className="text-sm font-medium hover:text-brand-lime transition-colors">
            Shop
          </Link>
          <Link href="/customizer" className="text-sm font-medium hover:text-brand-lime transition-colors">
            Customizer
          </Link>
          <Link href="/community" className="text-sm font-medium hover:text-brand-lime transition-colors">
            Community Vault
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleEcoMode}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              ecoMode
                ? "bg-brand-lime text-brand-black shadow-sm"
                : "bg-brand-black/5 text-brand-black hover:bg-brand-black/10"
            }`}
            title={ecoMode ? "Eco-Stream Mode On" : "Enable Eco-Stream Mode"}
          >
            {ecoMode ? <Leaf className="h-4 w-4" /> : <Battery className="h-4 w-4" />}
            <span className="hidden sm:inline">{ecoMode ? "Eco-Mode On" : "Eco-Mode"}</span>
          </button>
          
          <button className="relative rounded-full p-2 text-brand-black hover:bg-brand-black/5 transition-colors">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-brand-lime text-[10px] font-bold text-brand-black">
              0
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
