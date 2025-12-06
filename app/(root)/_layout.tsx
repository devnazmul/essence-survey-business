import { COLORS } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (typeof isAuthenticated === "undefined") return;

    const inDashboard = segments[0] === "(dashboard)";

    if (isAuthenticated && !inDashboard) {
      router.replace("/(dashboard)");
    } else if (!isAuthenticated && inDashboard) {
      router.replace("/");
    }
  }, [isAuthenticated, segments]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",
          headerLeft: () => <View />,
        }}
      >
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
