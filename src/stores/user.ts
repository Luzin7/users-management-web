import { create } from "zustand";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string | null;
  lastLoginAt: string | null;
  isActive?: string
};

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (user) =>
    set((state) => ({
      user: { ...state.user, ...user } as User,
    })),
  clearUser: () => set({ user: null }),
}));
