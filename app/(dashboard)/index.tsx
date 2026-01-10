import IMAGES from "@/assets";
import BottomNav from "@/components/BottomNav";
import FilterTab from "@/components/FilterTab";
import Header from "@/components/Header";
import ReviewCard from "@/components/ReviewCard";
import ReviewTrendChart from "@/components/ReviewTrendChart";
import ScreenTitle from "@/components/ScreenTitle";
import StatCard from "@/components/StatCard";
import { COLORS } from "@/constants";
import { useDashboard } from "@/hooks/useDashboard";
import { useDimension } from "@/hooks/useDimension";
import { useBusinessStore } from "@/store/useBusinessStore";
import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const { getResponsiveFontSize } = useDimension();
  const router = useRouter();
  const { stats, reviews } = useBusinessStore();
  const [activeTab, setActiveTab] = useState<string>("last_30_days");
  const { isLoading, refetch } = useDashboard(activeTab);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
      {/* Header */}
      <Header
        centerComponent={<Image source={IMAGES.logo} className={`w-16 h-16`} />}
      />

      <ScreenTitle title="Dashboard" />

      {/* Filters */}
      <FilterTab
        isLoading={isLoading}
        activeTab={activeTab}
        tabs={[
          {
            label: "30 Days",
            value: "last_30_days",
            onPress: () => {
              setActiveTab("last_30_days");
            },
          },
          {
            label: "7 Days",
            value: "last_7_days",
            onPress: () => {
              setActiveTab("last_7_days");
            },
          },
          {
            label: "This Month",
            value: "this_month",
            onPress: () => {
              setActiveTab("this_month");
            },
          },
          {
            label: "Last Month",
            value: "last_month",
            onPress: () => {
              setActiveTab("last_month");
            },
          },
        ]}
      />

      <ScrollView
        className="flex-1  mb-20"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats */}
        <View className="flex-row flex-wrap justify-between gap-x-1">
          <StatCard
            onTitleClick={() => {
              router.push({
                pathname: "/reviews",
                params: { is_overall: 1, period: activeTab },
              });
            }}
            isLoading={isLoading}
            title="Total Reviews"
            value={stats.totalReviews?.value || 0}
            change={stats.totalReviews?.change}
            color="#e0fee9"
            showProgress
            max={stats.totalReviews?.total}
            breakdown={[
              stats.ratingBreakdown?.breakdown?.exact_ratings?.[5] > 0 && {
                emoji: "😊",
                count:
                  stats.ratingBreakdown?.breakdown?.exact_ratings?.[5] || 0,
              },
              stats.ratingBreakdown?.breakdown?.exact_ratings?.[4] > 0 && {
                emoji: "🙂",
                count:
                  stats.ratingBreakdown?.breakdown?.exact_ratings?.[4] || 0,
              },
              stats.ratingBreakdown?.breakdown?.exact_ratings?.[3] > 0 && {
                emoji: "😐",
                count:
                  stats.ratingBreakdown?.breakdown?.exact_ratings?.[3] || 0,
              },
              stats.ratingBreakdown?.breakdown?.exact_ratings?.[2] > 0 && {
                emoji: "🙁",
                count:
                  stats.ratingBreakdown?.breakdown?.exact_ratings?.[2] || 0,
              },
              stats.ratingBreakdown?.breakdown?.exact_ratings?.[1] > 0 && {
                emoji: "😞",
                count:
                  stats.ratingBreakdown?.breakdown?.exact_ratings?.[1] || 0,
              },
            ]}
            description="The total number of customer feedback submissions received during the selected time period. This includes ratings, written comments, voice feedback, and surveys."
          />
          <StatCard
            onTitleClick={() => {
              router.push({
                pathname: "/reviews",
                params: {
                  meets_threshold: 1,
                  is_overall: 1,
                  period: activeTab,
                },
              });
            }}
            isLoading={isLoading}
            title="CSAT Score"
            value={stats.csatScore?.value || 0}
            change={stats.csatScore?.change}
            subTitle="Satisfaction"
            color="#ccfbf1"
            showProgress
            isPercentage
            iconColor={COLORS["cyan-500"]}
            description="A breakdown of customer feedback into positive, neutral, and negative sentiment. This is based on the meaning and emotion detected in customer comments."
          />
          <StatCard
            onTitleClick={() => {
              router.push({
                pathname: "/reviews",
                params: { is_overall: 1, period: activeTab },
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
            onTitleClick={() => {
              router.push({
                pathname: "/reviews",
                params: { has_staff: 1, is_overall: 1, period: activeTab },
              });
            }}
            isLoading={isLoading}
            title="Staff-Linked"
            value={stats.staffLinkedReviews?.value || 0}
            total={stats.staffLinkedReviews?.total}
            subTitle={`(${stats.staffLinkedReviews?.percentage}%) according to selected period`}
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
            onTitleClick={() => {
              router.push({
                pathname: "/reviews",
                params: {
                  sentiment_score:
                    stats.aiSentiment?.value
                      ?.toLowerCase()
                      .replace(/\s+/g, "_") || "neutral",
                  is_overall: 1,
                  period: activeTab,
                },
              });
            }}
            isLoading={isLoading}
            title="Sentiment Score"
            valueFontSize={getResponsiveFontSize("2xl")}
            value={stats.aiSentiment?.value || "Neutral"}
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
            onTitleClick={() => {
              router.push({
                pathname: "/reviews",
                params: {
                  topics: stats.topTopic?.value,
                  is_overall: 1,
                  period: activeTab,
                },
              });
            }}
            isLoading={isLoading}
            title="Top Topic"
            valueFontSize={getResponsiveFontSize("2xl")}
            value={
              stats.topTopic?.value !== "[]" ? stats.topTopic?.value : "N/A"
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
            onTitleClick={() => {
              router.push({
                pathname: "/reviews",
                params: {
                  meets_threshold: 0,
                  is_overall: 1,
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
            onTitleClick={() => {
              router.push({
                pathname: "/reviews",
                params: {
                  is_repeat_issue: 1,
                  is_overall: 1,
                  period: activeTab,
                },
              });
            }}
            isLoading={isLoading}
            title="Repeat Issue"
            valueFontSize={getResponsiveFontSize("xl")}
            value={stats.repeatIssue?.value || "N/A"}
            subTitle={stats.repeatIssue?.subTitle || "Recurring problems"}
            iconName="warning"
            iconColor={COLORS["orange-500"]}
            iconSize={getResponsiveFontSize("3xl")}
            Icon={Ionicons}
            iconPosition="right"
            color="#fef9c3"
            description="Tracks recurring problems mentioned across multiple reviews. Identifying patterns helps prioritize which issues to fix first."
          />
          <ReviewTrendChart update={refreshing} />
        </View>

        {/* Review Trends Chart */}
        {/* <ReviewTrendChart /> */}

        {/* Recent Reviews Header */}
        <View className="flex-row justify-between items-center mb-4 mt-2">
          <Text
            style={{
              fontSize: getResponsiveFontSize("xl"),
            }}
            className="font-bold text-gray-900"
          >
            Recent Reviews
          </Text>
          <TouchableOpacity onPress={() => router.push("/reviews" as any)}>
            <Text
              style={{
                fontSize: getResponsiveFontSize("sm"),
              }}
              className="text-primary font-medium"
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reviews List */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <>
            {reviews.length === 0 ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-400">No Reviews</Text>
              </View>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav activeTab="dashboard" />
    </SafeAreaView>
  );
}
