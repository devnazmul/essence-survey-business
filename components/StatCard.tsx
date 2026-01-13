import { useDimension } from "@/hooks/useDimension";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import CircularProgress from "./CircularProgress";

const StatCard = React.memo(
  ({
    onTitleClick,
    isLoading = false,
    title,
    value,
    percentage,
    total,
    change,
    fullWidth = false,
    isPercentage = false,
    color = "#E7F8ED", // Default light green
    valueFontSize,
    subTitle,
    iconName,
    iconColor,
    iconSize,
    Icon,
    iconPosition,
    showProgress = false,
    max = 100,
    description,
    breakdown = [],
  }: {
    onTitleClick?: () => void;
    isLoading?: boolean;
    title: string;
    value: any;
    percentage?: number;
    total?: number;
    change?: number;
    fullWidth?: boolean;
    isPercentage?: boolean;
    color?: string;
    valueFontSize?: any;
    subTitle?: string;
    iconName?: string;
    iconColor?: string;
    iconSize?: number;
    Icon?: any;
    iconPosition?: string;
    showProgress?: boolean;
    max?: number;
    description?: string;
    breakdown?: any[];
  }) => {
    const { getResponsiveFontSize } = useDimension();
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <View
        style={{
          backgroundColor: color,
          overflow: showTooltip ? "visible" : "hidden",
          zIndex: showTooltip ? 100 : 1,
        }}
        className={`p-4 rounded-3xl shadow-sm mb-4 relative ${
          fullWidth ? "w-full" : "w-[48%]"
        }`}
      >
        {/* Decorative Circles */}
        <View
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "rgba(255, 255, 255, 0.37)",
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 20,
            right: 30,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "rgba(255, 255, 255, 0.26)",
          }}
        />
        {/* TITLE */}
        {isLoading ? (
          <View className="h-4 w-24 mb-1 bg-gray-800/5 rounded" />
        ) : (
          <View className="flex-row items-center justify-between mb-2">
            <TouchableOpacity onPress={onTitleClick}>
              <Text
                style={{ fontSize: getResponsiveFontSize("md") }}
                className="text-gray-600 font-semibold opacity-80"
              >
                {title}
              </Text>
            </TouchableOpacity>

            {description && (
              <TouchableOpacity
                onPress={() => setShowTooltip(!showTooltip)}
                className="ml-1 p-1"
              >
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#bebebeff"
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* TOOLTIP OVERLAY */}
        {showTooltip && description && (
          <Animated.View
            entering={FadeInUp.duration(200)}
            exiting={FadeOutUp.duration(150)}
            style={{
              position: "absolute",
              top: 40,
              left: 10,
              right: 10,
              backgroundColor: "#1e293b",
              padding: 10,
              borderRadius: 12,
              zIndex: 1000,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 10,
            }}
          >
            {/* Triangle Pointer */}
            <View
              style={{
                position: "absolute",
                top: -7,
                right: 8,
                width: 0,
                height: 0,
                borderLeftWidth: 8,
                borderRightWidth: 8,
                borderBottomWidth: 8,
                borderStyle: "solid",
                backgroundColor: "transparent",
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: "#1e293b",
              }}
            />
            <Pressable onPress={() => setShowTooltip(false)}>
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="text-white  leading-5 font-medium"
              >
                {description}
              </Text>
            </Pressable>
          </Animated.View>
        )}
        {/* VALUE */}
        <View className={`flex flex-row items-center`}>
          {isLoading ? (
            <View className="h-10 mb-1 w-14 bg-gray-800/5  rounded" />
          ) : (
            <>
              {/* RIGHT ICON  */}
              {Icon && iconPosition === "right" && (
                <Icon
                  name={iconName}
                  size={iconSize}
                  color={iconColor}
                  className="mr-2"
                />
              )}
              {/* VALUE */}
              {showProgress ? (
                <View className="flex flex-row items-center justify-between flex-1">
                  <View className="flex flex-row items-center gap-x-3">
                    <CircularProgress
                      value={value}
                      max={max}
                      size={getResponsiveFontSize("5xl") * 1.8}
                      strokeWidth={13}
                      color={iconColor || "#10b981"}
                      isPercent={isPercentage}
                    />
                    {subTitle && (
                      <Text
                        style={{ fontSize: getResponsiveFontSize("sm") }}
                        className={`text-gray-600 font-semibold mb-2 opacity-80 mt-1`}
                      >
                        {subTitle}
                      </Text>
                    )}
                  </View>

                  {breakdown && breakdown.length > 0 && (
                    <View className="flex flex-col items-start gap-y-[2px]">
                      {breakdown
                        .filter((item) => item && item.emoji)
                        .map((item, idx) => (
                          <View
                            key={idx}
                            className="flex flex-row items-center gap-x-1"
                          >
                            <Text
                              style={{ fontSize: getResponsiveFontSize("sm") }}
                            >
                              {item.emoji}
                            </Text>
                            <Text
                              className="font-bold text-slate-600"
                              style={{
                                fontSize: getResponsiveFontSize("sm") - 2,
                              }}
                            >
                              {item.count}
                            </Text>
                          </View>
                        ))}
                    </View>
                  )}
                </View>
              ) : (
                <Text
                  style={{
                    fontSize: valueFontSize
                      ? valueFontSize
                      : getResponsiveFontSize("3xl"),
                  }}
                  className={`font-bold text-gray-900`}
                >
                  {value}
                </Text>
              )}
              {/* LEFT ICON  */}
              {Icon && iconPosition === "left" && (
                <Icon
                  name={iconName}
                  size={iconSize}
                  color={iconColor}
                  className="ml-2"
                />
              )}
            </>
          )}
          {/* PERCENTAGE */}
          {isPercentage && !showProgress && (
            <View className="flex flex-row items-center mb-1 text-gray-400">
              <Text
                style={{ fontSize: getResponsiveFontSize("md") }}
                className="font-bold text-gray-400"
              >
                {" "}
                /{" "}
              </Text>
              {isLoading ? (
                <View className="h-5 mb-1 w-10 bg-gray-800/5  rounded" />
              ) : (
                <Text
                  style={{ fontSize: getResponsiveFontSize("md") }}
                  className="font-bold text-gray-400"
                >
                  {total}
                </Text>
              )}
            </View>
          )}
        </View>
        {/* PERCENTAGE */}
        {percentage !== undefined && (
          <>
            {isLoading ? (
              <View className="h-5 mb-1 w-10 bg-gray-800/5  rounded" />
            ) : (
              <View className={`bg-base-300 rounded-full px-2 py-1`}>
                <Text
                  style={{ fontSize: getResponsiveFontSize("md") }}
                  className="text-green-700 font-bold mt-1"
                >
                  {percentage}%
                </Text>
              </View>
            )}
          </>
        )}
        {/* CHANGE */}
        {!isPercentage && change !== undefined && (
          <>
            {isLoading ? (
              <View className="h-5 mb-1 w-10 bg-gray-800/5  rounded" />
            ) : (
              <View className={`flex flex-row items-center mt-2`}>
                <View className={`bg-base-300 rounded-full px-5 py-1 w-auto`}>
                  <Text
                    style={{ fontSize: getResponsiveFontSize("md") }}
                    className={`${
                      change >= 0 ? "text-green-700" : "text-red-700"
                    } font-bold `}
                  >
                    {change >= 0 ? `+${change}%` : `${change}%`}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
        {/* SUBTITLE */}
        {!showProgress && subTitle && (
          <>
            {isLoading ? (
              <View className="h-5 mb-1 w-10 bg-gray-800/5  rounded" />
            ) : (
              <Text
                style={{ fontSize: getResponsiveFontSize("sm") }}
                className={`text-gray-600 font-semibold mb-2 opacity-80 mt-1`}
              >
                {subTitle}
              </Text>
            )}
          </>
        )}
      </View>
    );
  }
);

StatCard.displayName = "StatCard";

export default StatCard;
