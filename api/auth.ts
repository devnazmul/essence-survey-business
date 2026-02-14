import { useAuthStore } from "@/store/useAuthStore";
import axiosPublic, { axiosPrivate } from "@/utils/axiosInstance";

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

export const changePassword = async (data: {
  user_id: number;
  current_password: string;
  new_password: string;
}) => {
  const response = await axiosPrivate.patch("/v1.0/auth/change-password", data);
  return response.data;
};

export const checkUserEmail = async (data: {
  email: string;
  ignore_user_id?: number | string;
}) => {
  if (!data?.email) return { success: true, data: false };
  const response = await axiosPrivate.post(`/v1.0/auth/check-user-email`, data);
  return response.data;
};
