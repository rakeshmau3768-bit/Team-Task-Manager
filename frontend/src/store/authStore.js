import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isAdmin: false,
      setAuth: (user, accessToken) => set({
        user,
        accessToken,
        isAuthenticated: true,
        isAdmin: user?.role === "admin",
      }),
      clearAuth: () => set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isAdmin: false,
      }),
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;