import IMAGES from "@/assets";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import HeaderButton from "@/components/HeaderButton";
import InputField from "@/components/InputField";
import ProfileDropdown from "@/components/ProfileDropdown";
import ScreenTitle from "@/components/ScreenTitle";
import { useNotifications } from "@/hooks/useNotifications";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { unreadCount } = useNotifications();
  const { user } = useBusinessStore();

  const [firstName, setFirstName] = useState(
    user.firstName || user.name.split(" ")[0] || ""
  );
  const [lastName, setLastName] = useState(
    user.lastName || user.name.split(" ")[1] || ""
  );
  const [phone, setPhone] = useState(user.phone || "");
  const [address, setAddress] = useState(user.address || "");

  const handleUpdateProfile = () => {
    console.log("Update Profile", { firstName, lastName, phone, address });
    // TODO: Implement API call
  };

  const handleChangePassword = () => {
    console.log("Change Password");
    // TODO: Implement Change Password Logic
  };

  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
      {/* Header */}
      <Header
        leftComponent={
          <View className="relative">
            <HeaderButton
              IconComponent={Feather}
              iconName="bell"
              iconSize={20}
              onPress={() => router.push("/notifications")}
            />
            {unreadCount > 0 && (
              <View className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full justify-center items-center border border-white">
                <Text
                  className="text-white font-bold"
                  style={{ fontSize: 10, lineHeight: 12 }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </View>
        }
        centerComponent={<Image source={IMAGES.logo} className={`w-16 h-16`} />}
        rightComponent={<ProfileDropdown />}
      />

      <ScreenTitle title="Profile" />

      <ScrollView className="flex-1 mb-20" showsVerticalScrollIndicator={false}>
        {/* Banner/Image */}
        <View className="items-center mb-6">
          <View className="bg-white rounded-xl shadow-sm p-2">
            <Image
              source={IMAGES.comingSoon}
              // Using comingSoon as placeholder or if there is a specific profile banner in assets, use that.
              // Given the screenshot shows a "Feed Genius" card/banner.
              className="w-40 h-40 rounded-lg"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Email - Read Only */}
        <View className="mb-4">
          <Text className="text-gray-900 font-bold mb-1">
            Email:{" "}
            <Text className="font-normal text-gray-700">{user.email}</Text>
          </Text>
        </View>

        {/* First Name */}
        <View className="mb-4">
          <Text className="text-gray-900 font-bold mb-2">
            First Name <Text className="text-error">*</Text>
          </Text>
          <InputField
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        {/* Last Name */}
        <View className="mb-4">
          <Text className="text-gray-900 font-bold mb-2">
            Last Name <Text className="text-error">*</Text>
          </Text>
          <InputField
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        {/* Phone */}
        <View className="mb-4">
          <Text className="text-gray-900 font-bold mb-2">Phone</Text>
          <InputField
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Address */}
        <View className="mb-6">
          <Text className="text-gray-900 font-bold mb-2">
            Address <Text className="text-error">*</Text>
          </Text>
          <InputField
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Actions */}
        <View className="gap-y-3">
          <TouchableOpacity
            onPress={handleChangePassword}
            className="w-full bg-green-500 py-4 rounded-lg items-center shadow-sm active:bg-green-600"
          >
            <Text className="text-white font-bold text-base">
              Change Password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleUpdateProfile}
            className="w-full bg-green-500 py-4 rounded-lg items-center shadow-sm active:bg-green-600"
          >
            <Text className="text-white font-bold text-base">
              Update Profile
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav activeTab="profile" />
    </SafeAreaView>
  );
}
