"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Trash2, Edit3, ShoppingCart, Plus, Download } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import Link from "next/link";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Mock saved designs - in production, this would come from user data
const mockSavedDesigns = [
  { 
    id: "d1", 
    name: "Cyber Punk Dreams", 
    preview: "/cyber_case.png", 
    createdAt: "2024-01-10",
    phoneModel: "iPhone 15 Pro",
    price: 45.00
  },
  { 
    id: "d2", 
    name: "Retro Vibes Only", 
    preview: "/retro_case.png", 
    createdAt: "2024-01-12",
    phoneModel: "Samsung S24 Ultra",
    price: 45.00
  },
  { 
    id: "d3", 
    name: "Minimalist White", 
    preview: "/minimal_case.png", 
    createdAt: "2024-01-15",
    phoneModel: "Pixel 8 Pro",
    price: 45.00
  },
];

export default function MyDesignsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { addToCart } = useCustomizerStore();
  const [savedDesigns, setSavedDesigns] = useState(mockSavedDesigns);
  const [toast, setToast] = useState<string | null>(null);

  if (!isAuthenticated || !user) {
    router.push("/login");
    return null;
  }

  const handleDelete = (id: string) => {
    setSavedDesigns(savedDesigns.filter(d => d.id !== id));
    setToast("Design deleted");
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (design: typeof mockSavedDesigns[0]) => {
    addToCart({
      id: uuidv4(),
      phoneModel: design.phoneModel,
      designName: design.name,
      previewImage: design.preview,
      price: design.price,
    });
    setToast("Design added to cart!");
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownload = (design: typeof mockSavedDesigns[0]) => {
    setToast("Downloading design preview...");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h1 className="text-5xl font-bebas text-[#0A0A0A] uppercase tracking-wider mb-2">
                My Designs
              </h1>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">
                Your custom phone case creations
              </p>
            </div>
            <Link
              href="/customizer"
              className="flex items-center gap-3 px-8 py-4 bg-[#0A0A0A] text-[#C6FF00] rounded-full font-bold uppercase text-sm tracking-wider hover:bg-[#1a1a1a] transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create New Design
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-[#e5e5e0] p-6 text-center"
          >
            <p className="text-4xl font-bebas text-[#C6FF00]">{savedDesigns.length}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-[#888] mt-2">Total Designs</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-[#e5e5e0] p-6 text-center"
          >
            <p className="text-4xl font-bebas text-[#C6FF00]">
              {savedDesigns.filter(d => new Date(d.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-[#888] mt-2">This Month</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-[#e5e5e0] p-6 text-center"
          >
            <p className="text-4xl font-bebas text-[#C6FF00]">
              {savedDesigns.length > 0 ? Math.round(savedDesigns.reduce((acc, d) => acc + 45, 0)) : 0} TND
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-[#888] mt-2">Total Value</p>
          </motion.div>
        </div>

        {/* Designs Grid */}
        {savedDesigns.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border border-[#e5e5e0] p-20 text-center"
          >
            <Heart className="w-24 h-24 text-[#e5e5e0] mx-auto mb-6" />
            <h2 className="text-3xl font-bebas text-[#0A0A0A] uppercase tracking-wider mb-4">
              No Designs Yet
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't created any custom designs yet. Head to the customizer to start designing your unique phone case!
            </p>
            <Link
              href="/customizer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#C6FF00] text-[#0A0A0A] rounded-full font-bold uppercase text-sm tracking-wider hover:bg-[#b0e600] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Start Designing
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedDesigns.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl border border-[#e5e5e0] overflow-hidden group hover:shadow-2xl transition-all duration-500"
              >
                {/* Preview */}
                <div className="aspect-[3/4] bg-[#F9F9F9] flex items-center justify-center p-8 relative overflow-hidden">
                  <img 
                    src={design.preview} 
                    alt={design.name} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDelete(design.id)}
                      className="p-3 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bebas text-[#0A0A0A] uppercase tracking-wider">
                        {design.name}
                      </h3>
                      <p className="text-sm text-[#888] mt-1">
                        {design.phoneModel} • Created {design.createdAt}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-[#0A0A0A]">
                      {design.price.toFixed(2)} TND
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      href={`/customizer?load=${design.id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0A0A0A] text-[#C6FF00] rounded-full font-bold uppercase text-xs tracking-wider hover:bg-[#1a1a1a] transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleAddToCart(design)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#C6FF00] text-[#0A0A0A] rounded-full font-bold uppercase text-xs tracking-wider hover:bg-[#b0e600] transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Order
                    </button>
                    <button
                      onClick={() => handleDownload(design)}
                      className="p-3 bg-[#F5F5F0] rounded-full hover:bg-[#e5e5e0] transition-colors"
                    >
                      <Download className="w-4 h-4 text-[#0A0A0A]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Toast */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-[#0A0A0A] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <div className="bg-[#C6FF00] rounded-full p-1">
              <Heart className="w-3 h-3 text-[#000]" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">{toast}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}