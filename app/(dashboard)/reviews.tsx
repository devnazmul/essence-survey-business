import IMAGES from "@/assets";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import HeaderButton from "@/components/HeaderButton";
import ReviewCard from "@/components/ReviewCard";
import ScreenTitle from "@/components/ScreenTitle";
import { COLORS } from "@/constants";
import { useReviews } from "@/hooks/useReviews";
import { useAuthStore } from "@/store/useAuthStore";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReviewsScreen() {
  const router = useRouter();
  const {
    reviews,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefreshing,
  } = useReviews(20);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.replace("/signin");
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return <View className="h-20" />;
    return (
      <View className="py-4 items-center justify-center mb-20">
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
      {/* Header */}
      <Header
        leftComponent={
          <HeaderButton
            IconComponent={Feather}
            iconName="bell"
            iconSize={20}
            onPress={() => router.push("/notifications")}
          />
        }
        centerComponent={<Image source={IMAGES.logo} className={`w-16 h-16`} />}
        rightComponent={
          <HeaderButton
            IconComponent={AntDesign}
            iconName="logout"
            onPress={handleLogout}
          />
        }
      />

      <ScreenTitle title="All Reviews" />

      {isLoading && !isRefreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ReviewCard review={item} />}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pt-10">
              <Text className="text-gray-400">No Reviews Found</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refetch}
              tintColor={COLORS.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          className="flex-1"
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab="reviews" />
    </SafeAreaView>
  );
}
