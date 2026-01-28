import IMAGES from "@/assets";

import DashboardCards from "@/components/Dashboard/DashboardCards";
import DashboardRecentReviews from "@/components/Dashboard/DashboardRecentReviews";
import FilterTab from "@/components/FilterTab";
import Header from "@/components/Header";
import ScreenTitle from "@/components/ScreenTitle";
import Button from "@/components/ui/Button";
import { useNotification } from "@/context/useNotification";
import { useDashboardMetrics } from "@/hooks/useDashboard";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState<string>("last_30_days");
  const { isLoading, refetch } = useDashboardMetrics(activeTab);
  const [refreshing, setRefreshing] = useState(false);
  const { setIsNotificationChanged } = useNotification();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setIsNotificationChanged(Math.random());

    setRefreshing(false);
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleOpenHowItWorks = async () => {
    await WebBrowser.openBrowserAsync(
      "https://feed-genius.quickreview.app/analysis-logic",
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
      {/* Header */}
      <Header
        centerComponent={<Image source={IMAGES.logo} className={`w-16 h-16`} />}
      />

      <View className="flex-row justify-between items-center">
        <ScreenTitle title="Dashboard" />
        <Button
          label="How it's work"
          onPress={handleOpenHowItWorks}
          size="sm"
          color="outline"
          className="mb-4"
        />
      </View>

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
        className="flex-1 pb-10"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats */}
        <DashboardCards activeTab={activeTab} isLoading={isLoading} />

        <DashboardRecentReviews />
      </ScrollView>

      {/* Bottom Navigation */}
    </SafeAreaView>
  );
}
