import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const { getResponsiveFontSize, getResponsiveHeight, WP } = useDimension();
  const router = useRouter();
  const { user, stats, reviews } = useBusinessStore();

  // =====================
  // START COMPONENTS
  // =====================
  const StatCard = ({ title, value, change, fullWidth = false }: any) => (
    <View
      className={`bg-base-300 p-4 rounded-xl shadow-sm mb-4 ${fullWidth ? "w-full" : "w-[48%]"}`}
    >
      <Text className="text-gray-500 text-sm mb-1">{title}</Text>
      <Text className="text-2xl font-bold text-gray-900">{value}</Text>
      <Text className="text-green-600 text-xs font-medium mt-1">
        +{change}%
      </Text>
    </View>
  );

  const ReviewCard = ({ review }: any) => (
    <TouchableOpacity
      onPress={() => router.push(`/review/${review.id}`)}
      className="bg-base-300 p-4 rounded-xl shadow-sm mb-4 border border-gray-100"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text
            style={{
              fontSize: getResponsiveFontSize("md"),
            }}
            className="font-bold text-gray-900"
          >
            {review.customerName}
          </Text>
          <Text
            style={{
              fontSize: getResponsiveFontSize("xs"),
            }}
            className="text-gray-400 text-xs "
          >
            {review.date}
          </Text>
        </View>
        <View className="flex-row">
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesome
              key={star}
              name={star <= review.rating ? "star" : "star"}
              size={14}
              color={star <= review.rating ? "#FFD700" : "#E5E7EB"}
              style={{ marginRight: 2 }}
            />
          ))}
        </View>
      </View>
      <View className={`bg-gray-100 p-2 rounded-lg mb-3`}>
        <Text
          style={{
            fontSize: getResponsiveFontSize("sm"),
          }}
          className="text-gray-600 text-sm"
          numberOfLines={3}
        >
          {review.comment}
        </Text>
      </View>
      {review.status === "pending" && (
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-red-500 mr-2" />
          <Text className="text-red-500 text-xs font-medium">Reply needed</Text>
        </View>
      )}
      {review.status === "replied" && (
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
          <Text className="text-green-500 text-xs font-medium">Replied</Text>
        </View>
      )}
    </TouchableOpacity>
  );
  // =====================
  // END COMPONENTS
  // =====================
  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center bg-primary p-2 rounded-lg">
          <MaterialIcons
            name="storefront"
            size={20}
            color={COLORS["base-300"]}
          />
        </View>
        <Text
          style={{ fontSize: getResponsiveFontSize("lg") }}
          className="font-bold text-primary"
        >
          {user.name}
        </Text>
        <TouchableOpacity
          className="flex-row items-center bg-primary p-2 rounded-lg"
          onPress={() => router.push("/notifications")}
        >
          <Feather name="bell" size={20} color={COLORS["base-300"]} />
        </TouchableOpacity>
      </View>

      <Text className="text-3xl font-bold text-gray-900 mb-4">Dashboard</Text>

      {/* Filters */}
      <View className="flex-row gap-2 mb-6">
        <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg">
          <Text className="text-white font-medium">Last 7 days</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-lg">
          <Text className="text-gray-600 font-medium">Last 30 days</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-lg">
          <Text className="text-gray-600 font-medium">All time</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View className="flex-row flex-wrap justify-between">
        <StatCard
          title="Avg. Rating"
          value={stats.avgRating}
          change={stats.ratingChange}
        />
        <StatCard
          title="Total Reviews"
          value={stats.totalReviews.toLocaleString()}
          change={stats.reviewsChange}
        />
        <StatCard
          title="New Reviews"
          value={stats.newReviews}
          change={stats.newReviewsChange}
          fullWidth
        />
      </View>

      {/* Recent Reviews Header */}
      <View className="flex-row justify-between items-center mb-4 mt-2">
        <Text className="text-xl font-bold text-gray-900">Recent Reviews</Text>
        <TouchableOpacity>
          <Text className="text-primary font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1  mb-20">
        {/* Reviews List */}
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-base-300 border-t border-gray-200 flex-row justify-around py-4 pb-6">
        <TouchableOpacity className="items-center">
          <MaterialIcons name="dashboard" size={24} color="#10B981" />
          <Text className="text-green-600 text-xs mt-1 font-medium">
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <MaterialIcons name="star-border" size={24} color="#9CA3AF" />
          <Text className="text-gray-400 text-xs mt-1 font-medium">
            Reviews
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <MaterialIcons name="bar-chart" size={24} color="#9CA3AF" />
          <Text className="text-gray-400 text-xs mt-1 font-medium">
            Analytics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Feather name="settings" size={24} color="#9CA3AF" />
          <Text className="text-gray-400 text-xs mt-1 font-medium">
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
