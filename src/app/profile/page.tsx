"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, Package, Heart, 
  Edit2, Trash2, Plus, Check, ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import Link from "next/link";

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    items: [{ name: "Cyber Neon V1", quantity: 1, price: 35.00, image: "/cases/cyber.png" }],
    total: 40.99,
    tracking: ["received", "validated", "production", "packed", "shipped", "delivered"]
  },
  {
    id: "ORD-002",
    date: "2024-01-20",
    status: "in_production",
    items: [{ name: "Brutalist Matte", quantity: 2, price: 80.00, image: "/cases/minimal.png" }],
    total: 85.99,
    tracking: ["received", "validated", "production"]
  },
];

// Mock saved designs
const mockSavedDesigns = [
  { id: "d1", name: "My Cyber Design", preview: "/cyber_case.png", createdAt: "2024-01-10" },
  { id: "d2", name: "Retro Vibes", preview: "/retro_case.png", createdAt: "2024-01-12" },
];

const statusLabels: Record<string, string> = {
  received: "Order Received",
  validated: "Design Validated",
  production: "In Production",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered"
};

const statusColors: Record<string, string> = {
  received: "bg-gray-500",
  validated: "bg-blue-500",
  production: "bg-yellow-500",
  packed: "bg-purple-500",
  shipped: "bg-orange-500",
  delivered: "bg-green-500"
};

type TrackingStep = "received" | "validated" | "production" | "packed" | "shipped" | "delivered";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, addAddress, removeAddress, setDefaultAddress } = useAuthStore();
  const addresses = useAuthStore((state) => state.addresses);
  const { cart } = useCustomizerStore();
  const [activeTab, setActiveTab] = useState("info");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Tunisia"
  });

  if (!isAuthenticated || !user) {
    router.push("/login");
    return null;
  }

  const handleAddAddress = () => {
    if (newAddress.label && newAddress.street && newAddress.city) {
      addAddress({ ...newAddress, isDefault: addresses.length === 0 });
      setNewAddress({ label: "", street: "", city: "", state: "", zipCode: "", country: "Tunisia" });
      setShowAddressForm(false);
    }
  };

  const trackingSteps: TrackingStep[] = ["received", "validated", "production", "packed", "shipped", "delivered"];

  return (
    <div className="min-h-screen bg-[#F5F5F0] pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-[#0A0A0A] rounded-full flex items-center justify-center">
              <span className="text-3xl font-bebas text-[#C6FF00]">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-bebas text-[#0A0A0A] uppercase tracking-wider">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">
                {user.email}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#e5e5e0] p-4 sticky top-32">
              <nav className="space-y-2">
                {[
                  { id: "info", label: "Personal Info", icon: User },
                  { id: "addresses", label: "Addresses", icon: MapPin },
                  { id: "orders", label: "Orders", icon: Package },
                  { id: "designs", label: "My Designs", icon: Heart },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm uppercase tracking-wider ${
                      activeTab === item.id
                        ? "bg-[#C6FF00] text-[#0A0A0A]"
                        : "text-[#888] hover:bg-[#F5F5F0] hover:text-[#0A0A0A]"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Personal Info */}
            {activeTab === "info" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl border border-[#e5e5e0] p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bebas text-[#0A0A0A] uppercase">Personal Information</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#F5F5F0] rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#e5e5e0] transition-colors">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-[#888] mb-2 block">
                        First Name
                      </label>
                      <p className="text-lg font-bold text-[#0A0A0A]">{user.firstName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-[#888] mb-2 block">
                        Last Name
                      </label>
                      <p className="text-lg font-bold text-[#0A0A0A]">{user.lastName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-[#888] mb-2 block">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#888]" />
                        <p className="text-lg font-bold text-[#0A0A0A]">{user.email}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-[#888] mb-2 block">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#888]" />
                        <p className="text-lg font-bold text-[#0A0A0A]">{user.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#e5e5e0] p-8">
                  <h2 className="text-2xl font-bebas text-[#0A0A0A] uppercase mb-6">Account Stats</h2>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-[#F5F5F0] rounded-2xl">
                      <p className="text-4xl font-bebas text-[#C6FF00]">{mockOrders.length}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#888] mt-2">Orders</p>
                    </div>
                    <div className="text-center p-6 bg-[#F5F5F0] rounded-2xl">
                      <p className="text-4xl font-bebas text-[#C6FF00]">{mockSavedDesigns.length}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#888] mt-2">Saved Designs</p>
                    </div>
                    <div className="text-center p-6 bg-[#F5F5F0] rounded-2xl">
                      <p className="text-4xl font-bebas text-[#C6FF00]">{addresses.length}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#888] mt-2">Addresses</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Addresses */}
            {activeTab === "addresses" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bebas text-[#0A0A0A] uppercase">Saved Addresses</h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0A0A0A] text-[#C6FF00] rounded-full font-bold uppercase text-sm tracking-wider hover:bg-[#1a1a1a] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Address
                  </button>
                </div>

                {showAddressForm && (
                  <div className="bg-white rounded-2xl border border-[#e5e5e0] p-8">
                    <h3 className="text-xl font-bebas text-[#0A0A0A] uppercase mb-6">New Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-[#888] mb-2 block">Label</label>
                        <input
                          type="text"
                          value={newAddress.label}
                          onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#e5e5e0] rounded-xl outline-none focus:border-[#C6FF00]"
                          placeholder="Home, Work, etc."
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-[#888] mb-2 block">Street</label>
                        <input
                          type="text"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#e5e5e0] rounded-xl outline-none focus:border-[#C6FF00]"
                          placeholder="Street address"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-[#888] mb-2 block">City</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#e5e5e0] rounded-xl outline-none focus:border-[#C6FF00]"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-[#888] mb-2 block">State</label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#e5e5e0] rounded-xl outline-none focus:border-[#C6FF00]"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-[#888] mb-2 block">ZIP Code</label>
                        <input
                          type="text"
                          value={newAddress.zipCode}
                          onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#e5e5e0] rounded-xl outline-none focus:border-[#C6FF00]"
                          placeholder="ZIP"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-[#888] mb-2 block">Country</label>
                        <input
                          type="text"
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#e5e5e0] rounded-xl outline-none focus:border-[#C6FF00]"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={handleAddAddress}
                        className="px-6 py-3 bg-[#C6FF00] text-[#0A0A0A] rounded-full font-bold uppercase text-sm tracking-wider hover:bg-[#b0e600] transition-colors"
                      >
                        Save Address
                      </button>
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="px-6 py-3 bg-[#F5F5F0] text-[#888] rounded-full font-bold uppercase text-sm tracking-wider hover:bg-[#e5e5e0] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="bg-white rounded-2xl border border-[#e5e5e0] p-6 relative">
                      {addr.isDefault && (
                        <span className="absolute top-4 right-4 bg-[#C6FF00] text-[#0A0A0A] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                          Default
                        </span>
                      )}
                      <div className="flex items-center gap-3 mb-4">
                        <MapPin className="w-5 h-5 text-[#C6FF00]" />
                        <h3 className="text-lg font-bold text-[#0A0A0A]">{addr.label}</h3>
                      </div>
                      <p className="text-[#555] text-sm leading-relaxed">
                        {addr.street}<br />
                        {addr.city}, {addr.state} {addr.zipCode}<br />
                        {addr.country}
                      </p>
                      <div className="flex gap-2 mt-4">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#F5F5F0] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#e5e5e0] transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => removeAddress(addr.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Orders */}
            {activeTab === "orders" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bebas text-[#0A0A0A] uppercase">Order History</h2>
                
                {mockOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-[#e5e5e0] p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-bold text-[#888] uppercase tracking-widest">Order</span>
                          <span className="text-lg font-bold text-[#0A0A0A]">{order.id}</span>
                        </div>
                        <p className="text-sm text-[#555]">{order.date}</p>
                      </div>
                      <Link
                        href={`/orders/${order.id}`}
                        className="flex items-center gap-2 text-[#C6FF00] font-bold uppercase text-sm tracking-wider hover:text-[#0A0A0A] transition-colors"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Tracking Timeline */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#e5e5e0] -z-10" />
                        {trackingSteps.map((step) => {
                          const isCompleted = order.tracking.includes(step);
                          return (
                            <div key={step} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isCompleted
                                    ? statusColors[step]
                                    : "bg-[#e5e5e0]"
                                }`}
                              >
                                {isCompleted && (
                                  <Check className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#888] mt-2 text-center max-w-[60px]">
                                {statusLabels[step]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-[#F9F9F9] rounded-xl">
                          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-[#0A0A0A]">{item.name}</p>
                            <p className="text-sm text-[#888]">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-[#0A0A0A]">{item.price.toFixed(2)} TND</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-[#e5e5e0] flex justify-between items-center">
                      <span className="text-sm font-bold uppercase tracking-widest text-[#888]">Total</span>
                      <span className="text-2xl font-bebas text-[#0A0A0A]">{order.total.toFixed(2)} TND</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Saved Designs */}
            {activeTab === "designs" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bebas text-[#0A0A0A] uppercase">My Saved Designs</h2>
                  <Link
                    href="/customizer"
                    className="flex items-center gap-2 px-6 py-3 bg-[#0A0A0A] text-[#C6FF00] rounded-full font-bold uppercase text-sm tracking-wider hover:bg-[#1a1a1a] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create New
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockSavedDesigns.map((design) => (
                    <div key={design.id} className="bg-white rounded-2xl border border-[#e5e5e0] overflow-hidden group hover:shadow-xl transition-shadow">
                      <div className="aspect-[3/4] bg-[#F9F9F9] flex items-center justify-center p-8 relative">
                        <img 
                          src={design.preview} 
                          alt={design.name} 
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                        <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-[#0A0A0A] text-lg">{design.name}</h3>
                        <p className="text-sm text-[#888] mt-1">Created {design.createdAt}</p>
                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 py-2 bg-[#0A0A0A] text-[#C6FF00] rounded-full font-bold uppercase text-xs tracking-wider hover:bg-[#1a1a1a] transition-colors">
                            Edit
                          </button>
                          <button className="flex-1 py-2 bg-[#C6FF00] text-[#0A0A0A] rounded-full font-bold uppercase text-xs tracking-wider hover:bg-[#b0e600] transition-colors">
                            Order
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}