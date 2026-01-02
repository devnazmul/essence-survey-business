import IMAGES from "@/assets";
import BottomNav from "@/components/BottomNav";
import FilterTab from "@/components/FilterTab";
import Header from "@/components/Header";
import HeaderButton from "@/components/HeaderButton";
import ProfileDropdown from "@/components/ProfileDropdown";
import ReviewCard from "@/components/ReviewCard";
import ReviewTrendChart from "@/components/ReviewTrendChart";
import ScreenTitle from "@/components/ScreenTitle";
import StatCard from "@/components/StatCard";
import { COLORS } from "@/constants";
import { useDashboard } from "@/hooks/useDashboard";
import { useDimension } from "@/hooks/useDimension";
import { useNotifications } from "@/hooks/useNotifications";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const { unreadCount } = useNotifications();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const [isUpdate, setIsUpdate] = useState<number>(0);
  useEffect(() => {
    const int = setInterval(() => {
      setIsUpdate((prev) => prev + 1);
    }, 1000);
    return () => {
      clearInterval(int);
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
      {/* Header */}
      <Header
        leftComponent={
          <View className="relative">
            <HeaderButton
              IconComponent={Feather}
              iconName="bell"
              iconSize={20}
              onPress={() => router.push("/notifications")}
            />
            {unreadCount > 0 && (
              <View className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full justify-center items-center border border-white">
                <Text
                  className="text-white font-bold"
                  style={{ fontSize: 10, lineHeight: 12 }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </View>
        }
        centerComponent={<Image source={IMAGES.logo} className={`w-16 h-16`} />}
        rightComponent={<ProfileDropdown />}
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
        <View className="flex-row flex-wrap justify-between gap-x-4">
          <StatCard
            isLoading={isLoading}
            title="Avg. Rating"
            value={stats.avgRating.value}
            change={stats.avgRating.change}
          />
          <StatCard
            isLoading={isLoading}
            title="Total Reviews"
            value={stats.totalReviews.value}
            change={stats.totalReviews.change}
          />
          <StatCard
            isLoading={isLoading}
            title="Staff Linked Reviews"
            value={stats.staffLinkedReviews.value}
            change={stats.staffLinkedReviews.change}
            percentage={stats.staffLinkedReviews.percentage}
            total={stats.staffLinkedReviews.total}
            isPercentage
            fullWidth
          />

          <ReviewTrendChart />
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
