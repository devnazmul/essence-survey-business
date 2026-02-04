import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { useBusinessStore } from "@/store/useBusinessStore";
import { formatRole } from "@/utils/formatRole";
import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import ReviewTrendChart from "../ReviewTrendChart";
import StatCard from "../StatCard";

interface IDashboardCardsProps {
  activeTab: string;
  activeTypeTab: string;
  isLoading: boolean;
}
const DashboardCards: React.FC<IDashboardCardsProps> = ({
  activeTab,
  activeTypeTab,
  isLoading,
}) => {
  const stats = useBusinessStore((state) => state.stats);

  const { getResponsiveFontSize } = useDimension();

  const parseChange = (val: any): number => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const parsed = parseFloat(val.replace(/[^0-9.-]/g, ""));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  return (
    <View className="flex-row flex-wrap justify-between gap-x-1">
      <StatCard
        onTitleClick={() => {
          router.push({
            pathname: "/reviews",
            params: {
              is_overall: activeTab === "all_time" ? 1 : 0,
              period: activeTab,
            },
          });
        }}
        isShowPercentageOnValue={false}
        valueFontSize={getResponsiveFontSize("lg")}
        isLoading={isLoading}
        title="Total Reviews"
        value={stats.totalReviews?.value || 0}
        bottomRightSection={stats.totalReviews?.value}
        change={parseChange(stats.totalReviews?.change)}
        color="#e0fee9"
        showProgress
        max={stats.allReviews}
        breakdown={[
          (stats.ratingBreakdown?.breakdown?.exact_ratings?.[5] ?? 0) > 0 && {
            emoji: "😊",
            count: stats.ratingBreakdown?.breakdown?.exact_ratings?.[5] || 0,
          },
          (stats.ratingBreakdown?.breakdown?.exact_ratings?.[4] ?? 0) > 0 && {
            emoji: "🙂",
            count: stats.ratingBreakdown?.breakdown?.exact_ratings?.[4] || 0,
          },
          (stats.ratingBreakdown?.breakdown?.exact_ratings?.[3] ?? 0) > 0 && {
            emoji: "😐",
            count: stats.ratingBreakdown?.breakdown?.exact_ratings?.[3] || 0,
          },
          (stats.ratingBreakdown?.breakdown?.exact_ratings?.[2] ?? 0) > 0 && {
            emoji: "🙁",
            count: stats.ratingBreakdown?.breakdown?.exact_ratings?.[2] || 0,
          },
          (stats.ratingBreakdown?.breakdown?.exact_ratings?.[1] ?? 0) > 0 && {
            emoji: "😞",
            count: stats.ratingBreakdown?.breakdown?.exact_ratings?.[1] || 0,
          },
        ]}
        description="The total number of customer feedback submissions received during the selected time period. This includes ratings, written comments, voice feedback, and surveys."
      />
      <StatCard
        valueFontSize={
          stats.csatScore?.value > 99
            ? getResponsiveFontSize("md")
            : getResponsiveFontSize("lg")
        }
        // change={parseChange(stats.totalReviews?.change)}
        bottomRightSection={stats.totalReviews?.value}
        onTitleClick={() => {
          router.push({
            pathname: "/reviews",
            params: {
              meets_threshold: 1,
              is_overall: activeTab === "all_time" ? 1 : 0,
              period: activeTab,
            },
          });
        }}
        isLoading={isLoading}
        title="CSAT Score"
        value={stats.csatScore?.value || 0}
        change={parseChange(stats.csatScore?.change)}
        subTitle="Satisfaction"
        color="#ccfbf1"
        showProgress
        isShowPercentageOnValue
        iconColor={COLORS["cyan-500"]}
        description="A breakdown of customer feedback into positive, neutral, and negative sentiment. This is based on the meaning and emotion detected in customer comments."
      />
      <StatCard
        bottomRightSection={stats.totalReviews?.value}
        onTitleClick={() => {
          router.push({
            pathname: "/reviews",
            params: {
              is_overall: activeTab === "all_time" ? 1 : 0,
              period: activeTab,
            },
          });
        }}
        isLoading={isLoading}
        title="Avg. Rating"
        value={stats.avgRating?.value || 0}
        subTitle="out of 5"
        color="#fbf5dd"
        iconName="star"
        iconColor={COLORS["orange-500"]}
        iconSize={getResponsiveFontSize("3xl")}
        Icon={AntDesign}
        iconPosition="right"
        description="The average of all numeric ratings submitted by customers in this period. Ratings alone don’t show the full picture, so we analyse them together with comments."
      />
      <StatCard
        bottomRightSection={stats.totalReviews?.value}
        onTitleClick={() => {
          router.push({
            pathname: "/reviews",
            params: {
              has_staff: 1,
              is_overall: activeTab === "all_time" ? 1 : 0,
              period: activeTab,
            },
          });
        }}
        isLoading={isLoading}
        title="Staff-Linked"
        value={stats.staffLinkedReviews?.value || 0}
        total={stats.staffLinkedReviews?.total}
        subTitle={
          stats.staffLinkedReviews?.percentage !== undefined
            ? `(${stats.staffLinkedReviews?.percentage}%) according to selected period`
            : "according to selected period"
        }
        isPercentage
        color="#cde8fb"
        iconName="user"
        iconColor={COLORS["blue-500"]}
        iconSize={getResponsiveFontSize("3xl")}
        Icon={FontAwesome}
        iconPosition="right"
        description="Reviews that mention staff members directly or describe staff behaviour. Used to identify coaching opportunities and recognise positive performance."
      />
      <StatCard
        bottomRightSection={stats.totalReviews?.value}
        onTitleClick={() => {
          router.push({
            pathname: "/reviews",
            params: {
              sentiment_score:
                stats.aiSentiment?.value?.toLowerCase().replace(/\s+/g, "_") ||
                "neutral",
              is_overall: activeTab === "all_time" ? 1 : 0,
              period: activeTab,
            },
          });
        }}
        isLoading={isLoading}
        title="Sentiment Score"
        valueFontSize={getResponsiveFontSize("2xl")}
        value={
          stats.aiSentiment?.value
            ? formatRole(stats.aiSentiment?.value)
            : "Neutral"
        }
        subTitle={stats.aiSentiment?.subTitle || ""}
        color="#F2E7F8"
        iconName="brain"
        iconColor={COLORS["purple-500"]}
        iconSize={getResponsiveFontSize("xl")}
        Icon={FontAwesome6}
        iconPosition="right"
        description="An overall score calculated by AI based on customer comments, language, and tone. It reflects how customers feel, not just what rating they selected."
      />
      <StatCard
        bottomRightSection={stats.totalReviews?.value}
        onTitleClick={() => {
          router.push({
            pathname: "/reviews",
            params: {
              topics:
                stats.topTopic?.value &&
                stats.topTopic?.value !== "N/A" &&
                stats.topTopic?.value !== "[]"
                  ? stats.topTopic?.value
                  : "",
              is_overall: activeTab === "all_time" ? 1 : 0,
              period: activeTab,
            },
          });
        }}
        isLoading={isLoading}
        title="Top Topic"
        valueFontSize={
          stats.topTopic?.value.split(" ").length > 1
            ? getResponsiveFontSize("xl")
            : getResponsiveFontSize("2xl")
        }
        value={
          stats.topTopic?.value && stats.topTopic?.value !== "[]"
            ? stats.topTopic?.value
            : "N/A"
        }
        subTitle={stats.topTopic?.subTitle || ""}
        color="#d5fffdff"
        iconName="shield-crown"
        iconColor={COLORS["cyan-500"]}
        iconSize={getResponsiveFontSize("3xl")}
        Icon={MaterialCommunityIcons}
        iconPosition="right"
        description="The most common themes mentioned by customers, such as staff behaviour, wait time, or cleanliness. Topics are grouped automatically using AI."
      />
      <StatCard
        bottomRightSection={stats.totalReviews?.value}
        onTitleClick={() => {
          router.push({
            pathname: "/reviews",
            params: {
              meets_threshold: 0,
              is_overall: activeTab === "all_time" ? 1 : 0,
              period: activeTab,
            },
          });
        }}
        isLoading={isLoading}
        title="Action Required"
        value={stats.flagged?.value || 0}
        iconName="flag-variant"
        iconColor={COLORS["red-600"]}
        iconSize={getResponsiveFontSize("3xl")}
        Icon={MaterialCommunityIcons}
        iconPosition="right"
        color="#fee2e2"
        description="Reviews that need attention. These may include strong negative feedback, repeated issues, or a mismatch between ratings and comments."
      />
      <StatCard
        bottomRightSection={stats.totalReviews?.value}
        onTitleClick={() => {
          router.push({
            pathname: "/reviews",
            params: {
              is_repeat_issue: 1,
              is_overall: activeTab === "all_time" ? 1 : 0,
              period: activeTab,
            },
          });
        }}
        isLoading={isLoading}
        title="Repeat Issue"
        valueFontSize={getResponsiveFontSize("lg")}
        value={stats.repeatIssue?.value || "N/A"}
        subTitle={stats.repeatIssue?.subTitle || "Recurring problems"}
        iconName="warning"
        iconColor={COLORS["orange-500"]}
        iconSize={
          stats.repeatIssue?.value.split(" ").length > 1
            ? getResponsiveFontSize("2xl")
            : getResponsiveFontSize("3xl")
        }
        Icon={Ionicons}
        iconPosition="right"
        color="#fef9c3"
        description="Tracks recurring problems mentioned across multiple reviews. Identifying patterns helps prioritize which issues to fix first."
      />
      <ReviewTrendChart activeTypeTab={activeTypeTab} activeTab={activeTab} />
    </View>
  );
};

export default DashboardCards;
