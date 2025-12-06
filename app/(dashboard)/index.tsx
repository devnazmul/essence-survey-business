import FilterTab from "@/components/FilterTab";
import Header from "@/components/Header";
import HeaderButton from "@/components/HeaderButton";
import ReviewCard from "@/components/ReviewCard";
import ScreenTitle from "@/components/ScreenTitle";
import StatCard from "@/components/StatCard";
import { useDashboard } from "@/hooks/useDashboard";
import { useDimension } from "@/hooks/useDimension";
import { useAuthStore } from "@/store/useAuthStore";
import { useBusinessStore } from "@/store/useBusinessStore";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const { getResponsiveFontSize, getResponsiveHeight, WP } = useDimension();
  const router = useRouter();
  const { user, stats, reviews } = useBusinessStore();
  const { isLoading, refetch } = useDashboard();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.replace("/signin");
  };

  const [isUpdate, setIsUpdate] = useState<number>(0);
  useEffect(() => {
    const int = setInterval(() => {
      setIsUpdate(isUpdate + 1);
    }, 1000);
    return () => {
      clearInterval(int);
    };
  }, []);

  useEffect(() => {
    console.log({ stats });
  }, [stats, isUpdate]);

  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
      {/* Header */}
      <Header
        leftComponent={
          <HeaderButton
            IconComponent={Feather}
            iconName="bell"
            iconSize={20}
            onPress={() => router.push("/notifications")}
          />
        }
        centerComponent={
          <Text
            style={{ fontSize: getResponsiveFontSize("lg") }}
            className="font-bold text-primary"
          >
            {user.name}
          </Text>
        }
        rightComponent={
          <HeaderButton
            IconComponent={AntDesign}
            iconName="logout"
            onPress={handleLogout}
          />
        }
      />

      <ScreenTitle title="Dashboard" />

      {/* Filters */}
      <FilterTab
        activeTab={activeTab}
        tabs={[
          {
            label: "All",
            value: "all",
            onPress: () => {
              setActiveTab("all");
            },
          },
          {
            label: "Today",
            value: "today",
            onPress: () => {
              setActiveTab("today");
            },
          },
          {
            label: "Last 7 Days",
            value: "thisWeek",
            onPress: () => {
              setActiveTab("thisWeek");
            },
          },
          {
            label: "Last 30 Days",
            value: "thisMonth",
            onPress: () => {
              setActiveTab("thisMonth");
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
            title="Avg. Rating"
            value={stats.avgRating.value}
            change={stats.avgRating.change}
          />
          <StatCard
            title="Total Reviews"
            value={stats.totalReviews.value}
            change={stats.totalReviews.change}
          />
          <StatCard
            title="Staff Linked Reviews"
            value={stats.staffLinkedReviews.value}
            change={stats.staffLinkedReviews.change}
            percentage={stats.staffLinkedReviews.percentage}
            total={stats.staffLinkedReviews.total}
            isPercentage
            fullWidth
          />
        </View>

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
          <TouchableOpacity>
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
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-base-300 border-t border-gray-200 flex-row justify-around py-4 pb-6">
        <TouchableOpacity className="items-center">
          <MaterialIcons name="dashboard" size={24} color="#DC2D2A" />
          <Text
            style={{
              color: "#DC2D2A",
              fontSize: getResponsiveFontSize("xs"),
            }}
            className="mt-1 font-medium"
          >
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <MaterialIcons name="star-border" size={24} color="#9CA3AF" />
          <Text
            style={{
              fontSize: getResponsiveFontSize("xs"),
            }}
            className="text-gray-400 mt-1 font-medium"
          >
            Reviews
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <MaterialIcons name="bar-chart" size={24} color="#9CA3AF" />
          <Text
            style={{
              fontSize: getResponsiveFontSize("xs"),
            }}
            className="text-gray-400 mt-1 font-medium"
          >
            Analytics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Feather name="settings" size={24} color="#9CA3AF" />
          <Text
            style={{
              fontSize: getResponsiveFontSize("xs"),
            }}
            className="text-gray-400 mt-1 font-medium"
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
