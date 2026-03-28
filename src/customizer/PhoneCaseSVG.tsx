import React from 'react';

interface Props {
  model: string;
}

export const DEVICE_METRICS: Record<string, { rx: number, island: string }> = {
  'iPhone 15 Pro': { rx: 41, island: 'squircle' },
  'iPhone 14': { rx: 40, island: 'squircle_small' },
  'Samsung S24 Ultra': { rx: 12, island: 'quad_circles' },
  'Pixel 8 Pro': { rx: 38, island: 'visor' },
  'OnePlus 12': { rx: 30, island: 'circle_huge' },
  'Xiaomi 14': { rx: 34, island: 'square_rounded' },
};

export default function PhoneCaseSVG({ model }: Props) {
  const metrics = DEVICE_METRICS[model] || DEVICE_METRICS['iPhone 15 Pro'];
  const { rx, island } = metrics;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      viewBox="0 0 300 620"
      width="300"
      height="620"
      xmlns="http://www.w3.org/2000/svg"
      style={{ zIndex: 20 }}
    >
      <defs>
        <radialGradient id="sheen" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Rounded border highlight ── */}
      <rect
        x="1" y="1" width="298" height="618"
        rx={rx - 1} ry={rx - 1}
        fill="none"
        stroke="#e5e5e0"
        strokeWidth="2"
      />
      {/* Inner subtle edge sheen */}
      <rect
        x="3" y="3" width="294" height="614"
        rx={rx - 3} ry={rx - 3}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="1"
      />

      {/* ── Dynamic Island (Front screen cutout illusion) ── */}
      {model.includes('iPhone') && (
        <rect x="100" y="14" width="100" height="17" rx="8.5" fill="#0A0A0A" />
      )}

      {/* ── Camera islands ── */}
      {island === 'squircle' && (
        <g>
          <rect x="14" y="18" width="108" height="108" rx="22" fill="#080808" stroke="#2a2a2a" strokeWidth="1.5" />
          <circle cx="38" cy="47" r="15" fill="#030303" stroke="#1f1f1f" strokeWidth="2" />
          <circle cx="38" cy="47" r="9" fill="#000" stroke="#111" strokeWidth="1" />
          <circle cx="38" cy="89" r="15" fill="#030303" stroke="#1f1f1f" strokeWidth="2" />
          <circle cx="38" cy="89" r="9" fill="#000" stroke="#111" strokeWidth="1" />
          <circle cx="82" cy="68" r="15" fill="#030303" stroke="#1f1f1f" strokeWidth="2" />
          <circle cx="82" cy="68" r="9" fill="#000" stroke="#111" strokeWidth="1" />
          <circle cx="96" cy="26" r="5" fill="#111" stroke="#222" strokeWidth="1" />
          <text x="68" y="116" fill="#444" fontSize="6.5" textAnchor="middle" fontWeight="bold" letterSpacing="1">CAMERA</text>
        </g>
      )}

      {island === 'squircle_small' && (
        <g>
          <rect x="14" y="18" width="90" height="90" rx="18" fill="#080808" stroke="#2a2a2a" strokeWidth="1.5" />
          <circle cx="38" cy="40" r="14" fill="#030303" stroke="#1f1f1f" strokeWidth="2" />
          <circle cx="70" cy="72" r="14" fill="#030303" stroke="#1f1f1f" strokeWidth="2" />
          <circle cx="75" cy="30" r="4" fill="#111" />
        </g>
      )}

      {island === 'quad_circles' && (
        <g>
          {/* S24 Ultra individual lenses */}
          <circle cx="35" cy="40" r="15" fill="#080808" stroke="#2a2a2a" strokeWidth="1.5" />
          <circle cx="35" cy="40" r="9" fill="#030303" />
          <circle cx="35" cy="80" r="15" fill="#080808" stroke="#2a2a2a" strokeWidth="1.5" />
          <circle cx="35" cy="80" r="9" fill="#030303" />
          <circle cx="35" cy="120" r="15" fill="#080808" stroke="#2a2a2a" strokeWidth="1.5" />
          <circle cx="35" cy="120" r="9" fill="#030303" />
          <circle cx="65" cy="60" r="8" fill="#111" stroke="#222" strokeWidth="1.5" />
          <circle cx="65" cy="100" r="10" fill="#080808" stroke="#2a2a2a" strokeWidth="1.5" />
        </g>
      )}

      {island === 'visor' && (
        <g>
          {/* Pixel 8 Pro full-width visor */}
          <rect x="-2" y="42" width="304" height="42" fill="#080808" stroke="#2a2a2a" strokeWidth="1.5" />
          <rect x="80" y="48" width="100" height="30" rx="15" fill="#030303" stroke="#1f1f1f" strokeWidth="1" />
          <circle cx="95" cy="63" r="8" fill="#000" />
          <circle cx="130" cy="63" r="8" fill="#000" />
          <circle cx="165" cy="63" r="8" fill="#000" />
          <circle cx="205" cy="63" r="6" fill="#111" />
        </g>
      )}

      {island === 'circle_huge' && (
        <g>
           {/* OnePlus 12 offset circular bump */}
           <circle cx="90" cy="100" r="60" fill="#080808" stroke="#2a2a2a" strokeWidth="1.5" />
           <circle cx="65" cy="80" r="14" fill="#030303" stroke="#1f1f1f" strokeWidth="1.5" />
           <circle cx="115" cy="80" r="14" fill="#030303" stroke="#1f1f1f" strokeWidth="1.5" />
           <circle cx="65" cy="120" r="14" fill="#030303" stroke="#1f1f1f" strokeWidth="1.5" />
           <circle cx="115" cy="120" r="10" fill="#111" />
        </g>
      )}

      {island === 'square_rounded' && (
        <g>
           {/* Xiaomi 14 huge squarish bump */}
           <rect x="20" y="24" width="130" height="130" rx="30" fill="#080808" stroke="#2a2a2a" strokeWidth="1.5" />
           <circle cx="55" cy="59" r="18" fill="#030303" stroke="#1f1f1f" strokeWidth="1.5" />
           <circle cx="115" cy="59" r="18" fill="#030303" stroke="#1f1f1f" strokeWidth="1.5" />
           <circle cx="55" cy="119" r="18" fill="#030303" stroke="#1f1f1f" strokeWidth="1.5" />
        </g>
      )}

      {/* ── Base Phone Outlines (Buttons & Ports) ── */}
      <rect x="126" y="607" width="48" height="7" rx="3.5" fill="#0A0A0A" />

      <rect x="0" y="105" width="3" height="26" rx="1.5" fill="#2a2a2a" />
      <rect x="0" y="143" width="3" height="36" rx="1.5" fill="#2a2a2a" />
      <rect x="0" y="189" width="3" height="36" rx="1.5" fill="#2a2a2a" />
      
      <rect x="297" y="148" width="3" height="54" rx="1.5" fill="#2a2a2a" />

      {/* ── Glass sheen (subtle top-left highlight) ── */}
      <ellipse cx="80" cy="200" rx="60" ry="120" fill="url(#sheen)" opacity="0.04" />
    </svg>
  );
}
