import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { useReviewTrends } from "@/hooks/useReviewTrends";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";
import { CurveType, LineChart } from "react-native-gifted-charts";
import FilterTab from "./FilterTab";

const ReviewTrendChart = () => {
  const { getResponsiveFontSize, WP } = useDimension();
  const screenWidth = Dimensions.get("window").width;
  const [period, setPeriod] = useState("30d");
  const { data, isLoading, refetch } = useReviewTrends(period);
  console.log({ data });
  const tabs = [
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
  ];

  useEffect(() => {
    refetch();
  }, [period, refetch]);

  const chartData = useMemo(() => {
    if (!data?.data) return [];

    // Sort the array by period date
    const sortedData = [...data.data].sort((a, b) => {
      const dateA = a.period.split("-").reverse().join("-"); // 12-01-2026 -> 2026-01-12
      const dateB = b.period.split("-").reverse().join("-");
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    return sortedData.map((item) => {
      if (period === "7d") {
        return {
          value: item.count || 0,
          label: moment(item.period, "DD-MM-YYYY").format("DD MMM"),
          dataPointText: item.period,
        };
      } else if (period === "30d") {
        return {
          value: item.count || 0,
          label: moment(item.period, "DD-MM-YYYY").format("D"),
          dataPointText: item.period,
        };
      } else {
        return {
          value: item.count || 0,
          label: moment(item.period, "MM-YYYY").format("MMM"),
          dataPointText: item.period,
        };
      }
    });
  }, [data?.data, period]);

  return (
    <View className="bg-base-300 rounded-2xl p-4 mb-2 shadow-sm w-full">
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
        <View className="h-32 w-full justify-center items-center">
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : (
        <View className="items-center  w-full">
          <LineChart
            data={chartData}
            color1={COLORS.primary}
            thickness={2}
            startFillColor={COLORS.primary}
            endFillColor={COLORS["base-300"]}
            startOpacity={0.5}
            endOpacity={0}
            initialSpacing={WP("2.5%")}
            spacing={
              period === "7d"
                ? WP("12.7%")
                : period === "30d"
                  ? WP("2.7%")
                  : WP("36.7%")
            }
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            yAxisTextStyle={{ color: "transparent", fontSize: 10 }}
            xAxisLabelTextStyle={{
              color: "transparent",
              fontSize:
                period === "7d"
                  ? getResponsiveFontSize("xxs")
                  : period === "30d"
                    ? getResponsiveFontSize("xxs")
                    : getResponsiveFontSize("xs"),
            }}
            areaChart
            curved
            curveType={CurveType.QUADRATIC}
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
                      {item.dataPointText}
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
