import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { useReviewTrends } from "@/hooks/useReviewTrends";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import FilterTab from "./FilterTab";

const ReviewTrendChart = ({ update }: { update: boolean }) => {
  const { getResponsiveFontSize } = useDimension();
  const screenWidth = Dimensions.get("window").width;
  const [period, setPeriod] = useState("30d");
  const { data, isLoading, refetch } = useReviewTrends(period);

  const tabs = [
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
  ];

  useEffect(() => {
    refetch();
  }, [update]);

  const chartData = useMemo(() => {
    if (!data?.data?.data) return [];

    const sortedDates = Object.keys(data.data.data).sort((a, b) => {
      const dateA = a.split("-").reverse().join("-"); // 02-12-2025 -> 2025-12-02
      const dateB = b.split("-").reverse().join("-");
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    return sortedDates.map((date) => {
      if (period === "7d") {
        return {
          value: data.data.data[date]?.submissions_count || 0,
          label: moment(date, "DD-MM-YYYY").format("DD MMM"),
          dataPointText: "",
        };
      } else if (period === "30d") {
        return {
          value: data.data.data[date]?.submissions_count || 0,
          label: moment(date, "DD-MM-YYYY").format("D"),
          dataPointText: "",
        };
      } else {
        return {
          value: data.data.data[date]?.submissions_count || 0,
          label: moment(date, "MM-YYYY").format("MMM"),
          dataPointText: "",
        };
      }
    });
  }, [data]);

  return (
    <View className="bg-white rounded-2xl p-4 mb-2 shadow-sm w-full">
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
        <View className="h-48 w-full justify-center items-center">
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : (
        <View className="items-center  w-full">
          <LineChart
            data={chartData}
            color1={COLORS.primary}
            thickness={3}
            startFillColor={COLORS.primary}
            endFillColor={COLORS["base-300"]}
            startOpacity={0.5}
            endOpacity={0}
            initialSpacing={20}
            spacing={period === "7d" ? 63 : period === "30d" ? 13.5 : 195}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            yAxisTextStyle={{ color: "transparent", fontSize: 10 }}
            xAxisLabelTextStyle={{
              color: "transparent",
              fontSize: period === "7d" ? 15 : period === "30d" ? 8 : 13,
            }}
            areaChart
            curved
            hideDataPoints
            width={screenWidth - 60}
            height={200}
            adjustToWidth
            isAnimated
            pointerConfig={{
              pointerStripUptoDataPoint: true,
              pointerStripColor: COLORS.primary,
              pointerStripWidth: 2,
              strokeDashArray: [2, 5],
              pointerColor: COLORS.primary,
              radius: 5,
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
                      borderColor: COLORS["gray-300"],
                      borderWidth: 1,
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
