import IMAGES from "@/assets";
import { useDimension } from "@/hooks/useDimension";
import React from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  BounceIn,
  FadeIn,
  FadeOut,
  ZoomIn,
} from "react-native-reanimated";

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  title = "Success!",
  message = "Your operation was completed successfully.",
  buttonText = "Continue",
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
            <Image
              source={IMAGES.success}
              className="w-32 h-32 overflow-hidden rounded-full"
              resizeMode="contain"
            />
          </Animated.View>

          {/* Text Content */}
          <Text
            className="text-gray-900 font-bold mt-6  w-full"
            style={{ fontSize: getResponsiveFontSize("2xl") }}
          >
            {title}
          </Text>
          <Text
            className="text-gray-500 text-center mt-3 leading-6"
            style={{ fontSize: getResponsiveFontSize("md") }}
          >
            {message}
          </Text>

          {/* Action Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            className="bg-primary w-full py-4 rounded-xl mt-8 shadow-lg shadow-primary/30"
          >
            <Text
              className="text-base-300 text-center font-bold"
              style={{ fontSize: getResponsiveFontSize("lg") }}
            >
              {buttonText}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};
