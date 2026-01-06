import { useAuthStore } from "@/store/useAuthStore";
import { toastEmitter } from "@/utils/toastEmitter";
import axios, { AxiosError, AxiosResponse } from "axios";

const axiosPublic = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosPrivate = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: add interceptors only if you need logging or unified error formatting
axiosPublic.interceptors.request.use(
  (config: any) => {
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosPublic.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => Promise.reject(error)
);

axiosPrivate.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Optional: Handle 401 Unauthorized (e.g., logout)
    if (error.response?.status === 401) {
      toastEmitter.show({
        type: "error",
        message: "Logged out due to expired token.",
      });
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export { axiosPrivate };
export default axiosPublic;
