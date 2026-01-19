import { useDimension } from "@/hooks/useDimension";
import { formatRole } from "@/utils/formatRole";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ReviewCard = React.memo(({ review }: any) => {
  const { getResponsiveFontSize, WP } = useDimension();
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
          <View className={`gap-y-1`}>
            <Sentiment sentiment={review.sentiment} />
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
                ({review.rating.toFixed(1) || 0})
              </Text>
            </View>
          </View>
        </View>
        {!!review.comment && (
          <View className={`bg-gray-100 p-2 rounded-lg mb-3`}>
            <Text
              style={{
                fontSize: getResponsiveFontSize("md"),
              }}
              className="text-gray-400 italic"
              numberOfLines={3}
            >
              {review.comment}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* TAGS  */}
      {/* {review.tags?.length > 0 && (
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
      )} */}

      <View className={`flex-row items-center justify-between`}>
        <TouchableOpacity onPress={() => router.push(`/review/${review.id}`)}>
          {review.responded_at ? (
            <View className="flex-row items-center">
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
            <View className="flex-row items-center">
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

        <View className={`flex-row items-center gap-x-1 justify-end`}>
          {review?.status && (
            <BadgeWithIcon
              size={{ height: WP("4%") }}
              containerClassName="bg-orange-400"
              // IconProvider={MaterialCommunityIcons}
              // iconName="keyboard-outline"
              // iconSize={WP("3%")}
              // iconColor="black"
              label={formatRole(review?.status)}
              labelClassName="mx-2"
            />
          )}
          {review?.is_voice_review ? (
            <BadgeWithIcon
              size={{ width: WP("4%"), height: WP("4%") }}
              containerClassName="bg-yellow-400"
              IconProvider={Feather}
              iconName="mic"
              iconSize={WP("3%")}
              iconColor="black"
              // label="Voice"
              // labelClassName="text-xs"
            />
          ) : (
            <BadgeWithIcon
              size={{ width: WP("4%"), height: WP("4%") }}
              containerClassName="bg-cyan-400"
              IconProvider={MaterialCommunityIcons}
              iconName="keyboard-outline"
              iconSize={WP("3%")}
              iconColor="black"
              // label="Text"
              // labelClassName="text-xs"
            />
          )}
        </View>
      </View>
    </View>
  );
});

ReviewCard.displayName = "ReviewCard";

export default ReviewCard;

// BADGE WITH ICON COMPONENT
export const BadgeWithIcon = ({
  containerClassName = "bg-yellow-400",
  size,
  IconProvider,
  iconName,
  iconSize,
  iconColor,
  label,
  labelClassName,
}: {
  containerClassName?: string;
  size: { width?: number; height: number };
  IconProvider?: any;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  label?: string;
  labelClassName?: string;
}) => {
  const { getResponsiveFontSize } = useDimension();
  return (
    <View
      style={{
        width: size.width || "auto",
        height: size.height,
      }}
      className={`rounded-full  flex-row gap-x-1 justify-center items-center ${containerClassName}`}
    >
      {IconProvider && (
        <IconProvider name={iconName} size={iconSize} color={iconColor} />
      )}
      {label && (
        <Text
          style={{
            fontSize: getResponsiveFontSize("xs"),
          }}
          className={`font-bold ${labelClassName}`}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

// SENTIMENT COMPONENT
export const Sentiment = ({ sentiment }: { sentiment: string }) => {
  const formatedSentiment = formatRole(sentiment);
  const { getResponsiveFontSize } = useDimension();
  switch (sentiment) {
    case "very_positive":
      return (
        <Text
          style={{
            fontSize: getResponsiveFontSize("xs"),
          }}
          className={`text-right font-bold text-green-500`}
        >
          {formatedSentiment}
        </Text>
      );

    case "positive":
      return (
        <Text
          style={{
            fontSize: getResponsiveFontSize("xs"),
          }}
          className={`text-right font-bold text-blue-500`}
        >
          {formatedSentiment}
        </Text>
      );

    case "negative":
      return (
        <Text
          style={{
            fontSize: getResponsiveFontSize("xs"),
          }}
          className={`text-right font-bold text-red-500`}
        >
          {formatedSentiment}
        </Text>
      );

    case "neutral":
      return (
        <Text
          style={{
            fontSize: getResponsiveFontSize("xs"),
          }}
          className={`text-right font-bold text-gray-400`}
        >
          {formatedSentiment}
        </Text>
      );

    default:
      return (
        <Text
          style={{
            fontSize: getResponsiveFontSize("xs"),
          }}
          className={`text-right font-bold text-xs`}
        >
          {formatedSentiment}
        </Text>
      );
  }
};
