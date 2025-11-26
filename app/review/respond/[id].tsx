import { TextAreaInputField } from "@/components/InputField";
import Button from "@/components/ui/Button";
import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RespondReviewScreen() {
  const { getResponsiveFontSize } = useDimension();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getReviewById } = useBusinessStore();
  const review = getReviewById(id as string);
  const [response, setResponse] = useState("");

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
          Respond to Review
        </Text>
        <Text />
      </View>

      <ScrollView className="flex-1 pt-4">
        {/* Review Summary Card */}
        <View className="bg-base-300 p-4 rounded-xl border border-gray-200 mb-6">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-row items-center">
              <Image
                source={{ uri: review.avatar }}
                className="w-10 h-10 rounded-full mr-3"
              />
              <View>
                <Text className="font-bold text-gray-900">
                  {review.customerName}
                </Text>
                <View className="flex-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesome
                      key={star}
                      name={star <= review.rating ? "star" : "star"}
                      size={12}
                      color={star <= review.rating ? "#FFD700" : "#E5E7EB"}
                      style={{ marginRight: 2 }}
                    />
                  ))}
                </View>
              </View>
            </View>
            <Text className="text-green-600 text-xs font-medium">
              {review.date}
            </Text>
          </View>
          <Text className="text-gray-700 text-sm leading-5 mt-2">
            {review.comment}
          </Text>
        </View>

        {/* Response Input */}
        <Text className="font-bold text-gray-900 mb-2">Your Public Reply</Text>
        <View className="bg-base-300 p-4 rounded-xl border border-gray-200 overflow-hidden">
          <TextAreaInputField
            placeholder="Write your public response here..."
            value={response}
            onChangeText={setResponse}
            rows={10}
          />
          <View className="items-end pt-2 bg-base-300">
            <Text className="text-primary text-xs">{response.length}/1000</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View className="p-4 bg-base-300 border-t border-gray-200">
        <Button
          label="Submit Response"
          onPress={() => router.back()}
          size="lg"
          textClassName="text-center"
          disabled={!response}
          className={!response ? "bg-gray-300" : ""}
        />
      </View>
    </SafeAreaView>
  );
}
