"use client";

import React from 'react';
import { DEVICE_METRICS } from '@/customizer/PhoneCaseSVG';

export default function PhoneCaseMask({ 
  children, 
  model, 
  className = "" 
}: { 
  children: React.ReactNode, 
  model?: string,
  className?: string 
}) {
  const metrics = DEVICE_METRICS[model || 'iPhone 15 Pro'] || DEVICE_METRICS['iPhone 15 Pro'];
  const { rx, camera } = metrics;
  
  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`} style={{ borderRadius: `${rx}px` }}>
      {/* The background image / content */}
      <div className="absolute inset-0 z-0">
        {children}
      </div>
      
      {/* The physical camera cutout overlay */}
      <div 
        className="absolute bg-[#0A0A0A] z-10 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]"
        style={{
          width: `${camera.w}px`,
          height: `${camera.h}px`,
          top: `${camera.y}px`,
          left: `${camera.x}px`,
          borderRadius: `${camera.rx}px`,
        }}
      />
      
      {/* Soft internal edge bevel for realism */}
      <div 
        className="absolute inset-0 rounded-inherit z-20 pointer-events-none" 
        style={{ 
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05), inset 0 2px 10px rgba(255,255,255,0.3)',
          borderRadius: `${rx}px`
        }} 
      />
    </div>
  );
}
