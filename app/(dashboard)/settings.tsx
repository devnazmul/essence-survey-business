import { IMAGES } from "@/assets";
import Header from "@/components/Header";
import HeaderButton from "@/components/HeaderButton";
import { ErrorModal } from "@/components/modals/ErrorModal";
import { SuccessModal } from "@/components/modals/SuccessModal";
import BusinessSettings from "@/components/settings/BusinessSettings";
import GeneralSettings from "@/components/settings/GeneralSettings";
import MapSettings from "@/components/settings/MapSettings";
import SettingsSkeleton from "@/components/settings/SettingsSkeleton";
import { COLORS } from "@/constants";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
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
  const [activeTab, setActiveTab] = useState("Business");
  const updateBusiness = useBusinessStore((state) => state.updateBusiness);
  const settings = useBusinessStore((state) => state.settings); // Need settings for validation
  const fetchBusinessSettings = useBusinessStore(
    (state) => state.fetchBusinessSettings
  );
  const isLoading = useBusinessStore((state) => state.isLoading);
  const isFetchingSettings = useBusinessStore(
    (state) => state.isFetchingSettings
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorTitle, setErrorTitle] = useState("Validation Error");

  const tabs = [
    { name: "Business", icon: "briefcase" },
    { name: "General Settings", icon: "settings" },
    { name: "Map Settings", icon: "map-pin" },
  ];

  // Fetch business settings when component mounts
  useFocusEffect(
    useCallback(() => {
      fetchBusinessSettings();
    }, [fetchBusinessSettings])
  ); // Dependency included to satisfy lint

  const validateSettings = () => {
    // Validate Business Settings
    if (!settings.Name?.trim()) {
      setErrorTitle("Business Settings");
      setErrorMessage("Business Name is required.");
      return false;
    }
    if (!settings.EmailAddress?.trim()) {
      setErrorTitle("Business Settings");
      setErrorMessage("Email Address is required.");
      return false;
    }
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(settings.EmailAddress)) {
      setErrorTitle("Business Settings");
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (!settings.PhoneNumber?.trim()) {
      setErrorTitle("Business Settings");
      setErrorMessage("Phone Number is required.");
      return false;
    }
    if (!settings.Address?.trim()) {
      setErrorTitle("Business Settings");
      setErrorMessage("Address is required.");
      return false;
    }

    // Validate General Settings
    if (settings.is_guest_user_survey && !settings.guest_survey_id) {
      setErrorTitle("General Settings");
      setErrorMessage("Please select a Guest Survey.");
      return false;
    }
    if (
      settings.is_registered_user_survey &&
      !settings.registered_user_survey_id
    ) {
      setErrorTitle("General Settings");
      setErrorMessage("Please select a User Survey.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateSettings()) {
      setShowErrorModal(true);
      return;
    }

    try {
      const success = await updateBusiness();
      if (success) {
        setShowSuccessModal(true);
      } else {
        Alert.alert("Error", "Failed to update settings. Please try again.");
      }
    } catch {
      Alert.alert("Error", "Failed to update settings. Please try again.");
    }
  };

  const renderContent = () => {
    // Show skeleton while fetching settings
    if (isFetchingSettings) {
      return <SettingsSkeleton />;
    }

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
    <>
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
          centerComponent={
            <Image source={IMAGES.logo} className={`w-16 h-16`} />
          }
          rightComponent={<View className="w-10" />} // Empty view for balance
        />

        {/* <ScreenTitle title="Settings" /> */}

        {/* Tabs */}
        <View className="flex-row mb-6 bg-white p-1 rounded-2xl shadow-sm border border-gray-100/50">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              onPress={() => setActiveTab(tab.name)}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${
                activeTab === tab.name ? "bg-green-50" : "bg-transparent"
              }`}
            >
              <Feather
                name={tab.icon as any}
                size={16}
                color={activeTab === tab.name ? COLORS.primary : "#9ca3af"}
                className="mr-2"
              />
              <Text
                className={`font-bold text-xs ${
                  activeTab === tab.name ? "text-primary" : "text-gray-400"
                }`}
              >
                {tab.name.split(" ")[0]}
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
              <Text className="text-white font-bold text-base">
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Settings updated successfully!"
      />

      <ErrorModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={errorTitle}
        message={errorMessage}
      />
    </>
  );
}
