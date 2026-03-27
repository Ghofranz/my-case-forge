import { create } from 'zustand';

interface EcoStore {
  ecoMode: boolean;
  toggleEcoMode: () => void;
}

export const useEcoStore = create<EcoStore>((set) => ({
  ecoMode: false,
  toggleEcoMode: () => set((state) => ({ ecoMode: !state.ecoMode })),
}));
