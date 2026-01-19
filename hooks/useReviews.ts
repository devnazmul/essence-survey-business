import { getReviews } from "@/api/review";
import { useAuthStore } from "@/store/useAuthStore";
import { getFullName } from "@/utils/getFullName";
import { useInfiniteQuery } from "@tanstack/react-query";
import moment from "moment";

export const useReviews = (limit: number = 20, filters: any = {}) => {
  const { user } = useAuthStore();
  const businessId = user?.business?.id || user?.business?.[0]?.id;

  const query = useInfiniteQuery({
    queryKey: ["reviews", businessId, filters], // Add filters to queryKey
    queryFn: ({ pageParam = 1 }) =>
      getReviews(businessId, pageParam as number, limit, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Assuming the API returns a standard pagination object or we can check the length
      // If the last page has less items than the limit, there are no more pages
      const reviewsFeed = Array.isArray(lastPage?.data)
        ? lastPage.data
        : lastPage?.data?.review_feed || [];
      if (reviewsFeed.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled: !!businessId,
  });

  const reviews =
    query.data?.pages.flatMap((page) => {
      const reviewData = Array.isArray(page?.data)
        ? page.data
        : page?.data?.review_feed || [];

      return reviewData.map(
        ({
          id,
          guest_user,
          comment,
          is_ai_flagged,
          is_voice,

          staff_name,
          tags,
          topics, // Add topics as fallback
          created_at,
          calculated_rating,
          responded_at,
          user_id,
          user: customer,
          is_voice_review,
          sentiment_label: sentiment,
          status,
        }: any) => ({
          id,
          customerName: user_id ? getFullName(customer) : guest_user?.full_name,
          date: moment(created_at, "DD-MM-YYYY HH:mm:ss").fromNow(),
          rating: calculated_rating,
          comment,
          tags: tags || topics || [],
          staff_name,
          is_ai_flagged,
          is_voice,
          responded_at,
          is_voice_review,
          sentiment,
          status,
        }),
      );
    }) || [];

  return {
    reviews,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    isRefreshing: query.isFetching && !query.isFetchingNextPage,
  };
};
