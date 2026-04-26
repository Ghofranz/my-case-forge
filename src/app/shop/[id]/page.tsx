"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Truck, 
  Shield, 
  Star, 
  ShoppingCart, 
  ArrowLeft, 
  Check,
  Heart,
  Share2,
  Package
} from "lucide-react";
import Link from "next/link";
import { MOCK_CASES } from "@/shop/mockData";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { v4 as uuidv4 } from "uuid";
import PhoneCaseMask from "@/common/PhoneCaseMask";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCustomizerStore();
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const product = MOCK_CASES.find(p => p.id === params.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bebas text-[#0A0A0A] mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-[#C6FF00] hover:underline">
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
  const selectedPrice = product.price;
  const totalPrice = selectedPrice * quantity;

  const handleAddToCart = () => {
    const model = selectedModel || product.supportedModels[0];
    addToCart({
      id: uuidv4(),
      phoneModel: model,
      designName: product.name,
      previewImage: product.image,
      price: totalPrice,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => router.push('/cart'), 500);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-[#C6FF00] fill-[#C6FF00]' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb & Back */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#888] hover:text-[#C6FF00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Product Image */}
       {/* Left: Product Image */}
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
  className="relative"
>
  <div className="sticky top-32">
    {/* Main Image Container - UPDATED FOR BETTER DISPLAY */}
    <div className="bg-white rounded-[32px] border border-[#e5e5e0] shadow-[0_20px_60px_rgba(0,0,0,0.04)] relative overflow-hidden aspect-[4/5] flex items-center justify-center p-4">
      
      {/* Floating Buttons */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`p-3 rounded-full shadow-sm transition-all ${
            isLiked 
              ? 'bg-[#C6FF00] text-[#0A0A0A]' 
              : 'bg-white text-[#888] hover:bg-[#F5F5F0]'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#0A0A0A]' : ''}`} />
        </button>
        <button className="p-3 bg-white text-[#888] hover:bg-[#F5F5F0] rounded-full shadow-sm transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* The Phone Display - FIXED SCALING */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div 
          className="relative transition-transform duration-700 hover:scale-105" 
          style={{ 
            width: 300, 
            height: 620, 
            transform: 'scale(0.85)', // Increased scale for product page
            transformOrigin: 'center center' 
          }}
        >
          <PhoneCaseMask model={selectedModel || product.supportedModels[0]}>
            <img 
              src={product.image} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover drop-shadow-2xl" 
            />
          </PhoneCaseMask>
        </div>
      </div>
    </div>

    {/* Trust Badges - Improved Layout */}
    <div className="grid grid-cols-3 gap-4 mt-6">
      {[
        { icon: Shield, label: "Secure Payment" },
        { icon: Truck, label: "Fast Delivery" },
        { icon: Package, label: "Premium Quality" }
      ].map((badge, i) => (
        <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-[#e5e5e0] flex flex-col items-center gap-2 text-center group hover:bg-white transition-colors">
          <badge.icon className="w-6 h-6 text-[#C6FF00] group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-tighter text-[#888] group-hover:text-black">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  </div>
</motion.div>
          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-sm font-bold text-[#888]">
                  {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>
              <h1 className="text-5xl font-bebas text-[#0A0A0A] uppercase tracking-wider mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-[#0A0A0A]">
                {selectedPrice.toFixed(2)} TND
              </p>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-[#e5e5e0]">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#888] mb-3">Description</h3>
              <p className="text-[#0A0A0A] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Model Selection */}
            <div className="bg-white rounded-2xl p-6 border border-[#e5e5e0]">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#888] mb-4">Select Your Device</h3>
              <div className="flex flex-wrap gap-3">
                {product.supportedModels.map((model) => (
                  <button
                    key={model}
                    onClick={() => setSelectedModel(model)}
                    className={`px-5 py-3 rounded-xl border-2 font-bold uppercase text-xs tracking-wider transition-all ${
                      selectedModel === model
                        ? 'border-[#C6FF00] bg-[#C6FF00]/10 text-[#0A0A0A]'
                        : 'border-[#e5e5e0] text-[#888] hover:border-[#C6FF00]/50'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock & Delivery */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-[#e5e5e0]">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-[#C6FF00]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#888]">Stock</span>
                </div>
                <span className={`text-lg font-bold ${product.stock > 10 ? 'text-[#00AA00]' : product.stock > 0 ? 'text-[#FFAA00]' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#e5e5e0]">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-[#C6FF00]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#888]">Delivery</span>
                </div>
                <span className="text-lg font-bold text-[#0A0A0A]">
                  {product.deliveryDays} business days
                </span>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="bg-white rounded-2xl p-6 border border-[#e5e5e0]">
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold uppercase tracking-wider text-[#888]">Quantity:</span>
                  <div className="flex items-center border-2 border-[#e5e5e0] rounded-xl">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-xl font-bold text-[#0A0A0A] hover:bg-[#F5F5F0] transition-colors"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 font-bold text-[#0A0A0A] min-w-[50px] text-center">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-xl font-bold text-[#0A0A0A] hover:bg-[#F5F5F0] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex-1 text-right">
                  <span className="text-sm font-bold uppercase tracking-wider text-[#888]">Total:</span>
                  <span className="text-2xl font-bebas text-[#0A0A0A] ml-2">
                    {totalPrice.toFixed(2)} TND
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-4 rounded-full font-bold uppercase text-sm tracking-widest transition-all flex items-center justify-center gap-2 ${
                    isAdded 
                      ? 'bg-[#00AA00] text-white' 
                      : product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#0A0A0A] text-[#C6FF00] hover:bg-[#1a1a1a] hover:shadow-lg'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className={`px-8 py-4 rounded-full font-bold uppercase text-sm tracking-widest transition-all ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#C6FF00] text-[#0A0A0A] hover:bg-[#b0e600] hover:shadow-lg'
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl p-6 border border-[#e5e5e0]">
              <h3 className="text-xl font-bebas text-[#0A0A0A] uppercase tracking-wider mb-6">
                Customer Reviews ({product.reviews.length})
              </h3>
              
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-[#f0f0f0] pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="font-bold text-[#0A0A0A]">{review.author}</span>
                      </div>
                      <span className="text-xs text-[#888]">{review.date}</span>
                    </div>
                    <p className="text-[#555] leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}