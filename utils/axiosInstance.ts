import axios, { AxiosError, AxiosResponse } from "axios";

const axiosPublic = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BASE_URL}/api`,
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

export default axiosPublic;
