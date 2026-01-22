import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const { user, token, setUser, setToken, logout } = useAuthStore();

  const isAuthenticated = !!token;

  return {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    logout,
  };
}
