import { apiErrorHandler } from "@/utils/apiErrorHandler";
import { axiosPrivate } from "@/utils/axiosInstance";

export const singleReview = async (id: string) => {
  try {
    const response = await axiosPrivate.get(`/v1.0/review-new/${id}`);
    return response.data;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const respondToReview = async (id: string, responseText: string) => {
  try {
    const response = await axiosPrivate.put(`/v1.0/reviews/${id}/reply`, {
      reply_content: responseText,
    });
    return response.data;
  } catch (error) {
    apiErrorHandler(error);
  }
};

export const getReviews = async (
  businessId: string | number,
  page: number = 1,
  limit: number = 20,
  filters: any = {}
) => {
  try {
    const { status, sort_by, start_date, end_date, search } = filters;
    const params: any = {
      page,
      limit,
    };

    if (status) params.status = status;
    if (sort_by) params.sort_by = sort_by;
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;
    if (search) params.search_key = search; // API uses 'query' for search text based on image

    const response = await axiosPrivate.get(
      `/v1.0/reviews/overall-dashboard/${businessId}`,
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    apiErrorHandler(error);
  }
};
