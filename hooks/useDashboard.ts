import { getDashboardData } from "@/api/dashboard";
import { useAuthStore } from "@/store/useAuthStore";
import { useBusinessStore } from "@/store/useBusinessStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useDashboard = () => {
  const { user, logout } = useAuthStore();
  const setDashboardData = useBusinessStore((state) => state.setDashboardData);
  const setLoading = useBusinessStore((state) => state.setLoading);

  // Get business ID from business object or first business in the array
  const businessId = user?.business?.id || user?.business?.[0]?.id;

  const query = useQuery({
    queryKey: ["dashboard", businessId],
    queryFn: () => getDashboardData(businessId),
    enabled: !!businessId, // Only fetch if businessId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (query.error) {
      console.log("useDashboard error:", query.error);
      // logout();
    }
  }, [query.error]);

  // Update store when data changes
  useEffect(() => {
    if (query.data?.data) {
      const structuredData = {
        stats: {
          avgRating: {
            value: query.data.data?.metrics?.avg_overall_rating?.value,
            change: query.data.data?.metrics?.avg_overall_rating?.change,
          },
          totalReviews: {
            value: query.data.data?.metrics?.total_reviews?.value,
            change: query.data.data?.metrics?.total_reviews?.change,
          },
          staffLinkedReviews: {
            value: query.data.data?.metrics?.staff_linked_reviews?.count,
            change: query.data.data?.metrics?.staff_linked_reviews?.change,
            percentage:
              query.data.data?.metrics?.staff_linked_reviews?.percentage,
            total: query.data.data?.metrics?.staff_linked_reviews?.total,
          },
        },
        reviews: query.data.data.review_feed?.map(
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
          }: {
            id: string | number;
            author: string;
            comment: string | null;
            is_ai_flagged: boolean;
            is_voice: boolean;
            calculated_rating: string | number;
            sentiment: string;
            staff_name: string;
            tags: string[];
            time_ago: string;
          }) => ({
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
          })
        ),
        notifications: [],
      };

      setDashboardData(structuredData);
    }
  }, [query.data, setDashboardData]);

  // Sync loading state with business store
  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};
