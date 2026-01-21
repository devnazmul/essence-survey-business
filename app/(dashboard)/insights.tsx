import IMAGES from "@/assets";
import AreaPerformance from "@/components/AreaPerformance";

import Header from "@/components/Header";
import InsightProgress from "@/components/InsightProgress";
import ScreenTitle from "@/components/ScreenTitle";
import StaffPerformance from "@/components/StaffPerformance";
import { COLORS } from "@/constants";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useDimension } from "@/hooks/useDimension";
import { getFullImageLink } from "@/utils/getFullImageLink";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PERIODS = [
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "This Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },
];

const COLORS_LIST = [
  { text: COLORS["blue-500"], bg: COLORS["blue-100"] },
  { text: COLORS["green-500"], bg: COLORS["green-100"] },
  { text: COLORS["orange-500"], bg: COLORS["orange-100"] },
];

export default function AnalyticsScreen() {
  const { getResponsiveFontSize } = useDimension();
  const [refreshing, setRefreshing] = React.useState(false);
  const [period, setPeriod] = React.useState("last_30_days");
  const [showFilter, setShowFilter] = React.useState(false);
  const { data, isLoading, refetch } = useAnalytics(period);

  const handlePeriodSelect = React.useCallback((value: string) => {
    setPeriod(value);
    setShowFilter(false);
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const getImageUrl = React.useCallback((imagePath: string) => {
    if (!imagePath)
      return "https://ui-avatars.com/api/?name=User&background=random";
    return getFullImageLink(imagePath);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
      {/* Header */}
      <Header
        // leftComponent={...} // Defaulting to ProfileDropdown now
        centerComponent={<Image source={IMAGES.logo} className={`w-16 h-16`} />}
      />
      <View className="flex-row items-center justify-between mb-4">
        <ScreenTitle title="Insights Overview" />
        <TouchableOpacity
          onPress={() => setShowFilter(true)}
          className="flex-row items-center bg-base-300 rounded-full px-3 py-1.5 border border-gray-100 shadow-sm"
        >
          <Text className="text-gray-600 font-bold text-xs mr-2">
            {PERIODS.find((p) => p.value === period)?.label}
          </Text>
          <Feather name="calendar" size={14} color="gray" />
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          className="flex-1 mb-20"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Top Issues */}
          {data?.top_issues?.length > 0 && (
            <View className="bg-base-300 rounded-2xl p-5 mb-4 shadow-sm">
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  style={{ fontSize: getResponsiveFontSize("lg") }}
                  className="font-bold text-gray-900"
                >
                  Top Issues
                </Text>
                <View className="bg-red-100 p-1.5 rounded-lg">
                  <MaterialIcons
                    name="warning"
                    size={18}
                    color={COLORS.error}
                  />
                </View>
              </View>

              {data?.top_issues?.map((item: any, index: number) => (
                <InsightProgress
                  key={index}
                  label={item.issue}
                  percentage={item.percentage}
                  color={COLORS.error}
                  backgroundColor="#FEE2E2" // red-100
                  count={item.count} // Pass count if component supports it or modify component
                />
              )) || <Text className="text-gray-400">No issues found</Text>}

              {/* <TouchableOpacity className="flex-row items-center mt-2">
              <Text className="text-blue-500 font-medium text-sm mr-1">
                Drill down into issues
              </Text>
              <Feather name="arrow-right" size={14} color="#3B82F6" />
            </TouchableOpacity> */}
            </View>
          )}

          {/* Performance by Branch */}
          {data?.performance_by_branch &&
            data?.performance_by_branch?.length > 0 && (
              <View className="bg-base-300 rounded-2xl p-5 mb-4 shadow-sm">
                <Text
                  style={{ fontSize: getResponsiveFontSize("lg") }}
                  className="font-bold text-gray-900 mb-4"
                >
                  Performance by Branch
                </Text>

                {data?.performance_by_branch?.map(
                  (item: any, index: number) => (
                    <AreaPerformance
                      key={index}
                      label={item.name}
                      rating={item.rating}
                      icon="business"
                      color={COLORS_LIST[index % COLORS_LIST.length].text}
                      iconBg={COLORS_LIST[index % COLORS_LIST.length].bg} // Cyclic colors
                      reviewCount={item.review_count}
                    />
                  ),
                )}
              </View>
            )}

          {/* Performance by Area */}
          {data?.performance_by_area?.length > 0 && (
            <View className="bg-base-300 rounded-2xl p-5 mb-4 shadow-sm">
              <Text
                style={{ fontSize: getResponsiveFontSize("lg") }}
                className="font-bold text-gray-900 mb-4"
              >
                Performance by Area
              </Text>

              {data?.performance_by_area?.map((item: any, index: number) => (
                <AreaPerformance
                  key={index}
                  label={item.name}
                  rating={item.rating}
                  icon="storefront"
                  color={COLORS_LIST[(index + 2) % COLORS_LIST.length].text}
                  iconBg={COLORS_LIST[(index + 2) % COLORS_LIST.length].bg} // Cyclic colors with offset
                  reviewCount={item.review_count}
                />
              ))}
              {/* <TouchableOpacity className="w-full py-3 border border-gray-200 rounded-xl items-center mt-2">
              <Text className="text-gray-600 font-medium">
                Compare all locations
              </Text>
            </TouchableOpacity> */}
            </View>
          )}

          {/* Top Performing Staff */}
          {data?.top_performing_staff?.length > 0 && (
            <View className="bg-base-300 rounded-2xl p-5 mb-4 shadow-sm">
              <Text
                style={{ fontSize: getResponsiveFontSize("lg") }}
                className="font-bold text-gray-900 mb-4"
              >
                Top Performing Staff
              </Text>

              {data?.top_performing_staff?.map((item: any, index: number) => (
                <StaffPerformance
                  key={index}
                  name={item.name}
                  role={item.role}
                  rating={item.rating}
                  reviews={item.review_count}
                  image={item.image}
                  isFirst={index === 0}
                />
              ))}
              {/* <TouchableOpacity className="flex-row items-center mt-3">
              <Text className="text-blue-500 font-medium text-sm mr-1">
                View Team Report
              </Text>
              <Feather name="arrow-right" size={14} color="#3B82F6" />
            </TouchableOpacity> */}
            </View>
          )}
        </ScrollView>
      )}
      <Modal
        visible={showFilter}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilter(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowFilter(false)}
          className="flex-1 justify-end bg-black/50"
        >
          <View className="bg-base-300 rounded-t-3xl p-6">
            <View className="items-center mb-2">
              <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </View>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">
                Select Period
              </Text>
              <TouchableOpacity onPress={() => setShowFilter(false)}>
                <Feather name="x" size={24} color="gray" />
              </TouchableOpacity>
            </View>
            <View className="gap-y-3">
              {PERIODS.map((p) => (
                <TouchableOpacity
                  key={p.value}
                  onPress={() => handlePeriodSelect(p.value)}
                  className={`flex-row justify-between items-center p-4 rounded-xl border ${
                    period === p.value
                      ? "border-primary bg-green-50"
                      : "border-gray-50 bg-white"
                  }`}
                >
                  <Text
                    className={`font-bold ${
                      period === p.value ? "text-primary" : "text-gray-700"
                    }`}
                  >
                    {p.label}
                  </Text>
                  {period === p.value && (
                    <Feather name="check" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <View className="h-8" />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
