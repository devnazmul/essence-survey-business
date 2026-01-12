import { useDimension } from "@/hooks/useDimension";
import { formatRole } from "@/utils/formatRole";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ReviewCard = React.memo(({ review }: any) => {
  const { getResponsiveFontSize } = useDimension();
  const router = useRouter();
  return (
    <View className="bg-base-300 p-4 rounded-xl shadow-sm mb-4 border border-gray-100">
      <TouchableOpacity onPress={() => router.push(`/review/${review.id}`)}>
        <View className="flex-row justify-between items-start mb-2">
          <View>
            <Text
              style={{
                fontSize: getResponsiveFontSize("lg"),
              }}
              className="font-bold text-gray-900"
            >
              {formatRole(review.customerName)}
            </Text>
            <Text
              style={{
                fontSize: getResponsiveFontSize("sm"),
              }}
              className="text-gray-400"
            >
              {review.date}
            </Text>
          </View>
          <View className="flex-row items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name="star"
                size={16}
                color={star <= review.rating ? "#FFD166" : "#E5E7EB"}
                style={{ marginRight: 2 }}
              />
            ))}
            <Text className="ml-2 text-gray-400 font-bold text-xs">
              {review.rating.toFixed(1)}
            </Text>
          </View>
        </View>
        {!!review.comment && (
          <View className={`bg-gray-100 p-2 rounded-lg mb-3`}>
            <Text
              style={{
                fontSize: getResponsiveFontSize("md"),
              }}
              className="text-gray-600"
              numberOfLines={3}
            >
              {review.comment}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* TAGS  */}
      {review.tags?.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-2">
          {review.tags.map((tag: string, index: number) => (
            <View
              key={index}
              className="bg-green-50 border border-green-100 py-1 px-3 rounded-full"
            >
              <Text
                style={{
                  fontSize: getResponsiveFontSize("xs") || 10,
                }}
                className="text-green-700 font-bold text-center"
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity onPress={() => router.push(`/review/${review.id}`)}>
        {review.responded_at ? (
          <View className="flex-row items-center mt-3">
            <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <Text
              style={{
                fontSize: getResponsiveFontSize("sm"),
              }}
              className="text-green-500 font-medium"
            >
              Replied
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center mt-3">
            <View className="w-3 h-3 rounded-full bg-red-500 mr-2 " />
            <Text
              style={{
                fontSize: getResponsiveFontSize("sm"),
              }}
              className="text-red-500 font-medium"
            >
              Reply needed
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
});

ReviewCard.displayName = "ReviewCard";

export default ReviewCard;
