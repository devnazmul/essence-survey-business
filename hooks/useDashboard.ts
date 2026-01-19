import {
  getDashboardMetrics,
  getDashboardRecentReviews,
} from "@/api/dashboard";
import { useAuthStore } from "@/store/useAuthStore";
import { useBusinessStore } from "@/store/useBusinessStore";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

export const useDashboardMetrics = (period?: string) => {
  const { user } = useAuthStore();
  const setDashboardStats = useBusinessStore(
    (state) => state.setDashboardStats,
  );
  const setLoading = useBusinessStore((state) => state.setLoading);

  // Get business ID from business object or first business in the array
  const businessId = user?.business?.id || user?.business?.[0]?.id;

  const dashboardMetricsQuery = useQuery({
    queryKey: ["dashboard-metrics", period],
    queryFn: () => getDashboardMetrics(period),
    enabled: !!businessId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (dashboardMetricsQuery.error) {
      console.log("useDashboard error:", dashboardMetricsQuery.error);
    }
  }, [dashboardMetricsQuery.error]);

  // Compute structured data
  const structuredData = React.useMemo(() => {
    if (!dashboardMetricsQuery.data?.data) return null;

    const data = dashboardMetricsQuery.data.data;
    console.log(data);

    return {
      stats: {
        sentimentScore: {
          value: data?.ai_sentiment_score?.value,
          max: data?.ai_sentiment_score?.max,
          change: data?.ai_sentiment_score?.change,
        },
        avgRating: {
          value: data?.avg_overall_rating?.value,
          change: data?.avg_overall_rating?.change,
        },
        totalReviews: {
          value: data?.total_reviews?.value,
          change: data?.total_reviews?.change,
          total: data?.total_reviews?.value,
        },
        staffLinkedReviews: {
          value: data?.staff_linked_reviews?.count,
          change: 0,
          percentage: data?.staff_linked_reviews?.percentage,
          total: data?.staff_linked_reviews?.total,
        },
        aiSentiment: {
          value: data?.all_sentiment?.status || "Neutral",
          change: 0,
          subTitle: data?.all_sentiment?.based_on || "Based on selected period",
        },
        topTopic: {
          value: data?.top_topic?.top_topic || "N/A",
          count: data?.top_topic?.top_topic_count || 0,
          subTitle: data?.top_topic?.top_topic_count
            ? `Mentioned in ${data.top_topic.top_topic_count} reviews`
            : "",
        },
        flagged: {
          value: data?.flagged_reviews?.count || 0,
          change: 0,
        },
        csatScore: {
          value: data?.csat_score?.percentage || 0,
          change: data?.csat_score?.percentage_change || 0,
        },
        repeatIssue: {
          value: data?.repeated_issues?.top_issue || "N/A",
          subTitle: data?.repeated_issues?.top_issue_details
            ? `${data.repeated_issues.top_issue_details.occurrence_count} occurrences`
            : "Recurring problems",
        },
        ratingBreakdown: {
          breakdown: {
            exact_ratings: {
              5: data?.rating_distribution?.["5_star"] || 0,
              4: data?.rating_distribution?.["4_star"] || 0,
              3: data?.rating_distribution?.["3_star"] || 0,
              2: data?.rating_distribution?.["2_star"] || 0,
              1: data?.rating_distribution?.["1_star"] || 0,
            },
          },
        },
      },
      notifications: [],
    };
  }, [dashboardMetricsQuery.data]);

  // Update store when data changes
  useEffect(() => {
    if (structuredData) {
      setDashboardStats(structuredData.stats);
    }
  }, [structuredData, setDashboardStats]);

  // Sync loading state with business store
  useEffect(() => {
    setLoading(dashboardMetricsQuery.isLoading);
  }, [dashboardMetricsQuery.isLoading, setLoading]);

  return {
    data: dashboardMetricsQuery.data,
    isLoading: dashboardMetricsQuery.isLoading,
    error: dashboardMetricsQuery.error,
    refetch: async () => {
      await dashboardMetricsQuery.refetch();
    },
  };
};

export const useDashboardReviews = (period?: string) => {
  const setDashboardReviews = useBusinessStore(
    (state) => state.setDashboardReviews,
  );
  const setLoading = useBusinessStore((state) => state.setLoading);

  const dashboardQuery = useQuery({
    queryKey: ["dashboard-reviews", period],
    queryFn: () => getDashboardRecentReviews(period),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (dashboardQuery.error) {
      console.log("useDashboardReviews error:", dashboardQuery.error);
    }
  }, [dashboardQuery.error]);

  // Compute structured data
  const structuredData = React.useMemo(() => {
    if (!dashboardQuery.data?.data) return null;

    const data = dashboardQuery.data.data;

    console.log("s", data);

    return {
      reviews: data?.map((item: any) => ({
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
  }, [dashboardQuery.data]);

  // Update store when data changes
  useEffect(() => {
    if (structuredData?.reviews) {
      console.log({ structuredData });

      setDashboardReviews(structuredData.reviews);
    }
  }, [structuredData, setDashboardReviews]);

  // Sync loading state with business store
  useEffect(() => {
    setLoading(dashboardQuery.isLoading);
  }, [dashboardQuery.isLoading, setLoading]);

  return {
    data: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    error: dashboardQuery.error,
    refetch: async () => {
      await dashboardQuery.refetch();
    },
  };
};
