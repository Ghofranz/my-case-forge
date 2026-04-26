"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, Globe, Lock, ShieldCheck, CreditCard, ChevronRight,
  Truck, Clock, MapPin, Wallet, DollarSign, Radio
} from "lucide-react";

type DeliveryMethod = "standard" | "express" | "pickup";
type PaymentMethod = "card" | "paypal" | "cod";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, publishToVault } = useCustomizerStore();
  const { user, addresses } = useAuthStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [selectedAddress, setSelectedAddress] = useState(user?.addresses?.[0]?.id || "");
  
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  
  const deliveryOptions = {
    standard: { label: "Standard Delivery", price: 5.99, days: "5-7", icon: Truck },
    express: { label: "Express Delivery", price: 12.99, days: "2-3", icon: Clock },
    pickup: { label: "Pickup Point", price: 0, days: "3-5", icon: MapPin },
  };
  
  const deliveryPrice = deliveryOptions[deliveryMethod].price;
  const tax = subtotal * 0.08;
  const total = subtotal + tax + deliveryPrice;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowPublishModal(true);
    }, 1500);
  };

  const handleCommunityChoice = (isPublic: boolean) => {
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

    clearCart();
    router.push(isPublic ? '/community' : '/profile?tab=orders');
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
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
        
        {/* Left: Forms */}
        <div>
          <h1 className="text-4xl font-bebas text-[#0A0A0A] uppercase tracking-wider mb-8">
            Checkout
          </h1>

          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white p-6 rounded-[24px] border border-[#e5e5e0] shadow-sm">
              <h3 className="font-bold uppercase text-xs tracking-widest text-gray-500 mb-4">Contact Info</h3>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-[#f9f9f9] border border-[#eee] p-4 rounded-xl outline-none focus:border-[#C6FF00] transition-colors" 
                defaultValue={user?.email || "designer@hype.com"} 
              />
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-[24px] border border-[#e5e5e0] shadow-sm">
              <h3 className="font-bold uppercase text-xs tracking-widest text-gray-500 mb-4">Shipping Address</h3>
              {addresses && addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label 
                      key={addr.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddress === addr.id 
                          ? "border-[#C6FF00] bg-[#C6FF00]/5" 
                          : "border-[#e5e5e0] hover:border-[#C6FF00]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddress === addr.id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-[#0A0A0A]">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-[#C6FF00] text-[#0A0A0A] px-2 py-0.5 rounded-full uppercase tracking-wider">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-[#555]">
                          {addr.street}<br />
                          {addr.city}, {addr.state} {addr.zipCode}<br />
                          {addr.country}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="bg-[#f9f9f9] border border-[#eee] p-4 rounded-xl outline-none focus:border-black" defaultValue="Neo" />
                  <input type="text" placeholder="Last Name" className="bg-[#f9f9f9] border border-[#eee] p-4 rounded-xl outline-none focus:border-black" defaultValue="Tokyo" />
                  <input type="text" placeholder="Address" className="col-span-2 bg-[#f9f9f9] border border-[#eee] p-4 rounded-xl outline-none focus:border-black" defaultValue="123 Cyber Ave" />
                </div>
              )}
            </div>

            {/* Delivery Method */}
            <div className="bg-white p-6 rounded-[24px] border border-[#e5e5e0] shadow-sm">
              <h3 className="font-bold uppercase text-xs tracking-widest text-gray-500 mb-4">Delivery Method</h3>
              <div className="space-y-3">
                {Object.entries(deliveryOptions).map(([key, option]) => (
                  <label
                    key={key}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === key 
                        ? "border-[#C6FF00] bg-[#C6FF00]/5" 
                        : "border-[#e5e5e0] hover:border-[#C6FF00]/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={key}
                      checked={deliveryMethod === key}
                      onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                      className="mt-1"
                    />
                    <option.icon className="w-6 h-6 text-[#C6FF00]" />
                    <div className="flex-1">
                      <span className="font-bold text-[#0A0A0A]">{option.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#0A0A0A]">
                        {option.price === 0 ? "Free" : `${option.price.toFixed(2)} TND`}
                      </span>
                      <p className="text-xs text-[#888]">Est. {option.days} days</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-4 p-4 bg-[#F5F5F0] rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C6FF00]" />
                  <span className="text-sm font-bold text-[#0A0A0A]">
                    Estimated delivery: {deliveryOptions[deliveryMethod].days} business days
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#0A0A0A] p-6 rounded-[24px] text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <CreditCard className="w-24 h-24" />
              </div>
              <h3 className="font-bold uppercase text-xs tracking-widest text-[#C6FF00] mb-4 relative z-10">Payment Method</h3>
              
              <div className="space-y-3 relative z-10">
                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "card" 
                      ? "border-[#C6FF00] bg-[#C6FF00]/10" 
                      : "border-[#333] hover:border-[#C6FF00]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="mt-1"
                  />
                  <CreditCard className="w-6 h-6 text-[#C6FF00]" />
                  <span className="font-bold">Credit/Debit Card</span>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "paypal" 
                      ? "border-[#C6FF00] bg-[#C6FF00]/10" 
                      : "border-[#333] hover:border-[#C6FF00]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="mt-1"
                  />
                  <Wallet className="w-6 h-6 text-[#C6FF00]" />
                  <span className="font-bold">PayPal</span>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod" 
                      ? "border-[#C6FF00] bg-[#C6FF00]/10" 
                      : "border-[#333] hover:border-[#C6FF00]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="mt-1"
                  />
                  <DollarSign className="w-6 h-6 text-[#C6FF00]" />
                  <span className="font-bold">Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === "card" && (
                <div className="mt-6">
                  <input 
                    type="text" 
                    placeholder="Card Number" 
                    className="w-full bg-[#111] border border-[#333] p-4 rounded-xl outline-none focus:border-[#C6FF00] text-white font-mono tracking-widest" 
                    defaultValue="**** **** **** 4242" 
                  />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input type="text" placeholder="MM/YY" className="bg-[#111] border border-[#333] p-4 rounded-xl outline-none focus:border-[#C6FF00] text-white" />
                    <input type="text" placeholder="CVC" className="bg-[#111] border border-[#333] p-4 rounded-xl outline-none focus:border-[#C6FF00] text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:pl-12">
          <div className="sticky top-24 pt-4">
            <h3 className="text-2xl font-bebas mb-6 tracking-wider">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-[16px] border border-[#e5e5e0]">
                  <img src={item.previewImage} alt="case" className="w-12 h-20 object-contain bg-[#f0f0ea] rounded-md" />
                  <div>
                    <p className="font-bebas text-lg tracking-wider">{item.designName}</p>
                    <p className="text-xs text-gray-500 font-bold tracking-widest">{item.phoneModel}</p>
                  </div>
                  <div className="ml-auto font-bold">{item.price.toFixed(2)} TND</div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e5e5e0] pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold">{subtotal.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax (8%)</span>
                <span className="font-bold">{tax.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Delivery ({deliveryOptions[deliveryMethod].label})
                </span>
                <span className="font-bold">
                  {deliveryPrice === 0 ? "Free" : `${deliveryPrice.toFixed(2)} TND`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8 border-t border-[#dcdcc9] pt-6">
              <span className="text-xl font-bold uppercase tracking-widest text-gray-500">Total</span>
              <span className="text-4xl font-bebas text-[#0A0A0A]">{total.toFixed(2)} TND</span>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-5 bg-[#C6FF00] text-[#0A0A0A] text-center font-bold tracking-widest uppercase text-sm rounded-full shadow-lg hover:bg-black hover:text-[#C6FF00] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Place KaJi Order
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
              Secure 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>

      {/* Community Post-Purchase Modal */}
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
                Your masterpieces are entering the physical KaJi production line. 
                <br/><br/>
                <strong className="text-white text-base">Earn 50 TND Vouchers!</strong><br/>
                Do you want to publish your designs to the <span className="text-[#C6FF00]">Community Vault</span> and compete to be the most liked case this week?
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