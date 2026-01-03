import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import getFullImageLink from "@/utils/getFullImageLink";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

interface StaffPerformanceProps {
  name: string;
  role: string;
  location?: string;
  rating: number;
  reviews: number;
  image?: string;
  isFirst?: boolean;
}

const StaffPerformance = ({
  name,
  role,
  location,
  rating,
  reviews,
  image,
  isFirst = false,
}: StaffPerformanceProps) => {
  const { getResponsiveFontSize } = useDimension();

  return (
    <View
      className={`flex-row items-center py-3 ${!isFirst ? "border-t border-gray-100" : ""}`}
    >
      <Image
        source={{
          uri: getFullImageLink(image || ""),
        }}
        className="w-12 h-12 rounded-full mr-3"
      />
      <View className="flex-1">
        <Text
          style={{ fontSize: getResponsiveFontSize("md") }}
          className="text-gray-900 font-bold"
        >
          {name}
        </Text>
        <Text
          style={{ fontSize: getResponsiveFontSize("sm") }}
          className="text-gray-500"
        >
          {role} {location ? `• ${location}` : ""}
        </Text>
      </View>
      <View className="items-end">
        <View className="flex-row items-center">
          <Text
            style={{ fontSize: getResponsiveFontSize("md") }}
            className="text-gray-900 font-bold mr-1"
          >
            {rating.toFixed(1)}
          </Text>
          <MaterialIcons name="star" size={14} color="#FFDB67" />
        </View>
        <Text
          style={{
            fontSize: getResponsiveFontSize("xs"),
            color: COLORS.primary,
          }}
          className="font-medium"
        >
          +{reviews} reviews
        </Text>
      </View>
    </View>
  );
};

export default StaffPerformance;
