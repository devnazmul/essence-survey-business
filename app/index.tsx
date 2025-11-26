import { IMAGES } from "@/assets";
import { BasicInputField } from "@/components/InputField";
import Button from "@/components/ui/Button";
import { useDimension } from "@/hooks/useDimension";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const { getResponsiveFontSize, getResponsiveHeight, WP } = useDimension();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-base-100 px-6 justify-center"
    >
      <View className="items-center mb-10">
        <View className="flex items-center mb-10">
          <Image source={IMAGES.ratingStars} />
          <Text
            style={{ fontSize: getResponsiveFontSize("3xl") }}
            className="font-bold text-gray-800"
          >
            Essence Survey
          </Text>
        </View>
        <Text
          style={{ fontSize: getResponsiveFontSize("4xl") }}
          className="font-bold text-gray-900 mb-2"
        >
          Welcome Back
        </Text>
        <Text
          style={{ fontSize: getResponsiveFontSize("md") }}
          className="text-gray-500 text-center"
        >
          Sign in to manage your business reviews.
        </Text>
      </View>

      <View className="gap-4">
        <BasicInputField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <BasicInputField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity className="items-end">
          <Text className="text-primary font-medium">Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          label="Login"
          onPress={() => router.push("/(dashboard)")}
          className="mt-4"
          size="xl"
          textClassName="text-center"
        />

        {/* <View className="flex-row justify-center mt-4">
           <Text className="text-gray-500">Don't have an account? </Text>
          <TouchableOpacity>
            <Text className="text-primary font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>*/}
      </View>
    </KeyboardAvoidingView>
  );
}
