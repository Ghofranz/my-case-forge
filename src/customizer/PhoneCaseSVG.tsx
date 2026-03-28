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
      className="absolute inset-0 pointer-events-none drop-shadow-2xl" 
      width={w + 20} 
      height={h + 20} 
      viewBox={`-10 -10 ${w + 20} ${h + 20}`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ zIndex: 50, left: -10, top: -10 }} 
    >
      <defs>
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

        <linearGradient id="metal-edge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dddddd" />
          <stop offset="50%" stopColor="#fdfdfd" />
          <stop offset="100%" stopColor="#aaaaaa" />
        </linearGradient>
      </defs>

      <path
        d={`
          M -10 -10 H ${w+10} V ${h+10} H -10 Z
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
        fill="#F8F8F8" 
        fillRule="evenodd"
      />

      <rect
        x="1.5" y="1.5" width={w - 3} height={h - 3}
        rx={rx - 1.5} ry={rx - 1.5}
        fill="none"
        stroke="url(#metal-edge)"
        strokeWidth="3"
        className="opacity-70"
      />

      <path d="M -2 120 Q -4 125 -4 130 V 160 Q -4 165 -2 170 Z" fill="#999" />
      <path d="M -2 180 Q -4 185 -4 190 V 220 Q -4 225 -2 230 Z" fill="#999" />
      <path d={`M ${w+2} 150 Q ${w+4} 155 ${w+4} 160 V 210 Q ${w+4} 215 ${w+2} 220 Z`} fill="#999" />

      {camera.type === 'squircle' && (
        <rect
          x={camera.x} y={camera.y}
          width={camera.w} height={camera.h}
          rx={camera.rx} fill="#0A0A0A"
          stroke="#444" strokeWidth="3"
          style={{ filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.5))' }}
        />
      )}

      {camera.type === 'quad-lens' && (
        <g>
          <rect x={camera.x - 5} y={camera.y - 10} width={camera.w + 10} height={camera.h + 20} rx="16" fill="#0A0A0A" />
          {[0, 30, 60, 90].map((dy) => (
            <circle key={dy} cx={camera.x + 15} cy={camera.y + dy + 15} r="12" fill="#111" stroke="#333" strokeWidth="2" />
          ))}
        </g>
      )}

      {camera.type === 'visor' && (
        <rect
          x={camera.x - 5} y={camera.y}
          width={camera.w + 10} height={camera.h}
          rx="12" fill="#0A0A0A"
          stroke="#222" strokeWidth="2"
        />
      )}

      {camera.type === 'circle' && (
        <circle
          cx={camera.x + camera.r} cy={camera.y + camera.r}
          r={camera.r} fill="#0A0A0A"
          stroke="#333" strokeWidth="4"
        />
      )}
    </svg>
  );
}
