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
      per_page: limit,
      ...filters,
    };

    // Mapping search to search_key just in case, though we will try to use search_key directly in UI
    if (filters.search) {
      params.search_key = filters.search;
      delete params.search;
    }

    const response = await axiosPrivate.get(`/v1.0/reviews`, {
      params,
    });
    return response.data;
  } catch (error) {
    apiErrorHandler(error);
  }
};
