import { updateNotification } from "@/api/notification";
import IMAGES from "@/assets";
import Header from "@/components/Header";
import HeaderButton from "@/components/HeaderButton";
import ProfileDropdown from "@/components/ProfileDropdown";
import ScreenTitle from "@/components/ScreenTitle";
import { COLORS } from "@/constants";
import { useNotifications } from "@/hooks/useNotifications";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const {
    notifications,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefreshing,
    totalCount,
    unreadCount,
  } = useNotifications(20, activeTab === "Unread" ? "unread" : "");

  const queryClient = useQueryClient();

  const markReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      updateNotification(notificationId, { status: "read" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleNotificationPress = (notification: any) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }
    if (notification.entityId) {
      router.push(`/review/${notification.entityId}?from=notifications`);
    }
  };

  const filteredNotifications = notifications;

  const groupedNotifications = useMemo(() => {
    const groups: { [key: string]: any[] } = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };

    filteredNotifications.forEach((n) => {
      groups[n.dateGroup].push(n);
    });

    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  }, [filteredNotifications]);

  const NotificationIcon = ({
    type,
    originalType,
  }: {
    type: string;
    originalType?: string;
  }) => {
    if (originalType === "new_review") {
      return (
        <View className="w-10 h-10 rounded-full bg-yellow-100 justify-center items-center mr-3">
          <FontAwesome name="star-o" size={20} color="#EAB308" />
        </View>
      );
    }
    if (originalType === "low_rating_review") {
      return (
        <View className="w-10 h-10 rounded-full bg-red-100 justify-center items-center mr-3">
          <MaterialIcons name="report-problem" size={20} color="#EF4444" />
        </View>
      );
    }
    return (
      <View className="w-10 h-10 rounded-full bg-blue-100 justify-center items-center mr-3">
        <Feather name="bell" size={20} color="#3B82F6" />
      </View>
    );
  };

  const renderNotification = ({
    item: [date, items],
  }: {
    item: [string, any[]];
  }) => (
    <View key={date} className="mb-6">
      <Text className="text-lg font-bold text-gray-900 mb-3">{date}</Text>
      {items.map((notification) => (
        <TouchableOpacity
          key={notification.id}
          onPress={() => handleNotificationPress(notification)}
          className="relative flex-row items-center bg-base-300 p-4 rounded-xl mb-3 shadow-sm"
        >
          <View
            className={`w-4 h-4 rounded-full ${!notification.isRead ? "bg-blue-500" : "bg-transparent"} absolute -left-2 bottom-1/2 -translate-y-1/2`}
          />

          <View className={"ml-2"}>
            <NotificationIcon
              type={notification.type}
              originalType={notification.originalType}
            />
          </View>
          <View className="flex-1">
            <View className="flex-row justify-between items-start">
              <Text className="font-bold text-gray-900 text-base">
                {notification.title}
              </Text>
              <Text className="text-gray-400 text-xs text-right">
                {notification.time}
              </Text>
            </View>
            <Text className="text-gray-500 text-sm mt-1">
              {notification.description}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
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
        rightComponent={<ProfileDropdown />}
      />

      <ScreenTitle title="Notifications" />

      {/* Tabs */}
      <View className="flex-row mb-4">
        <TouchableOpacity
          onPress={() => setActiveTab("All")}
          className={`flex-1 py-2 items-center rounded-l-lg border border-primary-content ${
            activeTab === "All" ? "bg-primary" : "bg-gray-100"
          }`}
        >
          <Text
            className={`font-medium ${
              activeTab === "All" ? "text-base-300" : "text-gray-500"
            }`}
          >
            All {totalCount > 0 && `(${totalCount})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("Unread")}
          className={`flex-1 py-2 items-center rounded-r-lg border border-primary-content ${
            activeTab === "Unread" ? "bg-primary" : "bg-gray-100"
          }`}
        >
          <Text
            className={`font-medium ${
              activeTab === "Unread" ? "text-base-300" : "text-gray-500"
            }`}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && !isRefreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={groupedNotifications}
          keyExtractor={(item) => item[0]}
          renderItem={renderNotification}
          className="flex-1"
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refetch}
              tintColor={COLORS.primary}
            />
          }
          ListFooterComponent={() =>
            isFetchingNextPage ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : (
              <View className="h-10" />
            )
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pt-10">
              <Text className="text-gray-400">No Notifications</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
