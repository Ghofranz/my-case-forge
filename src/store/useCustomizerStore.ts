import { create } from 'zustand';

export interface LayerItem {
  id: string;
  type: string;
  name: string;
  locked: boolean;
  opacity: number;
  visible: boolean;
}

export interface CartItem {
  id: string;
  phoneModel: string;
  designName: string;
  previewImage: string; // Base64 Data URL
  price: number;
}

export interface CommunityDesign {
  id: string;
  phoneModel: string;
  designName: string;
  previewImage: string;
  likes: number;
  author: string;
  isPublic: boolean;
}

interface CustomizerState {
  // Application Nav / State
  phoneModel: string;
  setPhoneModel: (model: string) => void;
  activeTab: 'colors' | 'text' | 'images' | 'stickers';
  setActiveTab: (tab: 'colors' | 'text' | 'images' | 'stickers') => void;
  
  // Fabric Layers
  layers: LayerItem[];
  setLayers: (layers: LayerItem[]) => void;
  canUndo: boolean;
  setCanUndo: (val: boolean) => void;
  canRedo: boolean;
  setCanRedo: (val: boolean) => void;
  caseColor: string;
  setCaseColor: (color: string) => void;

  // E-Commerce Data
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  // Community Vault Mock Data
  communityVault: CommunityDesign[];
  publishToVault: (design: CommunityDesign) => void;
  upvoteDesign: (id: string) => void;
}

export const useCustomizerStore = create<CustomizerState>((set) => ({
  phoneModel: 'iPhone 15 Pro',
  setPhoneModel: (model) => set({ phoneModel: model }),
  activeTab: 'colors',
  setActiveTab: (tab) => set({ activeTab: tab }),
  layers: [],
  setLayers: (layers) => set({ layers }),
  canUndo: false,
  setCanUndo: (val) => set({ canUndo: val }),
  canRedo: false,
  setCanRedo: (val) => set({ canRedo: val }),
  caseColor: '#EFEFEF',
  setCaseColor: (color) => set({ caseColor: color }),

  // Cart Logic
  cart: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
  clearCart: () => set({ cart: [] }),

  // Vault Logic (Seed with some competitive hype data)
  communityVault: [
    { id: '1', phoneModel: 'iPhone 15 Pro', designName: 'Cyber Demon', previewImage: '/cyber_demon.png', likes: 1420, author: 'AlexZ', isPublic: true },
    { id: '2', phoneModel: 'Samsung S24 Ultra', designName: 'Pastel Sunrise', previewImage: '/pastel_sunrise.png', likes: 934, author: 'SarahM', isPublic: true },
    { id: '3', phoneModel: 'Pixel 8 Pro', designName: 'Vaporwave Grid', previewImage: '/vaporwave_grid.png', likes: 2150, author: 'NeoTokyo', isPublic: true },
  ],
  publishToVault: (design) => set((state) => ({ communityVault: [design, ...state.communityVault] })),
  upvoteDesign: (id) => set((state) => ({
    communityVault: state.communityVault.map((d) => 
      d.id === id ? { ...d, likes: d.likes + 1 } : d
    ).sort((a,b) => b.likes - a.likes)
  })),
}));
