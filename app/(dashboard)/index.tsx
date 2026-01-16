import IMAGES from "@/assets";
import BottomNav from "@/components/BottomNav";
import DashboardCards from "@/components/Dashboard/DashboardCards";
import DashboardRecentReviews from "@/components/Dashboard/DashboardRecentReviews";
import FilterTab from "@/components/FilterTab";
import Header from "@/components/Header";
import ScreenTitle from "@/components/ScreenTitle";
import { useDashboardMetrics } from "@/hooks/useDashboard";
import React, { useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState<string>("all_time");
  const { isLoading, refetch } = useDashboardMetrics(activeTab);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);
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
            label: "All Time",
            value: "all_time",
            onPress: () => {
              setActiveTab("all_time");
            },
          },
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
        <DashboardCards activeTab={activeTab} isLoading={isLoading} />

        <DashboardRecentReviews />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav activeTab="dashboard" />
    </SafeAreaView>
  );
}
