import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import React from "react";
import { Text, View } from "react-native";

interface InsightProgressProps {
  label: string;
  percentage: number;
  color?: string; // Optional color override
  backgroundColor?: string;
  count?: number;
}

const InsightProgress = ({
  label,
  percentage,
  color = COLORS.primary,
  backgroundColor = "#F2F2F2",
  count,
}: InsightProgressProps) => {
  const { getResponsiveFontSize } = useDimension();

  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-1">
        <Text
          style={{ fontSize: getResponsiveFontSize("md") }}
          className="text-gray-900 font-medium"
        >
          {label}
        </Text>
        <Text
          style={{ fontSize: getResponsiveFontSize("sm"), color: color }}
          className="text-gray-500 font-medium "
        >
          {count !== undefined ? `${count} (${percentage}%)` : `${percentage}%`}
        </Text>
      </View>
      <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
};

export default InsightProgress;
