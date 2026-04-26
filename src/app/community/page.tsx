"use client";

import { useCustomizerStore } from "@/store/useCustomizerStore";
import { ThumbsUp, Medal, Trophy, Star } from "lucide-react";
import { motion } from "framer-motion";

import dynamic from "next/dynamic";
import PhoneCaseMask from "@/common/PhoneCaseMask";

export default function CommunityPage() {
  const { communityVault, upvoteDesign } = useCustomizerStore();

  // The Top 3 designers win Vouchers
  const sortedVault = [...communityVault].sort((a, b) => b.likes - a.likes);
  const champions = sortedVault.slice(0, 3);
  const gallery = sortedVault.slice(3);

const renderCase = (item: any, rank?: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`bg-white rounded-[24px] border ${rank ? 'border-[#C6FF00] shadow-[0_10px_40px_rgba(198,255,0,0.1)]' : 'border-[#e5e5e0] shadow-sm'} p-6 flex flex-col items-center relative gap-4 overflow-hidden group hover:shadow-xl transition-all duration-300`}
    >
      {rank && (
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#C6FF00] to-[#00E5FF]" />
      )}

      {/* Rewards Ribbons */}
      {rank === 1 && (
        <div className="absolute top-4 left-4 bg-[#0A0A0A] text-[#C6FF00] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 z-10">
          <Trophy className="w-3 h-3" /> $50 Voucher Winner
        </div>
      )}
      {rank === 2 && (
        <div className="absolute top-4 left-4 bg-[#0A0A0A] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 z-10">
          <Medal className="w-3 h-3" /> $20 Voucher
        </div>
      )}
      {rank === 3 && (
        <div className="absolute top-4 left-4 bg-[#0A0A0A] text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 z-10">
          <Medal className="w-3 h-3" /> $10 Voucher
        </div>
      )}

      {/* Image Display Container - FIXED HEIGHT LOGIC */}
      <div className={`w-full h-[280px] rounded-[24px] overflow-hidden flex items-center justify-center relative mt-6 shrink-0 ${item.isPremium ? 'bg-transparent' : 'bg-[#fdfdfc] border border-[#f0f0f0] shadow-inner'}`}>
        {item.isPremium && item.previewImage ? (
           <img 
            src={item.previewImage} 
            alt="case" 
            className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" 
           />
        ) : item.previewImage ? (
           /* Standardize the mask scaling so it doesn't create empty space */
           <div className="relative flex items-center justify-center w-full h-full">
             <div 
               className="flex-shrink-0 transition-transform duration-500 group-hover:scale-[0.48]" 
               style={{ 
                 width: 300, 
                 height: 620, 
                 transform: 'scale(0.45)', // Fits perfectly in 280px height
                 transformOrigin: 'center center'
               }}
             >
               <PhoneCaseMask model={item.phoneModel}>
                 <img 
                   src={item.previewImage} 
                   alt="case" 
                   className="absolute inset-0 w-full h-full object-cover" 
                 />
               </PhoneCaseMask>
             </div>
           </div>
        ) : (
           <div className="w-[120px] h-[240px] bg-black rounded-[30px] opacity-10" />
        )}
      </div>

      {/* Content Section */}
      <div className="w-full mt-2 flex justify-between items-end">
         <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#888]">{item.phoneModel}</span>
            <span className="text-xl font-bebas text-[#0A0A0A] tracking-wider truncate block">{item.designName}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Artist</span>
              <span className="text-[10px] text-[#C6FF00] bg-black px-2 py-0.5 rounded-sm font-bold">{item.author}</span>
            </div>
         </div>
         <button 
           onClick={() => upvoteDesign(item.id)}
           className="bg-[#F5F5F0] hover:bg-[#C6FF00] border border-[#eee] hover:border-[#C6FF00] px-3 py-2 text-[#000] rounded-[12px] flex flex-col items-center justify-center transition-all group/upvote active:scale-95"
         >
           <ThumbsUp className="w-4 h-4 mb-0.5 group-hover/upvote:scale-110 transition-transform" />
           <span className="text-[12px] font-bebas tracking-wide leading-none">{item.likes}</span>
         </button>
      </div>
    </motion.div>
  );
  return (
    <div className="min-h-screen bg-[#F5F5F0] pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block bg-[#C6FF00] p-4 rounded-full mb-6">
            <Star className="w-12 h-12 text-[#0A0A0A]" />
          </motion.div>
          <h1 className="text-7xl font-bebas tracking-wider text-[#0A0A0A] mb-4">KaJi Community Vault</h1>
          <p className="text-gray-500 max-w-lg mx-auto uppercase tracking-widest text-xs font-bold leading-relaxed">
            Rate custom designs created by others. The top 3 master forgemen of the week exclusively win KaJi discount Vouchers!
          </p>
        </div>

        {/* Champions Leaderboard */}
        <div className="mb-24">
           <h2 className="text-4xl font-bebas text-[#0A0A0A] mb-8 border-b-2 border-black pb-4">Weekly Champions Leaderboard</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {champions.map((design, index) => renderCase(design, index + 1))}
           </div>
        </div>

        {/* General Gallery */}
        <div className="mb-12">
           <h2 className="text-4xl font-bebas text-[#0A0A0A] mb-8 border-b border-[#ddd] pb-4">Rising Contenders</h2>
           {gallery.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {gallery.map(design => renderCase(design))}
             </div>
           ) : (
             <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest">
               No rising contenders yet. Design a case and publish it to snatch the voucher!
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
