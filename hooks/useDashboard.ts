import { getDashboardData, getDashboardOverview } from "@/api/dashboard";
import { useAuthStore } from "@/store/useAuthStore";
import { useBusinessStore } from "@/store/useBusinessStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useDashboard = (period?: string) => {
  const { user } = useAuthStore();
  const setDashboardData = useBusinessStore((state) => state.setDashboardData);
  const setLoading = useBusinessStore((state) => state.setLoading);

  // Get business ID from business object or first business in the array
  const businessId = user?.business?.id || user?.business?.[0]?.id;

  const dashboardQuery = useQuery({
    queryKey: ["dashboard", businessId, period],
    queryFn: () => getDashboardData(businessId, period),
    enabled: !!businessId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const overviewQuery = useQuery({
    queryKey: ["dashboard-overview", businessId],
    queryFn: () => getDashboardOverview(businessId),
    enabled: !!businessId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (dashboardQuery.error) {
      console.log("useDashboard error:", dashboardQuery.error);
    }
  }, [dashboardQuery.error]);

  // Update store when data changes
  useEffect(() => {
    if (dashboardQuery.data?.data) {
      const data = dashboardQuery.data.data;

      const metrics = data.metrics;
      const filters = data.filters;
      const allSentiment = data.all_sentiment || data.all_sentiments;
      const overviewData = overviewQuery.data?.data;

      const structuredData = {
        stats: {
          sentimentScore: {
            value: metrics?.ai_sentiment_score?.value,
            max: metrics?.ai_sentiment_score?.max,
            change: metrics?.ai_sentiment_score?.change,
          },
          avgRating: {
            value: metrics?.avg_overall_rating?.value,
            change: metrics?.avg_overall_rating?.change,
          },
          totalReviews: {
            value: metrics?.total_reviews?.value,
            change: metrics?.total_reviews?.percentage_change,
          },
          staffLinkedReviews: {
            value: metrics?.staff_linked_reviews?.count,
            change: metrics?.staff_linked_reviews?.change,
            percentage: metrics?.staff_linked_reviews?.percentage,
            total: metrics?.staff_linked_reviews?.total,
          },
          aiSentiment: {
            value: filters?.ai_sentiment?.[1] || "Neutral",
            change: 0,
            subTitle:
              allSentiment?.based_on ||
              overviewData?.all_sentiment?.based_on ||
              "",
          },
          topTopic: {
            value: metrics?.top_topic?.top_topic || "N/A",
            count: metrics?.top_topic?.top_topic_count || 0,
            subTitle: metrics?.top_topic?.top_topic_count
              ? `Mentioned in ${metrics.top_topic.top_topic_count} reviews`
              : "",
          },
          flagged: {
            value:
              overviewData?.flagged_reviews?.count ||
              data?.ai_insights_panel?.detected_issues?.length ||
              0,
            change: 0,
          },
          csatScore: {
            value: overviewData?.csat_score?.percentage || 0,
            change: overviewData?.csat_score?.percentage_change || 0,
          },
          repeatIssue: {
            value: metrics?.repeated_issues?.top_issue || "N/A",
            subTitle:
              metrics?.repeated_issues?.description || "Recurring problems",
          },
          ratingBreakdown: data?.rating_breakdown || {},
        },
        reviews: dashboardQuery.data.data.review_feed?.map((item: any) => ({
          id: item.id,
          customerName: item.author,
          date: item.time_ago,
          rating: item.calculated_rating,
          comment: item.comment,
          tags: item.tags,
          staff_name: item.staff_name,
          sentiment: item.sentiment,
          is_ai_flagged: item.is_ai_flagged,
          is_voice: item.is_voice,
          responded_at: item.responded_at,
        })),
        notifications: [],
      };

      setDashboardData(structuredData);
    }
  }, [dashboardQuery.data, overviewQuery.data, setDashboardData]);

  // Sync loading state with business store
  useEffect(() => {
    setLoading(dashboardQuery.isLoading || overviewQuery.isLoading);
  }, [dashboardQuery.isLoading, overviewQuery.isLoading, setLoading]);

  return {
    data: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading || overviewQuery.isLoading,
    error: dashboardQuery.error || overviewQuery.error,
    refetch: async () => {
      await dashboardQuery.refetch();
      await overviewQuery.refetch();
    },
  };
};
