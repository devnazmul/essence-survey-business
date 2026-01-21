import { changePassword } from "@/api/auth";
import { getProfile, updateProfile, uploadProfileImage } from "@/api/profile";
import IMAGES from "@/assets";

import AutoComplete from "@/components/CustomAutoComplete";
import Header from "@/components/Header";
import { BasicInputField } from "@/components/InputField";
import ScreenTitle from "@/components/ScreenTitle";
import { ChangePasswordModal } from "@/components/modals/ChangePasswordModal";
import { SuccessModal } from "@/components/modals/SuccessModal";
import { useAuthStore } from "@/store/useAuthStore";
import getFullImageLink from "@/utils/getFullImageLink";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, setUser } = useAuthStore();

  // All hooks must be declared before any early returns
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  /* Validation State */
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
  }>({});

  // Initialize state from user object
  useEffect(() => {
    if (user) {
      setFirstName(user.first_Name || user.name?.split(" ")[0] || "");
      setLastName(user.last_Name || user.name?.split(" ")[1] || "");
      setPhone(user.phone || "");
      setAddress(user.Address || user.address || "");
    }
  }, [user]);

  // Early return if user is not loaded (after all hooks)
  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
        <Header
          centerComponent={
            <Image source={IMAGES.logo} className={`w-16 h-16`} />
          }
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#22c55e" />
          <Text className="mt-4 text-gray-600">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const validate = () => {
    let valid = true;
    let newErrors: any = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First Name is required";
      valid = false;
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last Name is required";
      valid = false;
    }
    if (!address.trim()) {
      newErrors.address = "Address is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleUpdateProfile = async () => {
    if (!user.business_id) return;

    if (!validate()) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        id: user.businessId,
        first_Name: firstName,
        last_Name: lastName,
        phone: phone,
        Address: address,
        image: user.image,
      };

      await updateProfile(payload);

      // Update local store
      setUser({
        first_Name: firstName,
        last_Name: lastName,
        phone: phone,
        address: address, // Store uses lowercase 'address' usually, but syncs with API 'Address' if needed
        name: `${firstName} ${lastName}`.trim(),
      });

      setSuccessMessage("Profile updated successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to update profile", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      setIsPickingImage(true);

      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to upload a profile picture.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0];
        setIsUploadingImage(true);

        try {
          const uploadResponse = await uploadProfileImage(selectedImage.uri);

          // Fetch updated user data to get the new image URL
          if (user.id) {
            const updatedUserData = await getProfile(user.id);

            // Update the user state with the new image
            if (Object.keys(updatedUserData?.data || {}).length > 0) {
              setUser({
                ...user,
                ...updatedUserData.data,
                image: updatedUserData.data.image,
              });
            }
          }

          setSuccessMessage("Profile picture updated!");
          setShowSuccessModal(true);
        } catch (error) {
          console.error("Error:", error);
          Alert.alert("Error", "Failed to upload profile picture.");
        } finally {
          setIsUploadingImage(false);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
    } finally {
      setIsPickingImage(false);
    }
  };

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  const handlePasswordChange = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    if (!user.id) {
      Alert.alert("Error", "User ID not found");
      return;
    }

    try {
      await changePassword({
        user_id: user.id,
        current_password: currentPassword,
        new_password: newPassword,
      });

      setSuccessMessage("Password changed successfully!");
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error("Change password error:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to change password";

      if (errorMessage !== "Invalid password") {
        Alert.alert("Error", errorMessage);
      }
      throw error; // Re-throw to let modal handle loading state and specific field errors
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
      {/* Header */}
      <Header
        centerComponent={<Image source={IMAGES.logo} className={`w-16 h-16`} />}
      />

      <ScreenTitle title="Profile" />

      <ScrollView className="flex-1 mb-20" showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View className="items-center mb-6">
          <TouchableOpacity
            onPress={pickImage}
            disabled={isPickingImage || isUploadingImage}
            className="w-32 h-32 bg-base-300 rounded-full shadow-sm border border-gray-100 items-center justify-center mb-2 overflow-hidden relative"
          >
            <Image
              source={{ uri: getFullImageLink(user.image) }}
              className="w-32 h-32"
              defaultSource={IMAGES.comingSoon} // Fallback if user.image is missing initially
            />

            {/* Overlay */}
            <View className="absolute inset-0 bg-black/20 items-center justify-center">
              {isUploadingImage ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Feather name="camera" size={24} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
          <Text className="text-gray-900 font-bold mb-1">{user.email}</Text>
        </View>

        {/* First Name */}
        <View className="mb-4">
          <Text className="text-gray-900 font-bold mb-2">
            First Name <Text className="text-error">*</Text>
          </Text>
          <BasicInputField
            placeholder="First Name"
            value={firstName}
            onChangeText={(e: any) => {
              setFirstName(e.target.value);
              if (errors.firstName)
                setErrors({ ...errors, firstName: undefined });
            }}
            isError={!!errors.firstName}
            hintMessage={errors.firstName}
            required
          />
        </View>

        {/* Last Name */}
        <View className="mb-4">
          <Text className="text-gray-900 font-bold mb-2">
            Last Name <Text className="text-error">*</Text>
          </Text>
          <BasicInputField
            placeholder="Last Name"
            value={lastName}
            onChangeText={(e: any) => {
              setLastName(e.target.value);
              if (errors.lastName)
                setErrors({ ...errors, lastName: undefined });
            }}
            isError={!!errors.lastName}
            hintMessage={errors.lastName}
            required
          />
        </View>

        {/* Phone */}
        <View className="mb-4">
          <Text className="text-gray-900 font-bold mb-2">Phone</Text>
          <BasicInputField
            placeholder="Phone Number"
            value={phone}
            onChangeText={(e: any) => {
              setPhone(e.target.value);
            }}
            inputMode="tel"
          />
        </View>

        {/* Address with Autocomplete */}
        <View className="mb-6 z-50">
          <Text className="text-gray-900 font-bold mb-2">
            Address <Text className="text-error">*</Text>
          </Text>
          <View className="h-40 z-50">
            <AutoComplete
              required
              value={address}
              error={errors.address}
              onPress={(data, details = null) => {
                setAddress(data.description);
                if (errors.address)
                  setErrors({ ...errors, address: undefined });
              }}
              onChange={(text) => {
                setAddress(text);
                if (errors.address)
                  setErrors({ ...errors, address: undefined });
              }}
              placeholder="Search address"
            />
          </View>
        </View>

        {/* Actions */}
        <View className="gap-y-3 mt-4">
          <TouchableOpacity
            onPress={handleUpdateProfile}
            disabled={isLoading}
            className={`w-full bg-green-500 py-4 rounded-lg items-center shadow-sm active:bg-green-600 ${isLoading ? "opacity-70" : ""}`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">
                Update Profile
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleChangePassword}
            className="w-full bg-base-300 border-2 border-green-500 py-4 rounded-lg items-center shadow-sm active:bg-gray-50"
          >
            <Text className="text-green-500 font-bold text-base">
              Change Password
            </Text>
          </TouchableOpacity>
        </View>

        {/* Spacer for bottom nav */}
        <View className="h-8" />
      </ScrollView>

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />

      <ChangePasswordModal
        visible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSubmit={handlePasswordChange}
      />
    </SafeAreaView>
  );
}
