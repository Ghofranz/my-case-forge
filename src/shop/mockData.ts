export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CaseProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  supportedModels: string[];
  description: string;
  stock: number;
  deliveryDays: number;
  reviews: Review[];
}

export const SUPPORTED_MODELS = [
  "All",
  "iPhone 15 Pro",
  "iPhone 14",
  "Galaxy S24",
  "Pixel 8",
];

export const MOCK_CASES: CaseProduct[] = [
  {
    id: "case-cyber-001",
    name: "Cyber Neon V1",
    price: 35.0,
    image: "/cases/cyber.png",
    supportedModels: ["iPhone 15 Pro", "Galaxy S24"],
    description: "Futuristic cyberpunk design with neon grid patterns and glowing accents. Made from premium polycarbonate with a glossy finish that makes the neon colors pop. Perfect for night owls and tech enthusiasts who want their device to stand out in the dark.",
    stock: 24,
    deliveryDays: 3,
    reviews: [
      { id: "r1", author: "NeoRunner", rating: 5, comment: "Absolutely love the neon glow! Gets compliments everywhere I go.", date: "2024-01-15" },
      { id: "r2", author: "CyberPunk2077", rating: 4, comment: "Great design, but wish it had more grip.", date: "2024-01-10" },
      { id: "r3", author: "TechNinja", rating: 5, comment: "Perfect for my setup. Matches my RGB keyboard perfectly!", date: "2024-01-05" },
    ],
  },
  {
    id: "case-retro-002",
    name: "Arcade 99",
    price: 30.0,
    image: "/cases/retro.png",
    supportedModels: ["iPhone 14", "iPhone 15 Pro", "Pixel 8"],
    description: "Nostalgic tribute to the golden age of arcade gaming. Features pixel-perfect 8-bit graphics with vibrant retro colors. The matte texture provides excellent grip while reminiscing about those late-night gaming sessions.",
    stock: 18,
    deliveryDays: 2,
    reviews: [
      { id: "r4", author: "RetroGamer", rating: 5, comment: "Takes me back to the arcade! Quality is top notch.", date: "2024-01-12" },
      { id: "r5", author: "PixelMaster", rating: 5, comment: "The 8-bit art is so detailed. Love it!", date: "2024-01-08" },
    ],
  },
  {
    id: "case-minimal-003",
    name: "Brutalist Matte",
    price: 40.0,
    image: "/cases/minimal.png",
    supportedModels: ["iPhone 15 Pro", "Galaxy S24", "Pixel 8"],
    description: "Embrace the power of negative space with this brutally minimalist design. Clean lines, monochromatic palette, and a soft-touch matte finish that resists fingerprints. For those who believe less is more.",
    stock: 32,
    deliveryDays: 2,
    reviews: [
      { id: "r6", author: "MinimalistMike", rating: 5, comment: "Exactly what I was looking for. Clean and professional.", date: "2024-01-14" },
      { id: "r7", author: "DesignPro", rating: 4, comment: "Beautiful design, but shows scratches easily.", date: "2024-01-11" },
      { id: "r8", author: "SimpleLife", rating: 5, comment: "Perfect for business meetings. Subtle yet stylish.", date: "2024-01-06" },
    ],
  },
  {
    id: "case-cyber-004",
    name: "Cyber Neon V2",
    price: 35.0,
    image: "/cases/cyber.png",
    supportedModels: ["iPhone 14"],
    description: "The evolved version of our bestselling cyber design. Enhanced with deeper neon penetration and a more complex grid structure. Features UV-reactive elements that glow under blacklight for an extra layer of cyberpunk authenticity.",
    stock: 15,
    deliveryDays: 4,
    reviews: [
      { id: "r9", author: "NightOwl", rating: 5, comment: "The UV reaction is insane at parties!", date: "2024-01-13" },
    ],
  },
  {
    id: "case-retro-005",
    name: "Synthwave Sunset",
    price: 30.0,
    image: "/cases/retro.png",
    supportedModels: ["iPhone 15 Pro", "Galaxy S24"],
    description: "Cruise into the sunset with this vaporwave-inspired masterpiece. Gradient skies of pink and purple meet geometric wireframe mountains. The glossy finish enhances the dreamy aesthetic while providing solid protection.",
    stock: 27,
    deliveryDays: 3,
    reviews: [
      { id: "r10", author: "VaporDreams", rating: 5, comment: "So aesthetic! Matches my whole vibe.", date: "2024-01-16" },
      { id: "r11", author: "SunsetRider", rating: 4, comment: "Beautiful colors, but attracts fingerprints.", date: "2024-01-09" },
    ],
  },
  {
    id: "case-minimal-006",
    name: "Void Drop",
    price: 40.0,
    image: "/cases/minimal.png",
    supportedModels: ["iPhone 14", "Pixel 8"],
    description: "Stare into the void and let it stare back. This deep black minimalist design features subtle geometric patterns that only reveal themselves at certain angles. Premium silicone material with shock-absorbing corners.",
    stock: 41,
    deliveryDays: 2,
    reviews: [
      { id: "r12", author: "DarkAesthetic", rating: 5, comment: "Mysterious and elegant. Love the hidden patterns.", date: "2024-01-15" },
      { id: "r13", author: "ProtectionFirst", rating: 5, comment: "Dropped my phone multiple times, not a scratch!", date: "2024-01-07" },
      { id: "r14", author: "StealthMode", rating: 4, comment: "Great case, but wish it was slightly thinner.", date: "2024-01-03" },
    ],
  },
];
