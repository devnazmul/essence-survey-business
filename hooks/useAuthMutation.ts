import { forgotPassword, login } from "@/api/auth";
import { useNotification } from "@/context/useNotification";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useAuthStore } from "@/store/useAuthStore";
import { useBusinessStore } from "@/store/useBusinessStore";
import axios from "axios";
import { useRouter } from "expo-router";
import { Alert, Platform } from "react-native";

export const useLoginMutation = () => {
  const { expoPushToken } = useNotification();

  const router = useRouter();
  const { setAuth } = useAuthStore();

  const initializeSettings = useBusinessStore(
    (state) => state.initializeSettings,
  );

  return useCustomMutation({
    mutationFn: login,
    onSuccess: async (data: any) => {
      const user = data?.data || null;
      const token = data?.data?.token || null;

      if (user && user.business) {
        try {
          // 1. Set Auth FIRST so subsequent private API calls have the token
          setAuth(user, token);
          console.log("Authenticated");

          // 2. Initialize business settings with user data (sets businessId and settings)
          const businessData = {
            ...user.business,
            id: user.business_id || user.business.id,
          };
          initializeSettings(businessData);

          // 3. Fetch dashboard data (now axiosPrivate will have the token)
          const businessId =
            user.business_id || user.business.id || user.business[0]?.id;
          if (!businessId) {
            throw new Error("No business ID found");
          }
          // 4. Register for push notifications
          console.log({ expoPushToken });

          if (expoPushToken) {
            axios.post(
              `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1.0/register-device-token`,
              {
                device_token: expoPushToken,
                device_type: Platform.OS === "ios" ? "ios" : "android",
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              },
            );
          }

          // 5. Navigate to dashboard
          router.replace("/(dashboard)");
        } catch (error) {
          // Still navigate if we have the token
          router.replace("/(dashboard)");
        }
      } else {
        // No business associated, show alert and logout
        Alert.alert("Login Failed", "Invalid credentials.");
        useAuthStore.getState().logout();
      }
    },
    onError: (error: any) => {
      console.log("Login error:", error);
    },
  });
};

export const useForgotPasswordMutation = () => {
  const router = useRouter();

  return useCustomMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      Alert.alert(
        "Success",
        "A password reset link has been sent to your email address.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        "Could not send reset link. Please check your email and try again.",
      );
    },
  });
};
