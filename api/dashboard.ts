import { axiosPrivate } from "@/utils/axiosInstance";

export const getDashboardData = async (businessId: string | number) => {
  const response = await axiosPrivate.get(
    `/v1.0/reviews/overall-dashboard/${businessId}`
  );

  return response.data;
};
