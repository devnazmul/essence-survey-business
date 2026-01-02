import IMAGES from "@/assets";
import AreaPerformance from "@/components/AreaPerformance";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import HeaderButton from "@/components/HeaderButton";
import InsightProgress from "@/components/InsightProgress";
import ScreenTitle from "@/components/ScreenTitle";
import StaffPerformance from "@/components/StaffPerformance";
import { COLORS } from "@/constants";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useDimension } from "@/hooks/useDimension";
import { useAuthStore } from "@/store/useAuthStore";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
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

export default function AnalyticsScreen() {
  const { getResponsiveFontSize } = useDimension();
  const { data, isLoading, refetch } = useAnalytics();

  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.replace("/signin");
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

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
        centerComponent={<Image source={IMAGES.logo} className={`w-16 h-16`} />}
        rightComponent={
          <View className="flex-row items-center bg-white rounded-full px-3 py-1.5 border border-gray-100 shadow-sm">
            <Text className="text-gray-600 font-medium text-xs mr-2">
              Last 30 Days
            </Text>
            <Feather name="calendar" size={14} color="gray" />
          </View>
        }
      />
      <ScreenTitle title="Insights Overview" />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          className="flex-1 mb-20"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* What people love */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                style={{ fontSize: getResponsiveFontSize("lg") }}
                className="font-bold text-gray-900"
              >
                What people love
              </Text>
              <View className="bg-green-100 p-1.5 rounded-lg">
                <MaterialIcons
                  name="thumb-up"
                  size={18}
                  color={COLORS.success}
                />
              </View>
            </View>

            {data?.positiveThemes?.map((item: any, index: number) => (
              <InsightProgress
                key={index}
                label={item.label}
                percentage={item.percentage}
                color={COLORS.success}
                backgroundColor="#DCFCE7" // green-100
              />
            ))}

            <TouchableOpacity className="flex-row items-center mt-2">
              <Text className="text-blue-500 font-medium text-sm mr-1">
                View all positive themes
              </Text>
              <Feather name="arrow-right" size={14} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {/* Top Issues */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                style={{ fontSize: getResponsiveFontSize("lg") }}
                className="font-bold text-gray-900"
              >
                Top Issues
              </Text>
              <View className="bg-red-100 p-1.5 rounded-lg">
                <MaterialIcons name="warning" size={18} color={COLORS.error} />
              </View>
            </View>

            {data?.negativeThemes?.map((item: any, index: number) => (
              <InsightProgress
                key={index}
                label={item.label}
                percentage={item.percentage}
                color={COLORS.error}
                backgroundColor="#FEE2E2" // red-100
              />
            ))}

            <TouchableOpacity className="flex-row items-center mt-2">
              <Text className="text-blue-500 font-medium text-sm mr-1">
                Drill down into issues
              </Text>
              <Feather name="arrow-right" size={14} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {/* Performance by Area */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text
              style={{ fontSize: getResponsiveFontSize("lg") }}
              className="font-bold text-gray-900 mb-4"
            >
              Performance by Area
            </Text>

            {data?.areaPerformance?.map((item: any, index: number) => (
              <AreaPerformance
                key={index}
                label={item.label}
                rating={item.rating}
                icon={
                  item.label === "Downtown"
                    ? "storefront"
                    : item.label === "Uptown"
                      ? "business"
                      : "restaurant"
                }
                color={COLORS.primary}
                iconBg="#D3E1FE"
              />
            ))}
            <TouchableOpacity className="w-full py-3 border border-gray-200 rounded-xl items-center mt-2">
              <Text className="text-gray-600 font-medium">
                Compare all locations
              </Text>
            </TouchableOpacity>
          </View>

          {/* Top Performing Staff */}
          <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <Text
              style={{ fontSize: getResponsiveFontSize("lg") }}
              className="font-bold text-gray-900 mb-4"
            >
              Top Performing Staff
            </Text>

            {data?.topStaff?.map((item: any, index: number) => (
              <StaffPerformance key={index} {...item} isFirst={index === 0} />
            ))}
            <TouchableOpacity className="flex-row items-center mt-3">
              <Text className="text-blue-500 font-medium text-sm mr-1">
                View Team Report
              </Text>
              <Feather name="arrow-right" size={14} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      <BottomNav activeTab="analytics" />
    </SafeAreaView>
  );
}
