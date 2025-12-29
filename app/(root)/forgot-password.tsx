import { IMAGES } from "@/assets";
import Header from "@/components/Header";
import HeaderButton from "@/components/HeaderButton";
import { BasicInputField } from "@/components/InputField";
import Button from "@/components/ui/Button";
import { useForgotPasswordMutation } from "@/hooks/useAuthMutation";
import { useDimension } from "@/hooks/useDimension";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const { getResponsiveFontSize } = useDimension();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { mutate: sendOTP, isPending: isSubmitting } =
    useForgotPasswordMutation();

  const handleSendOTP = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("Please enter your email");
      return;
    } else if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setError("");
    sendOTP(email);
  };

  return (
    <SafeAreaView className="flex-1  px-6">
      <Header
        leftComponent={
          <HeaderButton
            IconComponent={Feather}
            iconName="arrow-left"
            iconSize={20}
            onPress={() => router.back()}
          />
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center"
      >
        <View className="items-center mb-10">
          <Image
            source={IMAGES.logo}
            className="w-24 h-24"
            resizeMode="contain"
          />
          <Text
            style={{ fontSize: getResponsiveFontSize("3xl") }}
            className="font-bold text-gray-900 mt-6 mb-2"
          >
            Forgot Password?
          </Text>
          <Text
            style={{ fontSize: getResponsiveFontSize("md") }}
            className="text-gray-500 text-center px-4"
          >
            Enter your email address and we will send you an OTP to reset your
            password.
          </Text>
        </View>

        <View className="gap-4">
          <BasicInputField
            label="Email"
            placeholder="Enter your registered email"
            value={email}
            isError={!!error}
            hintMessage={error}
            onChangeText={(e: any) => setEmail(e.target.value)}
            keyboardType="email-address"
          />

          <Button
            label={isSubmitting ? "Sending..." : "Send Email"}
            onPress={handleSendOTP}
            className="mt-4"
            size="xl"
            textClassName="text-center"
            disabled={isSubmitting}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
