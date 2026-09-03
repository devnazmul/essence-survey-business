import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { useReviewTrends } from "@/hooks/useReviewTrends";
import moment from "moment";
import React, { useEffect, useMemo } from "react";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";
import { CurveType, LineChart } from "react-native-gifted-charts";

const getPeriod = (activeTab: string) => {
  switch (activeTab) {
    case "last_7_days":
      return "7d";
    case "last_30_days":
      return "30d";
    case "last_90_days":
      return "90d";
    default:
      return "30d";
  }
};

const ReviewTrendChart = ({
  activeTab,
  activeTypeTab,
}: {
  activeTab: string;
  activeTypeTab: string;
}) => {
  const { getResponsiveFontSize, WP } = useDimension();
  const screenWidth = Dimensions.get("window").width;

  const { data, isLoading, refetch } = useReviewTrends(
    getPeriod(activeTab),
    activeTypeTab,
  );

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, activeTypeTab]);

  const chartData = useMemo(() => {
    if (!data?.data) return [];

    // Sort the array by period date
    const sortedData = [...data.data].sort((a, b) => {
      const dateA = a.period.split("-").reverse().join("-"); // 12-01-2026 -> 2026-01-12
      const dateB = b.period.split("-").reverse().join("-");
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    return sortedData.map((item) => {
      if (getPeriod(activeTab) === "7d") {
        return {
          value: item.count || 0,
          label: moment(item.period, "DD-MM-YYYY").format("DD MMM"),
          dataPointText: item.period,
        };
      } else if (getPeriod(activeTab) === "30d") {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data, getPeriod(activeTab)]);

  return (
    <View className="bg-base-300 rounded-2xl p-4 mb-2 shadow-sm w-full">
      <Text
        // style={{ fontSize: getResponsiveFontSize("lg") }}
        className="font-bold text-gray-900 mb-4"
      >
        Review Trends
      </Text>
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
              getPeriod(activeTab) === "7d"
                ? WP("12.7%")
                : getPeriod(activeTab) === "30d"
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
                getPeriod(activeTab) === "7d"
                  ? getResponsiveFontSize("xxs")
                  : getPeriod(activeTab) === "30d"
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
