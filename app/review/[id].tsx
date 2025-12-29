import { singleReview } from "@/api/review";
import IMAGES from "@/assets";
import Header from "@/components/Header";
import HeaderButton from "@/components/HeaderButton";
import Button from "@/components/ui/Button";
import { COLORS } from "@/constants";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useDimension } from "@/hooks/useDimension";
import { formatRole } from "@/utils/formatRole";
import { transformReviewData } from "@/utils/transformReviewData";
import { Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReviewDetailsScreen() {
  const { getResponsiveFontSize } = useDimension();
  const router = useRouter();
  const { id, from } = useLocalSearchParams();

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
  const review = transformReviewData(rawReview as any);

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
            onPress={() => {
              if (from === "notifications") {
                router.replace("/notifications");
              } else {
                router.back();
              }
            }}
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
        <View className="bg-base-300 p-4 rounded-xl border border-gray-200 mb-6">
          {/* User Info */}
          <View className="flex-row items-center mb-4">
            {review?.customer?.avatar ? (
              <Image
                source={{ uri: review?.customer?.avatar }}
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
                {formatRole(review?.customer?.name)}
              </Text>
              <View className="flex-row items-center gap-2">
                {review?.customer?.email && (
                  <Text className="text-gray-500 text-sm">
                    {review?.customer?.email}
                  </Text>
                )}
                {review?.customer?.isGuest && (
                  <View className="bg-gray-200 px-2 py-0.5 mt-1 rounded">
                    <Text className="text-gray-600 text-xs">Guest</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Overall Rating */}
          <View className="flex-row items-center mb-4">
            <View className="flex-row mr-2">
              {[1, 2, 3, 4, 5].map((star, index) => (
                <FontAwesome
                  key={index}
                  name="star"
                  size={25}
                  color={star <= review?.overallRating ? "#FFD700" : "#E5E7EB"}
                  style={{ marginRight: 4 }}
                />
              ))}
            </View>
            <Text className="text-lg font-bold text-gray-900">
              ({review?.overallRating?.toFixed(1)})
            </Text>
          </View>

          {/* Status Badge */}
          <View className="flex-row items-center">
            <View
              className={`px-3 py-1 rounded-full ${
                review?.status === "Replied" ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              <Text
                className={`font-medium text-sm ${
                  review?.status === "Replied"
                    ? "text-green-800"
                    : "text-yellow-800"
                }`}
              >
                {review?.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Questions and Answers */}
        {review?.questions?.length > 0 && (
          <View className="bg-base-300 p-4 rounded-xl border border-gray-200 mb-6">
            <Text
              style={{
                fontSize: getResponsiveFontSize("lg"),
              }}
              className="font-bold text-gray-900 mb-3"
            >
              Question Responses
            </Text>
            {review?.questions?.map((question, index) => (
              <View
                key={index}
                className={`${index !== review?.questions?.length - 1 ? "mb-4 pb-4 border-b border-gray-200" : ""}`}
              >
                <Text
                  style={{
                    fontSize: getResponsiveFontSize("md"),
                  }}
                  className="text-gray-700 font-medium mb-2"
                >
                  {question.questionText}
                </Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    {/* Rating Display */}
                    <View className="flex-row mr-2">
                      {Array.from({ length: question.maxValue }).map(
                        (_, idx) => {
                          switch (question.answerType) {
                            case "numbers":
                              return (
                                <View
                                  key={idx}
                                  className={`${question.value === idx + 1 ? "bg-green-400" : "bg-gray-200"} justify-center items-center w-7 h-7 rounded-md mx-1`}
                                >
                                  <Text
                                    className={`${question.value === idx + 1 ? "text-base-300" : "text-gray-600"}`}
                                  >
                                    {idx + 1}
                                  </Text>
                                </View>
                              );

                            case "heart":
                              return (
                                <FontAwesome
                                  key={idx}
                                  name={"heart"}
                                  size={25}
                                  color={
                                    idx < question.value ? `#FF6B6B` : "#E5E7EB"
                                  }
                                  className="mx-1"
                                />
                              );
                            case "emoji":
                              const emojiIndex: string = `emoji${idx + 1}`;
                              return (
                                <View key={idx}>
                                  <Image
                                    style={{
                                      width: 30,
                                      height: 30,
                                      transform: [
                                        {
                                          scale:
                                            question.value === idx + 1
                                              ? 1.2
                                              : 0.9,
                                        },
                                      ],
                                      marginHorizontal:
                                        question.value === idx + 1 ? 5 : 0,
                                    }}
                                    source={
                                      question.value === idx + 1
                                        ? IMAGES.rating[
                                            emojiIndex as keyof typeof IMAGES.rating
                                          ]
                                        : IMAGES.rating[
                                            `${emojiIndex}Gray` as keyof typeof IMAGES.rating
                                          ]
                                    }
                                  />
                                </View>
                              );

                            default:
                              return (
                                <FontAwesome
                                  key={idx}
                                  name={"star"}
                                  size={25}
                                  color={
                                    idx < question.value ? "#FFD700" : "#E5E7EB"
                                  }
                                  className="mx-1"
                                />
                              );
                          }
                        }
                      )}
                    </View>
                    <Text className="text-gray-600 font-semibold">
                      ({question.value}/{question.maxValue})
                    </Text>
                  </View>
                  {/* Tag Label */}
                  {question.tagLabel && (
                    <View className="bg-primary px-3 py-1 rounded-full">
                      <Text className="text-base-300 text-sm font-medium">
                        {question.tagLabel}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Full Comment */}
        {review?.comment && (
          <View className="mb-6">
            <Text className="font-bold text-gray-900 mb-2">Comment</Text>
            <View className="bg-base-300 p-4 rounded-xl border border-gray-200">
              <Text className="text-gray-400 leading-6 font-medium">
                {review?.comment}
              </Text>
            </View>
          </View>
        )}

        {/* Key Phrases */}
        {/* {review?.keyPhrases?.length > 0 && (
          <View className="bg-base-300 p-4 rounded-xl border border-gray-200 mb-6">
            <Text className="font-bold text-gray-900 mb-2">Key Phrases</Text>
            <View className="flex-row flex-wrap gap-2">
              {review?.keyPhrases?.map((phrase, index) => (
                <View
                  key={index}
                  className="bg-blue-100 px-3 py-1 rounded-full"
                >
                  <Text className="text-blue-800 text-sm">{phrase}</Text>
                </View>
              ))}
            </View>
          </View>
        )} */}

        {/* Topics */}
        {/* {review?.topics?.length > 0 && (
          <View className="bg-base-300 p-4 rounded-xl border border-gray-200 mb-6">
            <Text className="font-bold text-gray-900 mb-2">Topics</Text>
            <View className="flex-row flex-wrap gap-2">
              {review?.topics?.map((topic, index) => (
                <View key={index} className="bg-primary px-3 py-1 rounded-full">
                  <Text className="text-base-300 text-sm">{topic}</Text>
                </View>
              ))}
            </View>
          </View>
        )} */}

        {/* Voice Review */}
        {/* {review?.isVoiceReview && review?.voiceUrl && (
          <View className="bg-base-300 p-4 rounded-xl border border-gray-200 mb-6">
            <Text className="font-bold text-gray-900 mb-2">Voice Review</Text>
            <View className="flex-row items-center">
              <FontAwesome name="microphone" size={20} color={COLORS.primary} />
              <Text className="text-gray-600 ml-2">
                Duration: {review?.voiceDuration}s
              </Text>
            </View>
          </View>
        )} */}

        {review?.replyContent && (
          <View className="mb-6">
            <Text className="font-bold text-gray-900 mb-2">Replay</Text>
            <View className="bg-base-300 flex-row items-start p-4 rounded-xl border border-l-4 border-l-green-500 border-gray-200">
              <Entypo
                name="reply"
                size={15}
                color={COLORS["green-500"]}
                className={`mr-4`}
              />
              <Text className="text-gray-400 pr-6 leading-6 font-medium">
                {review?.replyContent}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Button */}
      {!review?.replyContent && (
        <View className="p-4 bg-base-300 border-t border-gray-200">
          <Button
            label="Respond to Review"
            onPress={() => router.push(`/review/respond/${review?.id}`)}
            size="lg"
            textClassName="text-center"
          />
        </View>
      )}
    </SafeAreaView>
  );
}
