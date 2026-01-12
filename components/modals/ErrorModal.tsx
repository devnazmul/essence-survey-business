import { COLORS } from "@/constants";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  BounceIn,
  FadeIn,
  FadeOut,
  ZoomIn,
} from "react-native-reanimated";

interface ErrorModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  visible,
  onClose,
  title = "Error",
  message = "Something went wrong.",
  buttonText = "Close",
}) => {
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
          className="bg-base-300 w-full rounded-3xl p-8 items-center shadow-2xl border border-red-100"
        >
          {/* Illustration Container */}
          <Animated.View entering={BounceIn.delay(200)}>
            <View className="w-24 h-24 rounded-full bg-red-100 items-center justify-center mb-2">
              <Feather
                name="alert-triangle"
                size={48}
                color={COLORS["red-500"]}
              />
            </View>
          </Animated.View>

          {/* Text Content */}
          <Text className="text-gray-900 font-bold text-2xl w-40 mt-4 text-center">
            {title}
          </Text>
          <Text className="text-gray-500 text-center mt-3 text-base leading-6">
            {message}
          </Text>

          {/* Action Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            className="bg-red-500 w-full py-4 rounded-xl mt-8 shadow-lg shadow-red-500/30"
          >
            <Text className="text-white text-center font-bold text-lg">
              {buttonText}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};
