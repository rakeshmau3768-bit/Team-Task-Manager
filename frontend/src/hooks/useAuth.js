import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMe,
  login as loginService,
  logout as logoutService,
  signup as signupService,
} from "../services/auth.service";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { setAuth, clearAuth, user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await getMe();
      setAuth(res.data.data, useAuthStore.getState().accessToken);
      return res.data.data;
    },
    enabled: useAuthStore.getState().isAuthenticated,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: (res) => {
      const userData = res.data.data.user;
      setAuth(userData, res.data.data.accessToken);
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Login failed");
    },
  });

  const signupMutation = useMutation({
    mutationFn: signupService,
    onSuccess: (res) => {
      const userData = res.data.data.user;
      setAuth(userData, res.data.data.accessToken);
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Signup failed");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login");
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
    loginLoading: loginMutation.isPending,
    signupLoading: signupMutation.isPending,
  };
};