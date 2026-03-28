"use client";

import Link from "next/link";
import { Leaf, Battery, ShoppingCart } from "lucide-react";
import { useEcoStore } from "../store/ecoStore";
import { useCustomizerStore } from "../store/useCustomizerStore";
import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { ecoMode, toggleEcoMode } = useEcoStore();
  const { cart } = useCustomizerStore();
  const pathname = usePathname();
  const isDark = pathname === '/customizer';

  return (
    <nav className={`sticky top-0 z-50 w-full border-b backdrop-blur-[20px] transition-colors ${isDark ? 'border-[#222] bg-[rgba(15,15,17,0.85)]' : 'border-brand-black/10 bg-brand-white/80'}`}>
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className={`w-10 h-10 flex items-center justify-center rounded-[10px] ${isDark ? 'bg-[#C6FF00] text-black' : 'bg-black text-[#C6FF00]'} shadow-[0_4px_20px_rgba(198,255,0,0.2)]`}>
            <span className="font-bebas text-2xl tracking-tighter leading-none mt-1 pl-0.5">KJ</span>
          </div>
          {!ecoMode ? (
            <motion.div
              whileHover={{ rotate: 2, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <h1 className={`text-3xl font-bold tracking-wider font-bebas uppercase ${isDark ? 'text-white' : 'text-brand-black'} hidden sm:block pt-1`}>
                KaJi
              </h1>
            </motion.div>
          ) : (
            <h1 className={`text-3xl font-bold tracking-wider font-bebas uppercase ${isDark ? 'text-white' : 'text-brand-black'} hidden sm:block pt-1`}>
              KaJi
            </h1>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className={`hidden md:flex flex-1 items-center justify-center space-x-12 ${isDark ? 'text-gray-300' : 'text-brand-black'}`}>
          <Link href="/shop" className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#C6FF00] ${pathname === '/shop' ? 'text-[#C6FF00]' : ''}`}>
            Shop
          </Link>
          <Link href="/customizer" className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#C6FF00] ${pathname === '/customizer' ? 'text-[#C6FF00] border-b-2 border-[#C6FF00] pb-1' : ''}`}>
            Customizer
          </Link>
          <Link href="/community" className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#C6FF00] ${pathname === '/community' ? 'text-[#C6FF00]' : ''}`}>
            Community Vault
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleEcoMode}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              ecoMode
                ? "bg-[#C6FF00] text-black shadow-[0_0_15px_rgba(198,255,0,0.3)]"
                : isDark 
                  ? "bg-[#1e1e22] text-white hover:text-[#C6FF00] border border-[#333]" 
                  : "bg-brand-black/5 text-brand-black hover:bg-brand-black/10"
            }`}
          >
            {ecoMode ? <Leaf className="h-4 w-4" /> : <Battery className="h-4 w-4" />}
            <span className="hidden sm:inline">{ecoMode ? "Eco-Mode" : "Eco-Mode"}</span>
          </button>
          
          <Link href="/cart" className={`relative rounded-full p-2 transition-colors ${isDark ? 'text-white hover:bg-[#1e1e22]' : 'text-brand-black hover:bg-brand-black/5'}`}>
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#C6FF00] text-[10px] font-bold text-black border-2 border-[rgba(15,15,17,0.85)] font-sans">
              {cart.length}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
