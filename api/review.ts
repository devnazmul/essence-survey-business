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
