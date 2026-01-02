import { respondToReview, singleReview } from "@/api/review";
import IMAGES from "@/assets";
import Header from "@/components/Header";
import HeaderButton from "@/components/HeaderButton";
import { TextAreaInputField } from "@/components/InputField";
import { SuccessModal } from "@/components/modals/SuccessModal";
import Button from "@/components/ui/Button";
import { COLORS } from "@/constants";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useDimension } from "@/hooks/useDimension";
import { formatRole } from "@/utils/formatRole";
import { transformReviewData } from "@/utils/transformReviewData";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RespondReviewScreen() {
  const { getResponsiveFontSize } = useDimension();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [response, setResponse] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch review data
  const {
    data: rawReview,
    isLoading,
    isFetching,
    refetch,
  } = useCustomQuery({
    queryKey: ["review", id],
    queryFunc: () => singleReview(id as string),
  });

  // Transform the review data
  console.log({ rawReview });

  const review = transformReviewData(rawReview as any);

  // Submit response mutation
  const { mutate: submitResponse, isLoading: isSubmitting } = useCustomMutation(
    {
      mutationFn: (responseText: string) =>
        respondToReview(id as string, responseText),
      onSuccess: () => {
        setShowSuccessModal(true);
      },
      onError: () => {
        Alert.alert("Error", "Failed to submit response. Please try again.", [
          { text: "OK" },
        ]);
      },
    }
  );

  const handleSubmit = () => {
    if (!response.trim()) {
      Alert.alert("Error", "Please enter a response before submitting.");
      return;
    }

    if (response.length > 1000) {
      Alert.alert("Error", "Response must be 1000 characters or less.");
      return;
    }

    submitResponse(response);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-base-100">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text className="mt-4 text-gray-600">Loading review...</Text>
      </SafeAreaView>
    );
  }

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
      <Header
        leftComponent={
          <HeaderButton
            IconComponent={Feather}
            iconName="arrow-left"
            iconSize={20}
            onPress={() => router.back()}
          />
        }
        centerComponent={<Image source={IMAGES.logo} className={`w-16 h-16`} />}
      />

      <ScrollView
        className="flex-1 pt-4"
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        {/* Review Summary Card */}
        <View className="bg-base-300 p-4 rounded-xl border border-gray-200 mb-6">
          {/* User Info */}
          <View className="flex-row items-center mb-4">
            {review.customer.avatar ? (
              <Image
                source={{ uri: review.customer.avatar }}
                className="w-12 h-12 rounded-full mr-3"
              />
            ) : (
              <View className="w-12 h-12 rounded-xl mr-3 bg-primary justify-center items-center">
                <FontAwesome
                  name="user-o"
                  size={24}
                  color={COLORS["base-300"]}
                />
              </View>
            )}
            <View className="flex-1">
              <Text
                style={{ fontSize: getResponsiveFontSize("lg") }}
                className="font-bold text-gray-900"
              >
                {formatRole(review.customer.name)}
              </Text>
              <View className="flex-row items-center gap-2">
                {review.customer.email && (
                  <Text className="text-gray-500 text-sm">
                    {review.customer.email}
                  </Text>
                )}
                {review.customer.isGuest && (
                  <View className="bg-gray-200 px-2 py-0.5 rounded">
                    <Text className="text-gray-600 text-xs">Guest</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Overall Rating */}
          <View className="flex-row items-center mb-4">
            <View className="flex-row mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome
                  key={star}
                  name="star"
                  size={25}
                  color={star <= review.overallRating ? "#FFD700" : "#E5E7EB"}
                  style={{ marginRight: 4 }}
                />
              ))}
            </View>
            <Text className="text-lg font-bold text-gray-900">
              ({review.overallRating.toFixed(1)})
            </Text>
          </View>

          {/* Status Badge */}
          <View className="flex-row items-center mb-4">
            <View
              className={`px-3 py-1 rounded-full ${
                review.status === "Replied" ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              <Text
                className={`font-medium text-sm ${
                  review.status === "Replied"
                    ? "text-green-800"
                    : "text-yellow-800"
                }`}
              >
                {review.status}
              </Text>
            </View>
          </View>

          {/* Comment */}
          {review.comment && (
            <View className="mt-2">
              <Text className="font-bold text-gray-900 mb-1">Comment:</Text>
              <Text className="text-gray-700 text-sm leading-5">
                {review.comment}
              </Text>
            </View>
          )}
        </View>

        {/* Response Input */}
        <Text
          style={{
            fontSize: getResponsiveFontSize("lg"),
          }}
          className="font-bold text-gray-900 mb-2"
        >
          Your Public Reply
        </Text>

        <View className="bg-base-300 p-4 rounded-xl border border-gray-200 overflow-hidden">
          <TextAreaInputField
            placeholder="Write your public response here..."
            value={response}
            onChangeText={(e: any) => {
              setResponse(e.target.value);
            }}
            rows={10}
          />
          <View className="items-end pt-2 bg-base-300">
            <Text
              className={`text-xs ${response.length > 1000 ? "text-red-500" : "text-primary"}`}
            >
              {response.length}/1000
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View className="p-4 bg-base-300 border-t border-gray-200">
        <Button
          label={isSubmitting ? "Submitting..." : "Submit Response"}
          onPress={handleSubmit}
          size="lg"
          textClassName="text-center"
          disabled={!response.trim() || isSubmitting || response.length > 1000}
          className={
            !response.trim() || isSubmitting || response.length > 1000
              ? "bg-gray-300"
              : ""
          }
        />
      </View>

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.back();
        }}
        title="Reply Submitted!"
        message="Your response has been successfully posted. It will now be visible to the customer."
        buttonText="Back to Review"
      />
    </SafeAreaView>
  );
}
