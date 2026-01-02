import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { useReviewTrends } from "@/hooks/useReviewTrends";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import FilterTab from "./FilterTab";

const ReviewTrendChart = () => {
  const { getResponsiveFontSize } = useDimension();
  const screenWidth = Dimensions.get("window").width;
  const [period, setPeriod] = useState("30d");
  const { data, isLoading } = useReviewTrends(period);

  const tabs = [
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
  ];

  const chartData = useMemo(() => {
    if (!data?.data?.data) return [];

    const sortedDates = Object.keys(data.data.data).sort((a, b) => {
      console.log({ a });
      const dateA = a.split("-").reverse().join("-"); // 02-12-2025 -> 2025-12-02
      const dateB = b.split("-").reverse().join("-");
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    return sortedDates.map((date) => ({
      value: data.data.data[date]?.submissions_count || 0,
      label: date.slice(0, 5),
      dataPointText: "",
    }));
  }, [data]);

  return (
    <View className="bg-white rounded-2xl p-4 mb-2 shadow-sm">
      <Text
        // style={{ fontSize: getResponsiveFontSize("lg") }}
        className="font-bold text-gray-900 mb-4"
      >
        Review Trends
      </Text>

      {/* Tabs */}
      <FilterTab
        isLoading={isLoading}
        activeTab={period}
        tabs={[
          {
            ...tabs[0],
            onPress: () => {
              setPeriod("7d");
            },
          },
          {
            ...tabs[1],

            onPress: () => {
              setPeriod("30d");
            },
          },
          {
            ...tabs[2],
            onPress: () => {
              setPeriod("90d");
            },
          },
        ]}
      />

      {isLoading ? (
        <View className="h-48 justify-center items-center">
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : (
        <View className="items-center -ml-4">
          <LineChart
            data={chartData}
            color1={COLORS.primary}
            thickness={3}
            startFillColor={COLORS.primary}
            endFillColor={COLORS["base-300"]}
            startOpacity={0.2}
            endOpacity={0.01}
            initialSpacing={20}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            yAxisTextStyle={{ color: "transparent" }}
            xAxisLabelTextStyle={{ color: "transparent" }}
            areaChart
            curved
            hideDataPoints
            width={screenWidth - 70}
            height={200}
            adjustToWidth
            isAnimated
            pointerConfig={{
              pointerStripUptoDataPoint: true,
              pointerStripColor: COLORS.primary,
              pointerStripWidth: 2,
              strokeDashArray: [2, 5],
              pointerColor: COLORS.primary,
              radius: 4,
              pointerLabelWidth: 100,
              pointerLabelHeight: 120,
              activatePointersOnLongPress: false,
              autoAdjustPointerLabelPosition: true,
              pointerLabelComponent: (items: any) => {
                const item = items[0];
                return (
                  <View
                    style={{
                      height: 60,
                      width: 100,
                      backgroundColor: COLORS["base-300"],
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontSize: 10,
                        marginBottom: 2,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={{
                        color: COLORS["gray-300"],
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {item.value} Reviews
                    </Text>
                  </View>
                );
              },
            }}
          />
        </View>
      )}
    </View>
  );
};

export default ReviewTrendChart;
