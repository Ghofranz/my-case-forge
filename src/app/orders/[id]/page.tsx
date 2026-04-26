"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Package, CheckCircle, Clock, Truck, ArrowLeft, 
  CreditCard, MapPin, Calendar, ChevronRight
} from "lucide-react";
import Link from "next/link";

// Mock order data - in production this would come from an API
const mockOrders = {
  "ORD-001": {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    items: [
      { name: "Cyber Neon V1", quantity: 1, price: 35.00, image: "/cases/cyber.png", phoneModel: "iPhone 15 Pro" }
    ],
    subtotal: 35.00,
    shipping: 5.99,
    tax: 2.80,
    total: 43.79,
    tracking: ["received", "validated", "production", "packed", "shipped", "delivered"],
    currentStep: "delivered",
    estimatedDelivery: "2024-01-22",
    actualDelivery: "2024-01-20",
    shippingAddress: {
      name: "John Doe",
      street: "123 Avenue Habib Bourguiba",
      city: "Tunis",
      state: "Tunis",
      zipCode: "1000",
      country: "Tunisia"
    },
    deliveryMethod: "Standard Delivery",
    paymentMethod: "Credit Card"
  },
  "ORD-002": {
    id: "ORD-002",
    date: "2024-01-20",
    status: "in_production",
    items: [
      { name: "Brutalist Matte", quantity: 2, price: 80.00, image: "/cases/minimal.png", phoneModel: "Samsung S24 Ultra" }
    ],
    subtotal: 80.00,
    shipping: 5.99,
    tax: 6.40,
    total: 92.39,
    tracking: ["received", "validated", "production"],
    currentStep: "production",
    estimatedDelivery: "2024-01-27",
    actualDelivery: null,
    shippingAddress: {
      name: "John Doe",
      street: "123 Avenue Habib Bourguiba",
      city: "Tunis",
      state: "Tunis",
      zipCode: "1000",
      country: "Tunisia"
    },
    deliveryMethod: "Standard Delivery",
    paymentMethod: "PayPal"
  }
};

const statusSteps = [
  { key: "received", label: "Order Received", description: "Your order has been placed", icon: Package },
  { key: "validated", label: "Design Validated", description: "Design checked for quality", icon: CheckCircle },
  { key: "production", label: "In Production", description: "Your case is being made", icon: Clock },
  { key: "packed", label: "Packed", description: "Ready for shipment", icon: Package },
  { key: "shipped", label: "Shipped", description: "On its way to you", icon: Truck },
  { key: "delivered", label: "Delivered", description: "Order completed", icon: CheckCircle },
];

const statusColors: Record<string, string> = {
  received: "bg-gray-500",
  validated: "bg-blue-500",
  production: "bg-yellow-500",
  packed: "bg-purple-500",
  shipped: "bg-orange-500",
  delivered: "bg-green-500"
};

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const order = mockOrders[params.id as keyof typeof mockOrders];

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bebas text-[#0A0A0A] mb-4">Order Not Found</h1>
          <Link href="/profile#orders" className="text-[#C6FF00] hover:underline">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.currentStep);

  return (
    <div className="min-h-screen bg-[#F5F5F0] pt-24 pb-32">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link 
            href="/profile#orders" 
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#888] hover:text-[#C6FF00] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-bebas text-[#0A0A0A] uppercase tracking-wider">
                Order {order.id}
              </h1>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-2">
                Placed on {order.date}
              </p>
            </div>
            <div className={`px-6 py-3 rounded-full font-bold uppercase text-sm tracking-wider ${
              order.status === "delivered" 
                ? "bg-green-100 text-green-700" 
                : "bg-[#C6FF00]/20 text-[#0A0A0A]"
            }`}>
              {order.status === "delivered" ? "✓ Delivered" : "⏳ In Progress"}
            </div>
          </div>
        </motion.div>

        {/* Tracking Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-[#e5e5e0] p-8 mb-8"
        >
          <h2 className="text-2xl font-bebas text-[#0A0A0A] uppercase mb-8">Order Status</h2>
          
          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-[#e5e5e0] rounded-full" />
            <div 
              className="absolute top-6 left-0 h-1 bg-[#C6FF00] rounded-full transition-all duration-500"
              style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
            />
            
            {/* Steps */}
            <div className="flex justify-between relative">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = step.icon;
                
                return (
                  <div key={step.key} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                        isCompleted 
                          ? statusColors[step.key] 
                          : "bg-[#e5e5e0]"
                      } ${isCurrent ? "ring-4 ring-[#C6FF00]/30 scale-110" : ""}`}
                    >
                      <Icon className={`w-5 h-5 ${isCompleted ? "text-white" : "text-gray-400"}`} />
                    </div>
                    <div className="text-center mt-4">
                      <p className={`font-bold text-sm ${isCompleted ? "text-[#0A0A0A]" : "text-gray-400"}`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-[#888] mt-1 uppercase tracking-wider">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F5F5F0] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-[#C6FF00]" />
                <h3 className="font-bold uppercase text-sm tracking-widest text-[#888]">Estimated Delivery</h3>
              </div>
              <p className="text-2xl font-bebas text-[#0A0A0A]">
                {order.actualDelivery || order.estimatedDelivery}
              </p>
              <p className="text-sm text-[#555] mt-2">
                {order.deliveryMethod}
              </p>
            </div>
            
            <div className="bg-[#F5F5F0] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-[#C6FF00]" />
                <h3 className="font-bold uppercase text-sm tracking-widest text-[#888]">Shipping Address</h3>
              </div>
              <p className="font-bold text-[#0A0A0A]">{order.shippingAddress.name}</p>
              <p className="text-sm text-[#555] mt-1">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl border border-[#e5e5e0] p-8"
            >
              <h2 className="text-2xl font-bebas text-[#0A0A0A] uppercase mb-6">Order Items</h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-6 p-4 bg-[#F9F9F9] rounded-2xl">
                    <div className="w-20 h-24 bg-white rounded-xl flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="w-16 h-20 object-contain" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-[#0A0A0A]">{item.name}</h3>
                      <p className="text-sm text-[#888]">Qty: {item.quantity} • {item.phoneModel}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-[#0A0A0A]">{item.price.toFixed(2)} TND</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#e5e5e0] space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold">{order.subtotal.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-bold">{order.shipping.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-bold">{order.tax.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-[#e5e5e0]">
                  <span className="font-bold uppercase tracking-widest text-[#888]">Total</span>
                  <span className="text-2xl font-bebas text-[#0A0A0A]">{order.total.toFixed(2)} TND</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl border border-[#e5e5e0] p-8"
            >
              <h2 className="text-2xl font-bebas text-[#0A0A0A] uppercase mb-6">Order Details</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F5F5F0] rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#C6FF00]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#888]">Order Date</p>
                    <p className="font-bold text-[#0A0A0A]">{order.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F5F5F0] rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#C6FF00]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#888]">Payment Method</p>
                    <p className="font-bold text-[#0A0A0A]">{order.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F5F5F0] rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#C6FF00]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#888]">Order ID</p>
                    <p className="font-bold text-[#0A0A0A]">{order.id}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#e5e5e0]">
                <Link
                  href={`/shop/${order.items[0].name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center justify-between p-4 bg-[#F5F5F0] rounded-xl hover:bg-[#e5e5e0] transition-colors"
                >
                  <span className="font-bold text-sm uppercase tracking-wider">Shop Similar</span>
                  <ChevronRight className="w-4 h-4 text-[#888]" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}