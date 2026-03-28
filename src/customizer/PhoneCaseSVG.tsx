"use client";

export const DEVICE_METRICS: Record<string, { w: number; h: number; rx: number; camera: any }> = {
  'iPhone 15 Pro': {
    w: 300,
    h: 620,
    rx: 48,
    camera: { type: 'squircle', x: 20, y: 20, w: 90, h: 90, rx: 20 },
  },
  'iPhone 14': {
    w: 300,
    h: 620,
    rx: 44,
    camera: { type: 'squircle', x: 20, y: 20, w: 80, h: 80, rx: 16 },
  },
  'Samsung S24 Ultra': {
    w: 310,
    h: 640,
    rx: 8,
    camera: { type: 'quad-lens', x: 20, y: 20, w: 40, h: 120 },
  },
  'Pixel 8 Pro': {
    w: 300,
    h: 630,
    rx: 36,
    camera: { type: 'visor', x: 0, y: 80, w: 300, h: 60 },
  },
  'OnePlus 12': {
    w: 305,
    h: 635,
    rx: 32,
    camera: { type: 'circle', x: 20, y: 30, r: 45 },
  },
  'Xiaomi 14': {
    w: 300,
    h: 625,
    rx: 24,
    camera: { type: 'squircle', x: 20, y: 20, w: 95, h: 95, rx: 12 },
  },
};

export default function PhoneCaseSVG({ model }: { model?: string }) {
  const metrics = DEVICE_METRICS[model || 'iPhone 15 Pro'] || DEVICE_METRICS['iPhone 15 Pro'];
  const { w, h, rx, camera } = metrics;

  return (
    <svg 
      className="absolute inset-0 pointer-events-none" 
      width={w} 
      height={h} 
      viewBox={`0 0 ${w} ${h}`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ zIndex: 50 }} // Stays strictly OVER the canvas
    >
      <defs>
        {/* Dynamic ClipPath matching the exact hardware silhouette (excluding front screen things) */}
        <clipPath id="phone-mask">
          <path
            d={`
              M ${rx} 0
              H ${w - rx}
              A ${rx} ${rx} 0 0 1 ${w} ${rx}
              V ${h - rx}
              A ${rx} ${rx} 0 0 1 ${w - rx} ${h}
              H ${rx}
              A ${rx} ${rx} 0 0 1 0 ${h - rx}
              V ${rx}
              A ${rx} ${rx} 0 0 1 ${rx} 0
              Z
            `}
          />
        </clipPath>
      </defs>

      {/* ── Outer white frame blocking the overflowing canvas pixels ── */}
      <path
        d={`
          M 0 0 H ${w} V ${h} H 0 Z
          M ${rx} 0
          A ${rx} ${rx} 0 0 0 0 ${rx}
          V ${h - rx}
          A ${rx} ${rx} 0 0 0 ${rx} ${h}
          H ${w - rx}
          A ${rx} ${rx} 0 0 0 ${w} ${h - rx}
          V ${rx}
          A ${rx} ${rx} 0 0 0 ${w - rx} 0
          Z
        `}
        fill="#ffffff"
        fillRule="evenodd"
      />

      {/* ── Glass Edge Stroke ── */}
      <rect
        x="1" y="1" width={w - 2} height={h - 2}
        rx={rx - 1} ry={rx - 1}
        fill="none"
        stroke="#e5e5e0"
        strokeWidth="2"
      />

      {/* ── CAMERA CUTOUT LAYER ── */}
      {camera.type === 'squircle' && (
        <rect
          x={camera.x} y={camera.y}
          width={camera.w} height={camera.h}
          rx={camera.rx} fill="#0A0A0A"
          stroke="#e5e5e0" strokeWidth="2"
        />
      )}

      {camera.type === 'quad-lens' && (
        <g>
          {[0, 30, 60, 90].map((dy) => (
            <circle key={dy} cx={camera.x + 20} cy={camera.y + dy + 15} r="12" fill="#0A0A0A" stroke="#333" strokeWidth="2" />
          ))}
          <circle cx={camera.x + 50} cy={camera.y + 45} r="8" fill="#0A0A0A" stroke="#333" strokeWidth="2" />
        </g>
      )}

      {camera.type === 'visor' && (
        <rect
          x={camera.x} y={camera.y}
          width={camera.w} height={camera.h}
          rx="12" fill="#0A0A0A"
        />
      )}

      {camera.type === 'circle' && (
        <circle
          cx={camera.x + camera.r} cy={camera.y + camera.r}
          r={camera.r} fill="#0A0A0A"
          stroke="#444" strokeWidth="2"
        />
      )}
    </svg>
  );
}
