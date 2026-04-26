import { create } from 'zustand';

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addresses: Address[];
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  addresses: Address[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

// Mock user data
const mockUser: User = {
  id: 'user-001',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+216 12 345 678',
  addresses: [
    {
      id: 'addr-001',
      label: 'Home',
      street: '123 Avenue Habib Bourguiba',
      city: 'Tunis',
      state: 'Tunis',
      zipCode: '1000',
      country: 'Tunisia',
      isDefault: true,
    },
    {
      id: 'addr-002',
      label: 'Work',
      street: '456 Les Berges du Lac',
      city: 'Tunis',
      state: 'Tunis',
      zipCode: '1053',
      country: 'Tunisia',
      isDefault: false,
    },
  ],
  createdAt: '2024-01-01T00:00:00Z',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  addresses: mockUser.addresses,

  login: async (email: string, password: string) => {
    // Mock login - in production, this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email && password) {
      set({ user: mockUser, isAuthenticated: true });
      return true;
    }
    return false;
  },

  signup: async (email: string, password: string, firstName: string, lastName: string) => {
    // Mock signup - in production, this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email && password && firstName && lastName) {
      const newUser: User = {
        ...mockUser,
        email,
        firstName,
        lastName,
      };
      set({ user: newUser, isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: (data: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },

  addAddress: (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    set((state) => {
      const newAddresses = [
        ...(state.addresses || []).map(a => ({ ...a, isDefault: false })),
        newAddress,
      ];
      return {
        addresses: newAddresses,
        user: state.user
          ? {
              ...state.user,
              addresses: newAddresses,
            }
          : null,
      };
    });
  },

  removeAddress: (id: string) => {
    set((state) => {
      const newAddresses = (state.addresses || []).filter(a => a.id !== id);
      return {
        addresses: newAddresses,
        user: state.user
          ? {
              ...state.user,
              addresses: newAddresses,
            }
          : null,
      };
    });
  },

  setDefaultAddress: (id: string) => {
    set((state) => {
      const newAddresses = (state.addresses || []).map(a => ({
        ...a,
        isDefault: a.id === id,
      }));
      return {
        addresses: newAddresses,
        user: state.user
          ? {
              ...state.user,
              addresses: newAddresses,
            }
          : null,
      };
    });
  },
}));