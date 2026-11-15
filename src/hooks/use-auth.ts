"use client";

import { create } from "zustand";
import type { User, LoginFormData, RegisterFormData } from "@/types/auth";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
} from "@/services/auth.service";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  initialized: boolean;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  login: (payload: LoginFormData) => Promise<User>;
  register: (payload: RegisterFormData) => Promise<User>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  initialized: false,
  isAuthenticated: false,

  initialize: async () => {
    try {
      set({ isLoading: true });
      const user = await getCurrentUser();
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        initialized: true,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        initialized: true,
      });
    }
  },

  login: async (payload: LoginFormData) => {
    set({ isLoading: true });
    try {
      const { user } = await loginUser(payload);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        initialized: true,
      });
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (payload: RegisterFormData) => {
    set({ isLoading: true });
    try {
      const { user } = await registerUser(payload);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        initialized: true,
      });
      return user;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutUser();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  setUser: (user: User | null) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
}));
