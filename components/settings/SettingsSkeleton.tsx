import React from "react";
import { View } from "react-native";

export default function SettingsSkeleton() {
  return (
    <View className="flex-1 bg-base-300 rounded-xl p-4 shadow-sm border border-gray-100">
      {/* Header Skeleton */}
      <View className="flex-row items-center mb-6 gap-2">
        <View className="bg-gray-200 p-2 rounded-lg mr-3 w-10 h-10 animate-pulse" />
        <View className="bg-gray-200 h-6 w-32 rounded animate-pulse" />
      </View>

      {/* Logo Skeleton */}
      <View className="items-center mb-6 gap-2">
        <View className="w-24 h-24 bg-gray-200 rounded-xl mb-2 animate-pulse" />
        <View className="bg-gray-200 h-4 w-16 rounded mb-1 animate-pulse" />
        <View className="bg-gray-200 h-3 w-24 rounded animate-pulse" />
      </View>

      {/* Form Fields Skeleton */}
      <View className="space-y-4 gap-2">
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item}>
            <View className="bg-gray-200 h-4 w-24 rounded mb-2 animate-pulse" />
            <View className="bg-gray-200 h-12 rounded-lg animate-pulse" />
          </View>
        ))}

        {/* Text area skeleton */}
        <View className="gap-2">
          <View className="bg-gray-200 h-4 w-20 rounded mb-2 animate-pulse" />
          <View className="bg-gray-200 h-32 rounded-lg animate-pulse" />
        </View>
      </View>
    </View>
  );
}
