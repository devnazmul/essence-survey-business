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
