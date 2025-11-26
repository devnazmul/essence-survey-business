import Button from "@/components/ui/Button";
import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReviewDetailsScreen() {
  const { getResponsiveFontSize } = useDimension();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getReviewById } = useBusinessStore();
  const review = getReviewById(id as string);

  if (!review) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-base-100">
        <Text>Review not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center bg-primary p-2 rounded-lg"
        >
          <Feather name="arrow-left" size={20} color={COLORS["base-300"]} />
        </TouchableOpacity>
        <Text
          style={{ fontSize: getResponsiveFontSize("lg") }}
          className="font-bold text-primary"
        >
          Review Details
        </Text>
        <Text />
      </View>

      <ScrollView className="flex-1 pt-4">
        {/* User Info */}
        <View className="flex-row items-center mb-4">
          <Image
            source={{ uri: review.avatar }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View>
            <Text className="text-lg font-bold text-gray-900">
              {review.customerName}
            </Text>
            <Text className="text-gray-500">{review.date}</Text>
          </View>
        </View>

        {/* Rating */}
        <View className="flex-row items-center mb-6">
          <View className="flex-row mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name={star <= review.rating ? "star" : "star"}
                size={20}
                color={star <= review.rating ? "#FFD700" : "#E5E7EB"}
                style={{ marginRight: 4 }}
              />
            ))}
          </View>
          <Text className="text-lg font-bold text-gray-900">
            {review.rating.toFixed(1)}
          </Text>
        </View>

        {/* What went well */}
        <Text className="font-bold text-gray-900 mb-2">What went well</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {review.tags.map((tag, index) => (
            <View key={index} className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-800 font-medium">{tag}</Text>
            </View>
          ))}
        </View>

        {/* Areas for improvement */}
        {review.rating < 5 && (
          <>
            <Text className="font-bold text-gray-900 mb-2">
              Areas for improvement
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              <View className="bg-red-100 px-3 py-1 rounded-full">
                <Text className="text-red-800 font-medium">Wait Time</Text>
              </View>
            </View>
          </>
        )}

        {/* Full Comment */}
        <Text className="font-bold text-gray-900 mb-2">Full Comment</Text>
        <View className="bg-base-300 p-4 rounded-xl border border-gray-200 mb-6">
          <Text className="text-gray-700 leading-6">{review.comment}</Text>
        </View>

        {/* Additional Feedback */}
        <Text className="font-bold text-gray-900 mb-2">
          Additional Feedback
        </Text>
        <View className="bg-base-300 p-4 rounded-xl border border-gray-200 mb-8">
          <Text className="text-gray-400 italic">
            {review.additionalFeedback}
          </Text>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View className="p-4 bg-base-300 border-t border-gray-200">
        <Button
          label="Respond to Review"
          onPress={() => router.push(`/review/respond/${review.id}`)}
          size="lg"
          textClassName="text-center"
        />
      </View>
    </SafeAreaView>
  );
}
