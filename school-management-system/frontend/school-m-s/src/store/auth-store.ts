"use client";

import { create } from "zustand";
import { authService } from "@/services/auth.service";
import { setToken, removeToken, getUserRole } from "@/lib/auth";

interface AuthState {
  user: any;
  role: string | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });

    const res = await authService.login({ email, password });

    setToken(res.access_token);

    set({
      user: res.user,
      role: res.user.role || getUserRole(),
      loading: false,
    });
  },

  register: async (data) => {
    set({ loading: true });

    await authService.register(data);

    set({ loading: false });
  },

  logout: () => {
    removeToken();
    set({ user: null, role: null });
  },
}));