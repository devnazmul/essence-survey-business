import { IMAGES } from "@/assets";
import { BasicInputField } from "@/components/InputField";
import Button from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { useLoginMutation } from "@/hooks/useAuthMutation";
import { useDimension } from "@/hooks/useDimension";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CREDENTIALS_STORAGE_KEY = "@login_credentials";

export default function LoginScreen() {
  const router = useRouter();
  const { getResponsiveFontSize } = useDimension();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e: {
    target: {
      name: string;
      value: string;
    };
  }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const { mutate: loginUser, isPending } = useLoginMutation();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  // Load saved credentials on mount
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedCredentials = await AsyncStorage.getItem(
        CREDENTIALS_STORAGE_KEY
      );
      if (savedCredentials) {
        const { email, password } = JSON.parse(savedCredentials);
        setFormData({ email, password });
        setRememberMe(true);
      }
    } catch (error) {
      console.log("Error loading credentials:", error);
    }
  };

  const saveCredentials = async () => {
    try {
      await AsyncStorage.setItem(
        CREDENTIALS_STORAGE_KEY,
        JSON.stringify(formData)
      );
    } catch (error) {
      console.log("Error saving credentials:", error);
    }
  };

  const clearCredentials = async () => {
    try {
      await AsyncStorage.removeItem(CREDENTIALS_STORAGE_KEY);
    } catch (error) {
      console.log("Error clearing credentials:", error);
    }
  };

  const validateForm = () => {
    let newErrors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Please enter email";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter valid email";
    }
    if (!formData.password) {
      newErrors.password = "Please enter password";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      // Save or clear credentials based on remember me checkbox
      if (rememberMe) {
        saveCredentials();
      } else {
        clearCredentials();
      }
      loginUser(formData);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-base-100 px-6 justify-center"
    >
      <View className="items-center mb-10">
        <Image source={IMAGES.logo} className="w-24 h-24" />
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
          name="email"
          value={formData.email}
          isError={!!errors.email}
          hintMessage={errors.email}
          onChangeText={handleInputChange}
          keyboardType="email-address"
        />
        <BasicInputField
          label="Password"
          placeholder="Enter your password"
          name="password"
          value={formData.password}
          isError={!!errors.password}
          hintMessage={errors.password}
          onChangeText={handleInputChange}
          secureTextEntry
        />

        <View className="flex-row items-center justify-between">
          <Checkbox
            checked={rememberMe}
            onChange={setRememberMe}
            label="Remember me"
          />
          <TouchableOpacity onPress={() => router.push("/forgot-password")}>
            <Text className="text-primary font-medium">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <Button
          label={isPending ? "Logging in..." : "Login"}
          onPress={handleLogin}
          className="mt-4"
          size="xl"
          textClassName="text-center"
          disabled={isPending}
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
