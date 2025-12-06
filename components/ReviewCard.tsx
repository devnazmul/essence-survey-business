import { useDimension } from "@/hooks/useDimension";
import { formatRole } from "@/utils/formatRole";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const ReviewCard = ({ review }: any) => {
  const { getResponsiveFontSize } = useDimension();
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push(`/review/${review.id}`)}
      className="bg-base-300 p-4 rounded-xl shadow-sm mb-4 border border-gray-100"
    >
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
        <View className="flex-row">
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesome
              key={star}
              name={star <= review.rating ? "star" : "star"}
              size={18}
              color={star <= review.rating ? "#FFD700" : "#E5E7EB"}
              style={{ marginRight: 2 }}
            />
          ))}
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
      {/* TAG  */}
      {review.tags?.length > 0 && (
        <ScrollView horizontal>
          {review.tags.map((tag: string, index: number) => (
            <View
              key={index}
              className={`bg-primary py-0 px-2 mx-1 rounded-md inline justify-center items-center`}
            >
              <Text
                style={{
                  fontSize: getResponsiveFontSize("md"),
                }}
                className="text-base-300 text-center w-full inline"
              >
                {tag}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      {review.responded_at ? (
        <View className="flex-row items-center mt-3">
          <View className="w-3 h-3 rounded-full bg-green-500 mr-2 " />
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
  );
};

export default ReviewCard;
