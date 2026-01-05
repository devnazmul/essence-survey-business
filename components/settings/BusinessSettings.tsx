import { uploadBusinessLogo } from "@/api/business";
import { COLORS } from "@/constants";
import { useBusinessStore } from "@/store/useBusinessStore";
import getFullImageLink from "@/utils/getFullImageLink";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function BusinessSettings() {
  const settings = useBusinessStore((state) => state.settings);
  const setSettings = useBusinessStore((state) => state.setSettings);
  const businessId = useBusinessStore((state) => state.user.businessId);
  const fetchBusinessSettings = useBusinessStore(
    (state) => state.fetchBusinessSettings
  );
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  console.log("BusinessSettings - Current settings:", settings);

  const logo = settings.Logo
    ? getFullImageLink(settings.Logo)
    : "https://ui-avatars.com/api/?name=The+Grill&background=random";

  const pickImage = async () => {
    try {
      setIsPickingImage(true);

      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to upload a logo."
        );
        setIsPickingImage(false);
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0];

        // Upload to server
        if (!businessId) {
          Alert.alert("Error", "Business ID not found. Please try again.");
          setIsPickingImage(false);
          return;
        }

        setIsUploadingLogo(true);

        try {
          await uploadBusinessLogo(businessId, selectedImage.uri);

          // Refetch business settings to get the updated logo URL
          await fetchBusinessSettings();

          Alert.alert("Success", "Logo updated successfully!");
        } catch (uploadError) {
          console.error("Error uploading logo:", uploadError);
          Alert.alert("Error", "Failed to upload logo. Please try again.");
        } finally {
          setIsUploadingLogo(false);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    } finally {
      setIsPickingImage(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center mb-6">
        <View className="bg-green-100 p-2 rounded-lg mr-3">
          <Feather name="settings" size={20} color={COLORS.primary} />
        </View>
        <Text className="text-lg font-bold text-primary">
          Business Settings
        </Text>
      </View>

      {/* Logo Upload */}
      <View className="items-center mb-6">
        <TouchableOpacity
          onPress={pickImage}
          disabled={isPickingImage || isUploadingLogo}
          className="w-24 h-24 bg-white rounded-xl shadow-sm border border-gray-100 items-center justify-center mb-2 overflow-hidden relative"
        >
          <Image
            source={{ uri: logo }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {/* Upload overlay */}
          <View className="absolute inset-0 bg-black/40 items-center justify-center">
            <View className="bg-white rounded-full p-2">
              {isUploadingLogo ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Feather name="camera" size={20} color={COLORS.primary} />
              )}
            </View>
          </View>
        </TouchableOpacity>
        <Text className="text-gray-900 font-bold mb-1">Logo</Text>
        <Text className="text-gray-400 text-xs">
          {isUploadingLogo ? "Uploading..." : "(Ratio should be 1:1)"}
        </Text>
      </View>

      {/* Form Fields */}
      <View className="space-y-4">
        <View>
          <Text className="text-gray-900 font-bold mb-2">Business Name</Text>
          <TextInput
            value={settings.Name}
            onChangeText={(text) => setSettings({ Name: text })}
            className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 bg-white"
          />
        </View>

        <View>
          <Text className="text-gray-900 font-bold mb-2">Email</Text>
          <TextInput
            value={settings.EmailAddress}
            onChangeText={(text) => setSettings({ EmailAddress: text })}
            className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 bg-white"
          />
        </View>

        <View>
          <Text className="text-gray-900 font-bold mb-2">Phone</Text>
          <TextInput
            value={settings.PhoneNumber}
            onChangeText={(text) => setSettings({ PhoneNumber: text })}
            className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 bg-white"
          />
        </View>

        <View>
          <Text className="text-gray-900 font-bold mb-2">
            Address <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            value={settings.Address}
            onChangeText={(text) => setSettings({ Address: text })}
            className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 bg-white"
          />
        </View>

        <View>
          <Text className="text-gray-900 font-bold mb-2">Post Code</Text>
          <TextInput
            value={settings.PostCode}
            onChangeText={(text) => setSettings({ PostCode: text })}
            className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 bg-white"
          />
        </View>

        <View>
          <Text className="text-gray-900 font-bold mb-2">About Us</Text>
          <TextInput
            value={settings.About}
            onChangeText={(text) => setSettings({ About: text })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 bg-white h-32"
          />
        </View>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
