import { axiosPrivate } from "@/utils/axiosInstance";

export const getDashboardMetrics = async (period?: string, type?: string) => {
  const url = `/v1.0/dashboard/metrics${period === "all_time" ? "" : `?period=${period}`}${type === "overall_type" ? `&is_overall=1` : `${type === "survey_type" ? `&is_overall=0` : ""}`}`;
  const response = await axiosPrivate.get(url);

  return response.data;
};
export const getDashboardData = async (
  businessId: string | number,
  period?: string,
) => {
  const url = `/v1.0/reviews/overall-dashboard/${businessId}${
    period ? `?period=${period}` : ""
  }`;
  const response = await axiosPrivate.get(url);

  return response.data;
};

export const getReviewTrends = async (
  businessId: string | number,
  period?: string,
  activeTypeTab?: string,
) => {
  const url = `/v1.0/review-trends/${businessId}${
    period ? `?period=${period}` : ""
  }${activeTypeTab === "overall_type" ? `&is_overall=1` : `${activeTypeTab === "survey_type" ? `&is_overall=0` : ""}`}`;
  const response = await axiosPrivate.get(url);

  return response.data;
};

export const getDashboardOverview = async (
  businessId: string | number,
  period: string = "all_time",
) => {
  const url = `/v1.0/dashboard/overview?period=${period}&is_overall=1&businessId=${businessId}`;
  const response = await axiosPrivate.get(url);

  return response.data;
};

export const getDashboardAIInsights = async (
  period?: string,
  type?: string,
) => {
  const url = `/v1.0/dashboard/ai-insights${period === "all_time" ? "" : `?period=${period}`}${type === "overall_type" ? `&is_overall=1` : `${type === "survey_type" ? `&is_overall=0` : ""}`}`;
  const response = await axiosPrivate.get(url);

  return response.data;
};

export const getUnifiedDashboard = async (period?: string, type?: string) => {
  const url = `/v1.0/dashboard/unified${period ? `?period=${period}` : ""}${type === "overall_type" ? `&is_overall=1` : type === "survey_type" ? `&is_overall=0` : ""}`;
  const response = await axiosPrivate.get(url);

  return response.data;
};
