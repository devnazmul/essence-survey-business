import { getReviews } from "@/api/review";
import { useAuthStore } from "@/store/useAuthStore";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useReviews = (limit: number = 20) => {
  const { user } = useAuthStore();
  const businessId = user?.business?.id || user?.business?.[0]?.id;

  const query = useInfiniteQuery({
    queryKey: ["reviews", businessId],
    queryFn: ({ pageParam = 1 }) =>
      getReviews(businessId, pageParam as number, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Assuming the API returns a standard pagination object or we can check the length
      // If the last page has less items than the limit, there are no more pages
      const reviewsFeed = lastPage?.data?.review_feed || [];
      if (reviewsFeed.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled: !!businessId,
  });

  const reviews =
    query.data?.pages.flatMap((page) => {
      return (page?.data?.review_feed || []).map(
        ({
          id,
          author,
          comment,
          is_ai_flagged,
          is_voice,
          sentiment,
          staff_name,
          tags,
          time_ago,
          calculated_rating,
          responded_at,
        }: any) => ({
          id,
          customerName: author,
          date: time_ago,
          rating: calculated_rating,
          comment,
          tags,
          staff_name,
          sentiment,
          is_ai_flagged,
          is_voice,
          responded_at,
        })
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
