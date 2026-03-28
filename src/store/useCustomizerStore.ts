import { create } from 'zustand';

export interface LayerItem {
  id: string;
  type: string;
  name: string;
  locked: boolean;
  opacity: number;
  visible: boolean;
}

interface CustomizerState {
  phoneModel: string;
  setPhoneModel: (model: string) => void;
  activeTab: 'colors' | 'text' | 'images' | 'stickers';
  setActiveTab: (tab: 'colors' | 'text' | 'images' | 'stickers') => void;
  layers: LayerItem[];
  setLayers: (layers: LayerItem[]) => void;
  canUndo: boolean;
  setCanUndo: (val: boolean) => void;
  canRedo: boolean;
  setCanRedo: (val: boolean) => void;
  caseColor: string;
  setCaseColor: (color: string) => void;
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
}));
