import React from 'react';

interface Props {
  model: string;
}

export default function PhoneCaseSVG({ model }: Props) {
  // A perfect 300x620 Silhouette with a Reverse Mask to occlude the canvas bleed natively.
  // The canvas underneath fills the whole 300x620 square, but only the phone silhouette is visible.

  return (
    <svg 
      className="absolute inset-0 pointer-events-none z-20" 
      viewBox="0 0 300 620" 
      width="300" height="620" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="phone-mask">
          <rect width="300" height="620" fill="white" />
          <rect x="0" y="0" width="300" height="620" rx="42" fill="black" />
        </mask>
      </defs>

      {/* Exterior Occlusion (hides anything outside the rounded phone border) */}
      {/* Same color as the center panel background to blend perfectly (#13131a) -> wait I'll set it to transparent via CSS drop-shadow instead if possible, but matching works. I will use #13131A */}
      <rect width="300" height="620" fill="#13131a" mask="url(#phone-mask)" />
      
      {/* Outer Case Border Highlight */}
      <rect x="0" y="0" width="300" height="620" rx="42" fill="none" stroke="#2A2A2A" strokeWidth="2" />

      {/* Inner Screen/Hardware Overlays */}
      
      {/* Dynamic island (Front slot) */}
      <rect x="105" y="15" width="90" height="15" rx="7.5" fill="#0A0A0A" />

      {/* Camera Island Bump (Back surface representation) */}
      <g className="opacity-90 transition-opacity hover:opacity-100">
        <rect x="15" y="15" width="105" height="110" rx="22" fill="#050505" fillOpacity="0.8" stroke="#333" strokeWidth="1" />
        {/* Lenses */}
        <circle cx="40" cy="45" r="14" fill="#000" stroke="#222" strokeWidth="2" />
        <circle cx="40" cy="85" r="14" fill="#000" stroke="#222" strokeWidth="2" />
        <circle cx="85" cy="65" r="14" fill="#000" stroke="#222" strokeWidth="2" />
        <text x="67" y="112" fill="#666" fontSize="7" textAnchor="middle" fontWeight="bold" letterSpacing={1}>CAMERA</text>
      </g>

      {/* Bottom Charging Port */}
      <rect x="120" y="605" width="60" height="8" rx="4" fill="#050505" />
      <text x="150" y="602" fill="#555" fontSize="6" textAnchor="middle">PORT</text>

      {/* Side Buttons (Simulated on the edges) */}
      <rect x="1" y="120" width="2" height="35" rx="1" fill="#444" />
      <rect x="1" y="170" width="2" height="35" rx="1" fill="#444" />
      <rect x="297" y="150" width="2" height="55" rx="1" fill="#444" />
      
    </svg>
  );
}
