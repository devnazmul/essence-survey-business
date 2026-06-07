import { getUnifiedDashboard } from "@/api/dashboard";
import { useAuthStore } from "@/store/useAuthStore";
import { useBusinessStore } from "@/store/useBusinessStore";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

export const useDashboard = (period?: string, type?: string) => {
  const { user } = useAuthStore();
  const setDashboardStats = useBusinessStore(
    (state) => state.setDashboardStats,
  );
  const setDashboardReviews = useBusinessStore(
    (state) => state.setDashboardReviews,
  );
  const setLoading = useBusinessStore((state) => state.setLoading);

  // Normalize period for unified API
  const normalizedPeriod = React.useMemo(() => {
    if (period === "7d") return "last_7_days";
    if (period === "30d") return "last_30_days";
    if (period === "90d") return "last_90_days";
    return period;
  }, [period]);

  // Get business ID from business object or first business in the array
  const businessId = user?.business?.id || user?.business?.[0]?.id;

  const dashboardQuery = useQuery({
    queryKey: ["dashboard-unified", normalizedPeriod, type],
    queryFn: () => getUnifiedDashboard(normalizedPeriod, type),
    enabled: !!businessId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // Compute structured data
  const structuredData = React.useMemo(() => {
    if (!dashboardQuery.data?.data) return null;

    const data = dashboardQuery.data.data;
    const metrics = data.metrics;
    const recent_reviews = data.recent_reviews;

    return {
      stats: {
        sentimentScore: {
          value: metrics?.ai_sentiment_score?.value,
          max: metrics?.ai_sentiment_score?.max,
          change: metrics?.ai_sentiment_score?.change,
        },
        allReviews: metrics?.all_reviews?.value || 0,
        avgRating: {
          value: metrics?.avg_overall_rating?.value,
          change: metrics?.avg_overall_rating?.change,
        },
        totalReviews: {
          value: metrics?.total_reviews?.value,
          change: metrics?.total_reviews?.change,
          total: metrics?.total_reviews?.value,
        },
        staffLinkedReviews: {
          value: metrics?.staff_linked_reviews?.count,
          change: 0,
          percentage: metrics?.staff_linked_reviews?.percentage,
          total: metrics?.staff_linked_reviews?.total,
        },
        aiSentiment: {
          value: metrics?.all_sentiment?.status || "Neutral",
          change: 0,
          subTitle: metrics?.all_sentiment?.based_on || "Based on selected period",
        },
        topTopic: {
          value: metrics?.top_topic?.name || "N/A",
          count: metrics?.top_topic?.count || 0,
          subTitle: metrics?.top_topic?.count
            ? `Mentioned in ${metrics.top_topic.count} reviews`
            : "",
        },
        flagged: {
          value: metrics?.flagged_reviews?.count || 0,
          change: 0,
          count: metrics?.flagged_reviews?.review_count || 0,
        },
        csatScore: {
          value: metrics?.csat_score?.percentage || 0,
          change: metrics?.csat_score?.percentage_change || 0,
        },
        repeatIssue: {
          value: metrics?.repeated_issues?.top_issue || "N/A",
          subTitle: metrics?.repeated_issues?.top_issue_details
            ? `${metrics.repeated_issues.top_issue_details.occurrence_count} occurrences`
            : "Recurring problems",
        },
        ratingBreakdown: metrics?.rating_breakdown || {
          breakdown: {
            exact_ratings: {
              5: metrics?.rating_distribution?.["5_star"] || 0,
              4: metrics?.rating_distribution?.["4_star"] || 0,
              3: metrics?.rating_distribution?.["3_star"] || 0,
              2: metrics?.rating_distribution?.["2_star"] || 0,
              1: metrics?.rating_distribution?.["1_star"] || 0,
            },
          },
        },
        boxes: data.boxes || [],
      },
      reviews: recent_reviews?.map((item: any) => ({
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
      })) || [],
      trends: data.review_trends || [],
      aiInsights: data.ai_insights || null,
    };
  }, [dashboardQuery.data]);

  // Update store when data changes
  useEffect(() => {
    if (structuredData) {
      setDashboardStats(structuredData.stats);
      setDashboardReviews(structuredData.reviews);
    }
  }, [structuredData, setDashboardStats, setDashboardReviews]);

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
    // Adding direct access to trends and insights for secondary hooks
    trends: structuredData?.trends || [],
    aiInsights: structuredData?.aiInsights || null,
  };
};

// Compatibility hooks
export const useDashboardMetrics = (period?: string, type?: string) => {
  return useDashboard(period, type);
};

export const useDashboardReviews = (period?: string) => {
  return useDashboard(period);
};
