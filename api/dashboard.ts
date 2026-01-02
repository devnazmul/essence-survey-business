import { axiosPrivate } from "@/utils/axiosInstance";

export const getDashboardData = async (
  businessId: string | number,
  period?: string
) => {
  const url = `/v1.0/reviews/overall-dashboard/${businessId}${period ? `?period=${period}` : ""}`;
  const response = await axiosPrivate.get(url);

  return response.data;
};

export const getReviewTrends = async (
  businessId: string | number,
  period?: string
) => {
  const url = `/v1.0/review-trends/${businessId}${period ? `?period=${period}` : ""}`;
  const response = await axiosPrivate.get(url);

  return response.data;
};
