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
    const params: any = {
      page,
      limit,
      ...filters,
    };

    if (filters.search) {
      params.search_key = filters.search;
      delete params.search;
    }

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
