import { apiErrorHandler } from "@/utils/apiErrorHandler";
import { axiosPrivate } from "@/utils/axiosInstance";

export const getAnalyticsData = async (
  businessId: string | number,
  period: string = "last_30_days",
  start_date?: string,
  end_date?: string
) => {
  try {
    const params: any = {
      businessId,
      period,
    };
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;

    const response = await axiosPrivate.get(
      `/v1.0/dashboard/insights-overview`,
      {
        params,
      }
    );
    return response.data.data;
  } catch (error) {
    apiErrorHandler(error);
  }
};
