import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const { getResponsiveFontSize } = useDimension();
  const router = useRouter();
  const { notifications } = useBusinessStore();
  const [activeTab, setActiveTab] = useState("All");

  const filteredNotifications =
    activeTab === "All"
      ? notifications
      : notifications.filter((n) => !n.isRead);

  const groupedNotifications = {
    Today: filteredNotifications.filter((n) => n.dateGroup === "Today"),
    Yesterday: filteredNotifications.filter((n) => n.dateGroup === "Yesterday"),
  };

  const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "review":
        return (
          <View className="w-10 h-10 rounded-full bg-yellow-100 justify-center items-center mr-3">
            <FontAwesome name="star-o" size={20} color="#EAB308" />
          </View>
        );
      case "update":
        return (
          <View className="w-10 h-10 rounded-full bg-blue-100 justify-center items-center mr-3">
            <Feather name="mic" size={20} color="#3B82F6" />
          </View>
        );
      case "summary":
        return (
          <View className="w-10 h-10 rounded-full bg-blue-100 justify-center items-center mr-3">
            <MaterialIcons name="bar-chart" size={20} color="#3B82F6" />
          </View>
        );
      default:
        return (
          <View className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-3">
            <Feather name="bell" size={20} color="#6B7280" />
          </View>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center bg-primary p-2 rounded-lg"
        >
          <Feather name="arrow-left" size={20} color={COLORS["base-300"]} />
        </TouchableOpacity>
        <Text
          style={{ fontSize: getResponsiveFontSize("lg") }}
          className="font-bold text-primary"
        >
          Notifications
        </Text>
        <Text />
      </View>

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
            All
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
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 pb-5">
        {Object.entries(groupedNotifications).map(([date, items]) => (
          <View key={date} className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">{date}</Text>
            {items.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                className="relative flex-row items-center bg-base-300 p-4 rounded-xl mb-3 shadow-sm"
              >
                {!notification.isRead && (
                  <View className="w-4 h-4 rounded-full bg-blue-500 absolute -left-2 bottom-1/2 -translate-y-1/2" />
                )}
                <View className={!notification.isRead ? "ml-2" : ""}>
                  <NotificationIcon type={notification.type} />
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-start">
                    <Text className="font-bold text-gray-900 text-base">
                      {notification.title}
                    </Text>
                    <Text className="text-gray-400 text-xs">
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
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
