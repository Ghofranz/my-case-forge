"use client";

import { useCustomizerStore } from "@/store/useCustomizerStore";
import PhoneCaseMask from "@/common/PhoneCaseMask";
import { ShoppingCart, Star, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function ShopPage() {
  const { addToCart } = useCustomizerStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBuy = (item: any) => {
    addToCart({
      id: uuidv4(),
      phoneModel: item.phoneModel,
      designName: item.designName,
      previewImage: item.previewImage,
      price: item.price,
      isPremium: true,
    });
    triggerToast(`Added ${item.designName} to Cart!`);
  };

  const shopItems = [
    { id: 'p1', phoneModel: 'iPhone 15 Pro', designName: 'KaJi Cyber Drop', previewImage: '/cyber_case.png', price: 55.00, tag: 'Bestseller' },
    { id: 'p2', phoneModel: 'Samsung S24 Ultra', designName: 'KaJi Minimalist', previewImage: '/minimal_case.png', price: 45.00, tag: 'Premium' },
    { id: 'p3', phoneModel: 'Pixel 8 Pro', designName: 'KaJi Retro Tech', previewImage: '/retro_case.png', price: 40.00, tag: 'Trending' },
    { id: 'p4', phoneModel: 'iPhone 14', designName: 'Midnight Carbon', previewImage: '', price: 35.00, tag: 'Sale' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0] pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block bg-[#0A0A0A] p-4 rounded-[16px] mb-6 shadow-xl">
             <Zap className="w-10 h-10 text-[#C6FF00]" />
          </motion.div>
          <h1 className="text-7xl font-bebas tracking-wider text-[#0A0A0A] mb-4">KaJi Premium Drop</h1>
          <p className="text-gray-500 max-w-lg mx-auto uppercase tracking-widest text-xs font-bold leading-relaxed">
            Ready-made luxury streetwear cases. Designed by artists, forged for your hardware.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {shopItems.map((item, idx) => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="bg-white rounded-[24px] p-6 border border-[#e5e5e0] shadow-sm hover:shadow-2xl transition-all group flex flex-col items-center"
             >
               <div className="w-full flex justify-between items-center mb-6 z-10">
                 <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${item.tag === 'Bestseller' ? 'bg-[#C6FF00] text-black' : item.tag === 'Sale' ? 'bg-[#ff3355] text-white' : 'bg-[#F2F2F2] text-gray-500'}`}>
                   {item.tag}
                 </span>
                 <span className="text-sm font-bold text-[#0A0A0A]">{item.price.toFixed(2)} TND</span>
               </div>

               {/* Case Display */}
               <div className="w-full h-[370px] bg-transparent rounded-[24px] flex items-center justify-center relative mb-6 shrink-0 py-2 group-hover:drop-shadow-2xl transition-all duration-500">
                 {item.previewImage ? (
                   <img src={item.previewImage} alt="case" className="w-[85%] h-full object-contain drop-shadow-xl group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500" />
                 ) : (
                   <div className="w-[180px] h-full bg-[#111] bg-[radial-gradient(circle_at_center,_#333_0%,_#0A0A0A_100%)] flex items-center justify-center border-4 border-[#333] rounded-[30px] shadow-2xl">
                     <span className="text-[#333] font-bebas text-4xl rotate-90 opacity-20">CARBON</span>
                   </div>
                 )}
               </div>

               <div className="w-full text-center mb-6">
                 <h3 className="text-2xl font-bebas text-[#0A0A0A] tracking-wider mb-1">{item.designName}</h3>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.phoneModel}</p>
               </div>

               <button 
                 onClick={() => handleBuy(item)}
                 className="w-full py-4 bg-[#0A0A0A] text-[#C6FF00] font-bold uppercase tracking-widest text-xs rounded-full shadow-lg group-hover:bg-[#C6FF00] group-hover:text-[#0A0A0A] transition-colors flex items-center justify-center gap-2"
               >
                 <ShoppingCart className="w-4 h-4" />
                 Add to Bag
               </button>
             </motion.div>
          ))}
        </div>

      </div>

      {/* Floating Application Toast */}
      {toastMessage && (
        <motion.div
           initial={{ opacity: 0, y: -50, scale: 0.9 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-[#0A0A0A] text-white px-6 py-3 rounded-[12px] shadow-2xl flex items-center gap-3"
        >
           <div className="bg-[#C6FF00] rounded-full p-1 border-2 border-[#0A0A0A]"><ShieldCheck className="w-4 h-4 text-[#000] stroke-[3]" /></div>
           <span className="text-sm font-bold uppercase tracking-widest">{toastMessage}</span>
        </motion.div>
      )}

    </div>
  );
}
