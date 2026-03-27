import { create } from 'zustand';

export type ToolTab = 'colors' | 'text' | 'images' | 'stickers';

export interface LayerItem {
  id: string;
  type: string;
  name: string;
  locked: boolean;
  opacity: number;
}

interface CustomizerState {
  phoneModel: string;
  setPhoneModel: (model: string) => void;
  activeTab: ToolTab;
  setActiveTab: (tab: ToolTab) => void;
  layers: LayerItem[];
  setLayers: (layers: LayerItem[]) => void;
  canUndo: boolean;
  setCanUndo: (val: boolean) => void;
  canRedo: boolean;
  setCanRedo: (val: boolean) => void;
  lastSavedAt: string | null;
  setLastSavedAt: (time: string) => void;
}

export const useCustomizerStore = create<CustomizerState>((set) => ({
  phoneModel: 'iPhone 15 Pro',
  setPhoneModel: (model) => set({ phoneModel: model }),
  activeTab: 'colors',
  setActiveTab: (tab) => set({ activeTab: tab }),
  layers: [],
  setLayers: (layers) => set({ layers }),
  canUndo: false,
  setCanUndo: (canUndo) => set({ canUndo }),
  canRedo: false,
  setCanRedo: (canRedo) => set({ canRedo }),
  lastSavedAt: null,
  setLastSavedAt: (time) => set({ lastSavedAt: time }),
}));
