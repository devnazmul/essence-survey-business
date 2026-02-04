import { COLORS } from "@/constants";
import { useDashboardReviews } from "@/hooks/useDashboard";
import { useDimension } from "@/hooks/useDimension";
import { useBusinessStore } from "@/store/useBusinessStore";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import ReviewCard from "../ReviewCard";

interface IDashboardRecentReviewsProps {}
const DashboardRecentReviews: React.FC<IDashboardRecentReviewsProps> = () => {
  const reviews = useBusinessStore((state) => state.reviews);
  const { getResponsiveFontSize } = useDimension();
  const { isLoading, refetch } = useDashboardReviews("last_30_days");

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Recent Reviews Header */}
      <View className="flex-row justify-between items-center mb-4 mt-2">
        <Text
          style={{
            fontSize: getResponsiveFontSize("xl"),
          }}
          className="font-bold text-gray-900"
        >
          Recent Reviews
        </Text>
        <TouchableOpacity onPress={() => router.push("/reviews" as any)}>
          <Text
            style={{
              fontSize: getResponsiveFontSize("sm"),
            }}
            className="text-primary font-medium"
          >
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reviews List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <>
          {reviews.length === 0 ? (
            <View className="flex-1 items-center justify-center min-h-[200px]">
              <Text className="text-gray-400">No Reviews</Text>
            </View>
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </>
      )}
    </>
  );
};

export default DashboardRecentReviews;
