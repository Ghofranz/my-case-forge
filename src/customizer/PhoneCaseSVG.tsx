import React from 'react';

interface Props {
  model: string;
}

export default function PhoneCaseSVG({ model: _model }: Props) {
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
        {/*
          clipPath so the canvas (which is a sibling, not inside the SVG)
          stays within the phone shape. The actual canvas clipping is done
          via borderRadius: 42 on the canvas element itself in CSS.
        */}
      </defs>

      {/* ── Rounded border highlight ── */}
      <rect
        x="1" y="1" width="298" height="618"
        rx="41" ry="41"
        fill="none"
        stroke="#3a3a3a"
        strokeWidth="2"
      />
      {/* Inner subtle edge sheen */}
      <rect
        x="3" y="3" width="294" height="614"
        rx="39" ry="39"
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="1"
      />

      {/* ── Dynamic Island ── */}
      <rect x="100" y="14" width="100" height="17" rx="8.5" fill="#0A0A0A" />

      {/* ── Camera island ── */}
      <rect x="14" y="18" width="108" height="108" rx="22" fill="#080808" stroke="#2a2a2a" strokeWidth="1.5" />
      {/* Lens rings */}
      <circle cx="38" cy="47" r="15" fill="#030303" stroke="#1f1f1f" strokeWidth="2" />
      <circle cx="38" cy="47" r="9" fill="#000" stroke="#111" strokeWidth="1" />
      <circle cx="38" cy="89" r="15" fill="#030303" stroke="#1f1f1f" strokeWidth="2" />
      <circle cx="38" cy="89" r="9" fill="#000" stroke="#111" strokeWidth="1" />
      <circle cx="82" cy="68" r="15" fill="#030303" stroke="#1f1f1f" strokeWidth="2" />
      <circle cx="82" cy="68" r="9" fill="#000" stroke="#111" strokeWidth="1" />
      {/* LiDAR / flash dot */}
      <circle cx="96" cy="26" r="5" fill="#111" stroke="#222" strokeWidth="1" />
      <text x="68" y="116" fill="#444" fontSize="6.5" textAnchor="middle" fontWeight="bold" letterSpacing="1">
        CAMERA
      </text>

      {/* ── Bottom charging port ── */}
      <rect x="126" y="607" width="48" height="7" rx="3.5" fill="#0A0A0A" />

      {/* ── Side buttons (purely decorative) ── */}
      {/* Left: mute toggle */}
      <rect x="0" y="105" width="3" height="26" rx="1.5" fill="#2a2a2a" />
      {/* Left: volume up */}
      <rect x="0" y="143" width="3" height="36" rx="1.5" fill="#2a2a2a" />
      {/* Left: volume down */}
      <rect x="0" y="189" width="3" height="36" rx="1.5" fill="#2a2a2a" />
      {/* Right: power */}
      <rect x="297" y="148" width="3" height="54" rx="1.5" fill="#2a2a2a" />

      {/* ── Glass sheen (subtle top-left highlight) ── */}
      <ellipse cx="80" cy="200" rx="60" ry="120"
        fill="url(#sheen)" opacity="0.04" />
      <defs>
        <radialGradient id="sheen" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
