import { BasicInputField } from "@/components/InputField";
import Button from "@/components/ui/Button";
import COLORS from "@/constants/colors";
import { useDimension } from "@/hooks/useDimension";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ILoginProps {}

const Login: React.FC<ILoginProps> = () => {
  const { getResponsiveFontSize, HP, WP } = useDimension();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: WP("5%"),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Logo */}
        <View className="items-center mb-8">
          <View className="flex-row items-center gap-2 mb-4">
            <Feather name="shopping-bag" size={32} color={COLORS.primary} />
            <Text
              style={{ fontSize: getResponsiveFontSize("2xl") }}
              className="font-bold text-gray-900"
            >
              OwnerApp
            </Text>
          </View>
          <Text
            style={{ fontSize: getResponsiveFontSize("3xl") }}
            className="font-bold text-gray-900 mb-2 text-center"
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

        {/* Form */}
        <View className="w-full space-y-4">
          <BasicInputField
            label="Email"
            placeholder="Enter your email"
            inputMode="email"
            value={formData.email}
            onChangeText={(e: any) => handleChange("email", e.target.value)}
            size="lg"
          />

          <View>
            <BasicInputField
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={formData.password}
              onChangeText={(e: any) =>
                handleChange("password", e.target.value)
              }
              size="lg"
            />
          </View>

          <TouchableOpacity className="self-end">
            <Text
              style={{ fontSize: getResponsiveFontSize("sm") }}
              className="font-semibold text-primary"
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <View className="mt-4">
            <Button
              label="Login"
              onPress={() => {}}
              color="primary"
              size="xl"
              className="w-full"
              textClassName="font-bold text-white"
            />
          </View>
        </View>

        <View className="flex-row justify-center mt-8">
          <Text
            style={{ fontSize: getResponsiveFontSize("md") }}
            className="text-gray-500"
          >
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity>
            <Text
              style={{ fontSize: getResponsiveFontSize("md") }}
              className="font-bold text-primary"
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <View className="items-center mt-8 mb-4">
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="text-gray-400"
          >
            Version: {Constants.expoConfig?.version ?? "1.0.0"}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
