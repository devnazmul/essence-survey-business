import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
}

export function ChangePasswordModal({
  visible,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    let valid = true;
    let newErrors: any = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
      valid = false;
    } else if (currentPassword.length < 8) {
      newErrors.currentPassword = "Password must be at least 8 characters";
      valid = false;
    }
    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      valid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      valid = false;
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSubmit(currentPassword, newPassword);
      // Reset form on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      onClose();
    } catch (error: any) {
      console.error("Change password error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to change password";

      if (errorMessage === "Invalid password") {
        setErrors((prev) => ({ ...prev, currentPassword: "Invalid password" }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-4">
        <View className="bg-white rounded-2xl p-6 w-full max-w-md">
          {/* Title */}
          <Text className="text-2xl font-bold text-green-600 mb-6">
            Change Password
          </Text>

          {/* Current Password */}
          <View className="mb-4">
            <Text className="text-gray-900 font-semibold mb-2">
              Current Password <Text className="text-red-500">*</Text>
            </Text>
            <View className="relative">
              <TextInput
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  if (errors.currentPassword)
                    setErrors({ ...errors, currentPassword: undefined });
                }}
                secureTextEntry={!showCurrentPassword}
                placeholder="Current Password*"
                className={`border ${
                  errors.currentPassword ? "border-red-500" : "border-gray-200"
                } rounded-lg px-4 py-3 pr-12 text-gray-700 bg-base-300 placeholder:text-gray-400`}
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-3"
              >
                <Feather
                  name={showCurrentPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
            {errors.currentPassword && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.currentPassword}
              </Text>
            )}
          </View>

          {/* New Password */}
          <View className="mb-4">
            <Text className="text-gray-900 font-semibold mb-2">
              New Password <Text className="text-red-500">*</Text>
            </Text>
            <View className="relative">
              <TextInput
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (errors.newPassword)
                    setErrors({ ...errors, newPassword: undefined });
                }}
                secureTextEntry={!showNewPassword}
                placeholder="New Password*"
                className={`border ${
                  errors.newPassword ? "border-red-500" : "border-gray-200"
                } rounded-lg px-4 py-3 pr-12 text-gray-700 bg-base-300 placeholder:text-gray-400`}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-3"
              >
                <Feather
                  name={showNewPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
            {errors.newPassword && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.newPassword}
              </Text>
            )}
          </View>

          {/* Confirm Password */}
          <View className="mb-6">
            <Text className="text-gray-900 font-semibold mb-2">
              Confirm Password <Text className="text-red-500">*</Text>
            </Text>
            <View className="relative">
              <TextInput
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: undefined });
                }}
                secureTextEntry={!showConfirmPassword}
                placeholder="Confirm Password*"
                className={`border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-200"
                } rounded-lg px-4 py-3 pr-12 text-gray-700 bg-base-300 placeholder:text-gray-400`}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3"
              >
                <Feather
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </Text>
            )}
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleCancel}
              disabled={isLoading}
              className="flex-1 bg-white border-2 border-green-500 py-3 rounded-lg items-center"
            >
              <Text className="text-green-500 font-semibold text-base">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className={`flex-1 bg-green-500 py-3 rounded-lg items-center ${
                isLoading ? "opacity-70" : ""
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Update
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
