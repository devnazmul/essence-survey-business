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
  filters: any = {},
) => {
  try {
    const params: any = {
      page,
      per_page: limit,
      businessId, // most endpoints need this
    };

    // Map Filters to Swagger-compliant keys
    if (filters.period) params.period = filters.period;

    // Sort Mapping: desc -> newest, asc -> oldest
    if (filters.sort_order) {
      params.sort_order = filters.sort_order === "desc" ? "newest" : "oldest";
    }

    // Rating Mapping: UI 'rating' (number) -> 'star_ids' (string)
    if (filters.rating) {
      params.rating = filters.rating.toString();
    }

    // Flagged Mapping: UI 'flagged_reviews' (1=Flagged, 0=Satisfied) -> 'meets_threshold' (0=Flagged, 1=Satisfied)
    if (filters.flagged_reviews !== undefined) {
      params.flagged_reviews =
        filters.flagged_reviews.toString() === "1" ? 0 : 1;
    }

    // Other simple mappings
    if (filters.is_overall !== undefined)
      params.is_overall = filters.is_overall;
    if (filters.is_voice_review !== undefined)
      params.is_voice_review = filters.is_voice_review;

    // Staff & Branch
    if (filters.branch_ids) params.branch_ids = filters.branch_ids.toString();
    if (filters.staff_id) params.staff_id = filters.staff_id;

    // Survey Mapping: survey_id -> survey_ids
    if (filters.survey_id) params.survey_id = filters.survey_id.toString();

    // Search Mapping
    if (filters.search) {
      params.search_key = filters.search;
    }

    // Date Range Mapping
    if (filters.start_date) {
      params.start_date = filters.start_date;
    }
    if (filters.end_date) {
      params.end_date = filters.end_date;
    }

    const response = await axiosPrivate.get(`/v1.0/reviews`, {
      params,
    });
    return response.data;
  } catch (error) {
    apiErrorHandler(error);
    throw error; // Rethrow so React Query knows it failed
  }
};
