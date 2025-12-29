import { useAuthStore } from "@/store/useAuthStore";
import axiosPublic from "@/utils/axiosInstance";

export const login = async (data: any) => {
  // LOGIN CUSTOMER
  const response = await axiosPublic.post(`/auth`, data);
  const { user, token } = response.data;

  if (user && token) {
    useAuthStore.getState().setAuth(user, token);
  }

  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axiosPublic.post(`/v1.0/forgot-password`, { email });
  return response.data;
};
