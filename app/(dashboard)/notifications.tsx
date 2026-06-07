import { updateNotification } from "@/api/notification";
import IMAGES from "@/assets";
import Header from "@/components/Header";
import ScreenTitle from "@/components/ScreenTitle";
import { COLORS } from "@/constants";
import { useNotification } from "@/context/useNotification";
import { useNotifications } from "@/hooks/useNotifications";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const { setIsNotificationChanged } = useNotification();
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

  // useEffect(() => {
  //   console.log({ notifications });
  // }, [notifications]);

  const queryClient = useQueryClient();

  const markReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      updateNotification(notificationId, { status: "read" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      updateNotification("all", { status: "read" }), // Assuming API supports 'all' or similar, otherwise loop. For UI demo we'll just invalidate.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleNotificationPress = (notification: any) => {
    setIsNotificationChanged(Math.random());
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }

    switch (notification.type) {
      case "new_review":
        if (notification.entityId) {
          router.push(`/review/${notification.entityId}?from=notifications`);
        }
        break;

      case "low_rating_review":
        if (notification.entityId) {
          router.push(`/review/${notification.entityId}?from=notifications`);
        }
        break;

      case "update":
        break;
      default:
        if (notification.entityId) {
          router.push(`/review/${notification.entityId}?from=notifications`);
        }
        break;
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
      if (groups[n.dateGroup]) {
        groups[n.dateGroup].push(n);
      } else {
        // Fallback if dateGroup doesn't match keys
        if (!groups["Earlier"]) groups["Earlier"] = [];
        groups["Earlier"].push(n);
      }
    });

    // console.log({ groups });
    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  }, [filteredNotifications]);

  const NotificationIcon = ({ notification }: { notification: any }) => {
    // console.log({ notifi/cation });
    const { type, originalType, isRead, data, title } = notification;

    // Determine icon based on content/type
    // Assuming 'data' might contain rating, or we infer from type/title
    // For now using simple logic:

    let IconComp: any = Feather;
    let iconName: any = "bell";
    let bgClass = "bg-gray-100";
    let iconColor = "#9CA3AF"; // Default gray

    if (originalType === "new_review") {
      // Mocking rating logic if not explicitly available.
      // In real app, check notification.data.rating
      // Here we can guess based on random or just default to happy for demo if unknown
      const rating = Number(
        notification.originalType === "new_review"
          ? notification.description
              .split("A new review with rating ")[1]
              .split(" has been submitted.")[0]
          : 0,
      );
      if (rating >= 4) {
        IconComp = MaterialIcons;
        iconName = "emoji-emotions";
        bgClass = "bg-green-100";
        iconColor = "#22C55E"; // Green-500
      } else if (rating === 3) {
        IconComp = MaterialCommunityIcons;
        iconName = "emoticon-sad";
        bgClass = "bg-yellow-100";
        iconColor = "#EAB308"; // Yellow-500
      }
    } else if (originalType === "staff_update") {
      IconComp = Feather;
      iconName = "users";
      bgClass = "bg-blue-100";
      iconColor = "#3B82F6";
    } else if (originalType === "insight") {
      IconComp = MaterialCommunityIcons;
      iconName = "lightbulb-on-outline";
      bgClass = "bg-gray-100";
      iconColor = "#6B7280";
    } else if (originalType === "low_rating_review") {
      IconComp = MaterialCommunityIcons;
      iconName = "alert-rhombus";
      bgClass = "bg-red-100";
      iconColor = "#EF4444"; // Red-500
    }

    // Override colors if read? User said "icon should be gray if status read"
    // But image shows colored icons even in list?
    // Usually "read" just means the unread indicator is gone or text is non-bold.
    // The user instruction "icon should be gray if status read" is specific.
    if (isRead) {
      bgClass = "bg-gray-100";
      iconColor = "#9CA3AF";
    }

    return (
      <View
        className={`w-10 h-10 rounded-full ${bgClass} justify-center items-center mr-3`}
      >
        <IconComp name={iconName} size={24} color={iconColor} />
      </View>
    );
  };

  const renderNotification = ({
    item: [date, items],
  }: {
    item: [string, any[]];
  }) => (
    <View key={date} className="mb-2">
      <View className="flex-row justify-between items-center mb-2 mt-4 px-1">
        <Text className="text-base font-bold text-gray-900">{date}</Text>
        {date === "Today" && (
          <TouchableOpacity onPress={() => markAllReadMutation.mutate("all")}>
            <Text className="text-green-600 font-medium text-xs">
              Mark all as read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {items.map((notification) => (
        <TouchableOpacity
          key={notification.id}
          onPress={() => handleNotificationPress(notification)}
          className="relative flex-row items-center bg-base-300 p-4 rounded-xl mb-3 shadow-sm border border-gray-100"
        >
          {/* Vertical Unread Indicator */}
          {!notification.isRead && (
            <View className="absolute left-0 top-4 bottom-4 w-1.5 bg-green-500 rounded-r-full" />
          )}

          <View className={"ml-2"}>
            <NotificationIcon notification={notification} />
          </View>

          <View className="flex-1">
            <View className="flex-row justify-between items-start">
              <Text
                className={`text-sm text-gray-900 flex-1 mr-2 ${
                  !notification.isRead ? "font-bold" : "font-medium"
                }`}
              >
                {notification.title}
              </Text>
              <Text className="text-gray-400 text-xs">{notification.time}</Text>
            </View>
            <Text className="text-gray-500 text-xs mt-1" numberOfLines={2}>
              {notification.description}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
      <Header
        centerComponent={<Image source={IMAGES.logo} className={`w-16 h-16`} />}
      />
      <ScreenTitle title="Notifications" />
      {/* Tabs */}
      <View className="flex-row mb-2 bg-base-300 rounded-lg p-1 border border-black/10 shadow-sm">
        <TouchableOpacity
          onPress={() => setActiveTab("All")}
          className={`flex-1 py-2 items-center rounded-md ${
            activeTab === "All" ? "bg-primary/20" : "bg-transparent"
          }`}
        >
          <Text
            className={`font-semibold text-sm ${
              activeTab === "All" ? "text-primary" : "text-gray-500"
            }`}
          >
            All {`(${totalCount || 0})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("Unread")}
          className={`flex-1 py-2 items-center rounded-md ${
            activeTab === "Unread" ? "bg-primary/20" : "bg-transparent"
          }`}
        >
          <Text
            className={`font-semibold text-sm ${
              activeTab === "Unread" ? "text-primary" : "text-gray-500"
            }`}
          >
            Unread {`(${unreadCount || 0})`}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && !isRefreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlashList
          data={groupedNotifications}
          keyExtractor={(item) => item[0]}
          renderItem={renderNotification}
          className="flex-1"
          showsVerticalScrollIndicator={false}
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
