import { axiosPrivate } from "@/utils/axiosInstance";

export const getDashboardMetrics = async (period?: string) => {
  const url = `/v1.0/dashboard/metrics${period ? `?period=${period}` : ""}`;
  const response = await axiosPrivate.get(url);

  return response.data;
};
export const getDashboardData = async (
  businessId: string | number,
  period?: string
) => {
  const url = `/v1.0/reviews/overall-dashboard/${businessId}${
    period ? `?period=${period}` : ""
  }`;
  const response = await axiosPrivate.get(url);

  return response.data;
};

export const getDashboardRecentReviews = async (period?: string) => {
  const url = `/v1.0/dashboard/recent-reviews${
    period ? `?period=${period}` : ""
  }`;
  const response = await axiosPrivate.get(url);

  return response.data;
};

export const getReviewTrends = async (
  businessId: string | number,
  period?: string
) => {
  const url = `/v1.0/review-trends/${businessId}${
    period ? `?period=${period}` : ""
  }`;
  const response = await axiosPrivate.get(url);

  return response.data;
};

export const getDashboardOverview = async (
  businessId: string | number,
  period: string = "all_time"
) => {
  const url = `/v1.0/dashboard/overview?period=${period}&is_overall=1&businessId=${businessId}`;
  const response = await axiosPrivate.get(url);

  return response.data;
};
