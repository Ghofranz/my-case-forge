"use client";

import { useCustomizerStore } from "@/store/useCustomizerStore";
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import PhoneCaseMask from "@/common/PhoneCaseMask";

export default function CartPage() {
  const { cart, removeFromCart } = useCustomizerStore();

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-[#F5F5F0] pt-24 pb-32">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-6xl font-bebas text-[#0A0A0A] uppercase tracking-wider mb-12">
          Your KaJi Cart
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-[#e5e5e0] shadow-sm">
            <ShoppingBag className="w-24 h-24 text-[#e0e0d8] mb-6" />
            <h2 className="text-3xl font-bebas text-[#0A0A0A] tracking-wider mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm text-center">
              You haven't forged any cases yet. Head back to the studio to start customizing your device.
            </p>
            <Link 
              href="/customizer"
              className="px-10 py-5 bg-[#C6FF00] text-[#0A0A0A] font-bold text-sm tracking-widest uppercase rounded-full hover:bg-[#b0e600] transition-colors shadow-lg"
            >
              Enter Customizer
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {cart.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[24px] p-6 flex flex-col sm:flex-row items-center gap-8 border border-[#e5e5e0] shadow-sm relative group"
                >
                  <div className="w-[124px] h-[254px] bg-[#fdfdfc] rounded-[16px] border border-[#f0f0f0] overflow-hidden shadow-sm shrink-0 flex items-center justify-center relative">
                    <div className="relative transform scale-[0.4]" style={{ width: 300, height: 620, transformOrigin: 'center' }}>
                      <PhoneCaseMask model={item.phoneModel}>
                        <img src={item.previewImage} alt={item.designName} className="absolute inset-0 w-full h-full object-fill" />
                      </PhoneCaseMask>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col w-full">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <span className="text-xs font-bold text-[#888] tracking-widest uppercase mb-1 block">
                           {item.phoneModel}
                         </span>
                         <h3 className="text-2xl font-bebas text-[#0A0A0A] tracking-wider">
                           {item.designName}
                         </h3>
                       </div>
                       <span className="text-xl font-bold text-[#0A0A0A]">
                         {item.price.toFixed(2)} TND
                       </span>
                    </div>

                    <div className="mt-8 flex gap-4">
                      <span className="bg-[#F5F5F0] text-[#0A0A0A] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">Qty: 1</span>
                      <span className="bg-[#C6FF00]/20 text-[#000] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-[#C6FF00]/40">Matte Finish</span>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute bottom-6 right-6 p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#0A0A0A] text-white rounded-[24px] p-8 sticky top-32 shadow-2xl">
                <h3 className="text-2xl font-bebas tracking-wide mb-8 border-b border-[#222] pb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 text-sm mb-6 pb-6 border-b border-[#222]">
                  <div className="flex justify-between text-gray-400">
                     <span>Subtotal</span>
                     <span>{subtotal.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                     <span>Shipping</span>
                     <span>{shipping.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                     <span>Taxes (8%)</span>
                     <span>{tax.toFixed(2)} TND</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-10">
                  <span className="text-sm text-gray-300 font-bold uppercase tracking-widest">Total</span>
                  <span className="text-4xl font-bebas text-[#C6FF00]">{total.toFixed(2)} TND</span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-5 bg-[#C6FF00] text-[#0A0A0A] text-center font-bold tracking-widest uppercase text-sm rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="mt-6 flex items-start gap-3 justify-center text-[#888] text-[10px] uppercase font-bold tracking-widest">
                   <ShieldCheck className="w-4 h-4 shrink-0" />
                   Secure 256-bit SSL encryption
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
