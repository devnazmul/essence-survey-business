import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  popupOption: any;
  setPopupOption: (data: any) => void;
  setUser: (data: any) => void;
  setAuth: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      popupOption: null,
      setPopupOption: (data) =>
        set((state) => ({
          popupOption:
            typeof data === "function" ? data(state.popupOption) : data,
        })),
      setUser: (data) => set({ user: data }),
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
