import IMAGES from "@/assets";
import Header from "@/components/Header";
import HeaderButton from "@/components/HeaderButton";
import BusinessSettings from "@/components/settings/BusinessSettings";
import GeneralSettings from "@/components/settings/GeneralSettings";
import MapSettings from "@/components/settings/MapSettings";
import { useDimension } from "@/hooks/useDimension";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { getResponsiveFontSize } = useDimension();
  const [activeTab, setActiveTab] = useState("Business");
  const updateBusiness = useBusinessStore((state) => state.updateBusiness);
  const isLoading = useBusinessStore((state) => state.isLoading);

  const tabs = ["Business", "General Settings", "Map Settings"];

  const handleSave = async () => {
    const success = await updateBusiness();
    if (success) {
      Alert.alert("Success", "Settings updated successfully!");
    } else {
      Alert.alert("Error", "Failed to update settings. Please try again.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Business":
        return <BusinessSettings />;
      case "General Settings":
        return <GeneralSettings />;
      case "Map Settings":
        return <MapSettings />;
      default:
        return <BusinessSettings />;
    }
  };

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
        rightComponent={<View className="w-10" />} // Empty view for balance
      />

      {/* <ScreenTitle title="Settings" /> */}

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`mr-6 py-2 border-b-2 ${
              activeTab === tab ? "border-primary" : "border-transparent"
            }`}
          >
            <Text
              className={`font-bold text-sm ${
                activeTab === tab ? "text-primary" : "text-gray-500"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View className="flex-1">{renderContent()}</View>

      {/* Save Changes Button - Fixed at bottom */}
      <View className="py-4 bg-base-100 border-t border-gray-100">
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          className={`w-full py-3 rounded-xl items-center shadow-sm ${isLoading ? "bg-green-300" : "bg-green-500"}`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-base">Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
