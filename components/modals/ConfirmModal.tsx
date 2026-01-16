import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  BounceIn,
  FadeIn,
  FadeOut,
  ZoomIn,
} from "react-native-reanimated";

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Do you really want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const { getResponsiveFontSize } = useDimension();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center px-6">
        {/* Backdrop */}
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className="absolute inset-0 bg-black/50"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        />

        {/* Modal Content */}
        <Animated.View
          entering={ZoomIn.duration(400)}
          exiting={FadeOut}
          className="bg-base-300 w-full rounded-3xl p-8 items-center shadow-2xl border border-gray-100"
        >
          {/* Illustration Container */}
          <Animated.View entering={BounceIn.delay(200)}>
            <View className="w-24 h-24 rounded-full bg-yellow-50 items-center justify-center mb-2">
              <Feather name="help-circle" size={48} color={COLORS.primary} />
            </View>
          </Animated.View>

          {/* Text Content */}
          <Text
            className="text-gray-900 font-bold text-center mt-4"
            style={{ fontSize: getResponsiveFontSize("2xl") }}
          >
            {title}
          </Text>
          <Text
            className="text-gray-500 text-center mt-3 leading-6 mb-6"
            style={{ fontSize: getResponsiveFontSize("md") }}
          >
            {message}
          </Text>

          {/* Action Buttons */}
          <View className="flex-row gap-4 w-full">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              className="flex-1 bg-gray-200 py-4 rounded-xl items-center"
            >
              <Text
                className="text-gray-700 font-bold"
                style={{ fontSize: getResponsiveFontSize("lg") }}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 bg-primary py-4 rounded-xl items-center shadow-lg shadow-primary/30"
            >
              <Text
                className="text-white font-bold"
                style={{ fontSize: getResponsiveFontSize("lg") }}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
