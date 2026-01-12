import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface AreaPerformanceProps {
  label: string;
  rating: number;
  icon?: any;
  color?: string;
  iconBg?: string;
  reviewCount?: number;
}

const AreaPerformance = ({
  label,
  rating,
  icon,
  color = COLORS.primary,
  iconBg = "#E0F2FE",
  reviewCount,
}: AreaPerformanceProps) => {
  const { getResponsiveFontSize } = useDimension();

  // Calculate width relative to 5 stars max (approx visual representation)
  const widthPercentage = (rating / 5) * 100;

  return (
    <View className="flex-row items-center mb-4">
      <View
        className="w-10 h-10 rounded-lg items-center justify-center mr-3"
        style={{ backgroundColor: iconBg }}
      >
        <MaterialIcons name={icon || "store"} size={20} color={color} />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text
            style={{ fontSize: getResponsiveFontSize("md") }}
            className="text-gray-900 font-medium"
          >
            {label}
          </Text>
          <View className="flex-row items-center">
            <MaterialIcons name="star" size={14} color="#FFDB67" />
            <Text
              style={{ fontSize: getResponsiveFontSize("md") }}
              className="text-gray-900 font-bold ml-1"
            >
              {rating}
            </Text>
          </View>
        </View>
        <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{ width: `${widthPercentage}%`, backgroundColor: color }}
          />
        </View>
        {reviewCount !== undefined && (
          <Text className="text-gray-400 text-xs mt-1">
            {reviewCount} reviews
          </Text>
        )}
      </View>
    </View>
  );
};

export default AreaPerformance;
