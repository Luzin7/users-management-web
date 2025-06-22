import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  isInitialized: boolean;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  setInitialized: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isInitialized: false,
  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),
  setInitialized: () => set({ isInitialized: true }),
}));