export interface CaseProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  supportedModels: string[];
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
  },
  {
    id: "case-retro-002",
    name: "Arcade 99",
    price: 30.0,
    image: "/cases/retro.png",
    supportedModels: ["iPhone 14", "iPhone 15 Pro", "Pixel 8"],
  },
  {
    id: "case-minimal-003",
    name: "Brutalist Matte",
    price: 40.0,
    image: "/cases/minimal.png",
    supportedModels: ["iPhone 15 Pro", "Galaxy S24", "Pixel 8"],
  },
  {
    id: "case-cyber-004",
    name: "Cyber Neon V2",
    price: 35.0,
    image: "/cases/cyber.png", // Reusing image for mock density
    supportedModels: ["iPhone 14"],
  },
  {
    id: "case-retro-005",
    name: "Synthwave Sunset",
    price: 30.0,
    image: "/cases/retro.png",
    supportedModels: ["iPhone 15 Pro", "Galaxy S24"],
  },
  {
    id: "case-minimal-006",
    name: "Void Drop",
    price: 40.0,
    image: "/cases/minimal.png",
    supportedModels: ["iPhone 14", "Pixel 8"],
  },
];
