"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Globe, Lock, ShieldCheck, CreditCard, ChevronRight } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, publishToVault } = useCustomizerStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal * 1.08 + (subtotal > 0 ? 5.99 : 0);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowPublishModal(true);
    }, 1500);
  };

  const handleCommunityChoice = (isPublic: boolean) => {
    // If public, we iterate through the cart and publish each case to the Community Vault
    if (isPublic) {
      cart.forEach((item) => {
        publishToVault({
          id: `community-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          phoneModel: item.phoneModel,
          designName: item.designName,
          previewImage: item.previewImage,
          likes: 0,
          author: 'Anonymous Creator',
          isPublic: true,
        });
      });
    }

    // Finalize
    clearCart();
    router.push(isPublic ? '/community' : '/');
  };

  if (cart.length === 0 && !showPublishModal) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bebas tracking-wide mb-4">No items to checkout</h2>
        <button onClick={() => router.push('/customizer')} className="font-bold underline">Return to Builder</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
        
        {/* Left: Fake Form */}
        <div>
          <h1 className="text-4xl font-bebas text-[#0A0A0A] uppercase tracking-wider mb-8">
            Express Checkout
          </h1>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[24px] border border-[#e5e5e0] shadow-sm">
              <h3 className="font-bold uppercase text-xs tracking-widest text-gray-500 mb-4">Contact Info</h3>
              <input type="email" placeholder="Email Address" className="w-full bg-[#f9f9f9] border border-[#eee] p-4 rounded-xl outline-none focus:border-[#C6FF00] transition-colors mb-4" defaultValue="designer@hype.com" />
            </div>

            <div className="bg-white p-6 rounded-[24px] border border-[#e5e5e0] shadow-sm">
              <h3 className="font-bold uppercase text-xs tracking-widest text-gray-500 mb-4">Shipping Address</h3>
              <div className="grid grid-cols-2 gap-4">
                 <input type="text" placeholder="First Name" className="bg-[#f9f9f9] border border-[#eee] p-4 rounded-xl outline-none focus:border-black" defaultValue="Neo" />
                 <input type="text" placeholder="Last Name" className="bg-[#f9f9f9] border border-[#eee] p-4 rounded-xl outline-none focus:border-black" defaultValue="Tokyo" />
                 <input type="text" placeholder="Address" className="col-span-2 bg-[#f9f9f9] border border-[#eee] p-4 rounded-xl outline-none focus:border-black" defaultValue="123 Cyber Ave" />
              </div>
            </div>

            <div className="bg-[#0A0A0A] p-6 rounded-[24px] text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                 <CreditCard className="w-24 h-24" />
               </div>
               <h3 className="font-bold uppercase text-xs tracking-widest text-[#C6FF00] mb-4 relative z-10">Payment</h3>
               <input type="text" placeholder="Card Number" className="w-full bg-[#111] border border-[#333] p-4 rounded-xl outline-none focus:border-[#C6FF00] text-white mb-4 relative z-10 font-mono tracking-widest" defaultValue="**** **** **** 4242" />
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:pl-12">
          <div className="sticky top-24 pt-4">
             <h3 className="text-2xl font-bebas mb-6 tracking-wider">Order Items ({cart.length})</h3>
             
             <div className="space-y-4 mb-8">
               {cart.map(item => (
                 <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-[16px] border border-[#e5e5e0]">
                   <img src={item.previewImage} alt="case" className="w-12 h-20 object-contain bg-[#f0f0ea] rounded-md" />
                   <div>
                     <p className="font-bebas text-lg tracking-wider">{item.designName}</p>
                     <p className="text-xs text-gray-500 font-bold tracking-widest">{item.phoneModel}</p>
                   </div>
                   <div className="ml-auto font-bold">${item.price.toFixed(2)}</div>
                 </div>
               ))}
             </div>

             <div className="flex justify-between items-center mb-8 border-t border-[#dcdcc9] pt-6">
                <span className="text-xl font-bold uppercase tracking-widest text-gray-500">Total</span>
                <span className="text-4xl font-bebas text-[#0A0A0A]">${total.toFixed(2)}</span>
             </div>

             <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full py-5 bg-[#C6FF00] text-[#0A0A0A] text-center font-bold tracking-widest uppercase text-sm rounded-full shadow-lg hover:bg-black hover:text-[#C6FF00] transition-colors disabled:opacity-50 flex items-center justify-center"
             >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Place Order & Forge"
                )}
             </button>
             <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">Mock Checkout Process</p>
          </div>
        </div>
      </div>

      {/* ── Community Post-Purchase Modal ── */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-white/80 backdrop-blur-xl">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 50 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               className="bg-[#0A0A0A] rounded-[32px] p-10 max-w-xl w-full text-center shadow-2xl relative overflow-hidden"
             >
               <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C6FF00] via-[#00E5FF] to-[#FF0055]" />
               
               <CheckCircle className="w-20 h-20 text-[#C6FF00] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(198,255,0,0.5)]" />
               <h2 className="text-5xl font-bebas text-white tracking-wider mb-2">Order Confirmed!</h2>
               <p className="text-gray-400 text-sm mb-10 max-w-sm mx-auto">
                 Your masterpieces are entering the physical forge. 
                 <br/><br/>
                 <strong className="text-white text-base">Earn $50 Vouchers!</strong><br/>
                 Do you want to publish your designs to the <span className="text-[#C6FF00]">Community Vault</span> and compete to be the most liked cage of the week?
               </p>

               <div className="grid sm:grid-cols-2 gap-4">
                 <button 
                   onClick={() => handleCommunityChoice(false)}
                   className="p-6 rounded-[20px] bg-[#1a1a1a] hover:bg-[#222] border border-[#333] transition-colors flex flex-col items-center justify-center gap-3 text-white group"
                 >
                   <Lock className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                   <span className="font-bold text-xs tracking-widest uppercase">Keep Private</span>
                 </button>
                 
                 <button 
                   onClick={() => handleCommunityChoice(true)}
                   className="p-6 rounded-[20px] bg-[#C6FF00] hover:bg-white transition-colors flex flex-col items-center justify-center gap-3 text-[#0A0A0A] shadow-[0_0_30px_rgba(198,255,0,0.15)] group"
                 >
                   <Globe className="w-6 h-6" />
                   <span className="font-bold text-xs tracking-widest uppercase text-center">
                     Publish to Vault &<br/>Win Vouchers!
                   </span>
                 </button>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
