import { getNotification } from "@/api/notification";
import { useInfiniteQuery } from "@tanstack/react-query";
import moment from "moment";

export const useNotifications = (perPage: number = 20, status?: string) => {
  const query = useInfiniteQuery({
    queryKey: ["notifications", status],
    queryFn: ({ pageParam = 1 }) =>
      getNotification({ page: pageParam as number, perPage, status }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, total_pages } = lastPage?.meta || {};
      if (current_page < total_pages) {
        return current_page + 1;
      }
      return undefined;
    },
  });

  const notifications =
    query.data?.pages.flatMap((page) => {
      return (page?.data || []).map((item: any) => {
        // Handle dates - if created_at is missing, use ID as fallback for sorting
        // but we need a date for grouping.
        const date = item.created_at || new Date().toISOString();
        const mDate = moment(date);

        let dateGroup: "Today" | "Yesterday" | "Earlier" = "Earlier";
        if (mDate.isSame(moment(), "day")) {
          dateGroup = "Today";
        } else if (mDate.isSame(moment().subtract(1, "day"), "day")) {
          dateGroup = "Yesterday";
        }

        return {
          id: item.id.toString(),
          title: item.title,
          description: item.message,
          time: mDate.fromNow(),
          isRead: item.status === "read",
          type: item.type === "new_review" ? "review" : "update", // update for low_rating or other
          originalType: item.type,
          entityId: item.entity_id,
          dateGroup,
        };
      });
    }) || [];

  return {
    notifications,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    isRefreshing: query.isFetching && !query.isFetchingNextPage,
  };
};
