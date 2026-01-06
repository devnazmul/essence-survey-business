import { CustomToast } from "@/components/CustomToast";
import { useAuthStore } from "@/store/useAuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Slot,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "../global.css";

const queryClient = new QueryClient();

function AuthController() {
  const { token } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    const timeout = setTimeout(() => {
      const inAuthGroup = segments[0] === "(root)";

      if (!token && !inAuthGroup) {
        router.replace("/signin");
      } else if (token && inAuthGroup) {
        router.replace("/(dashboard)");
      }
    }, 5);

    return () => clearTimeout(timeout);
  }, [token, segments, navigationState?.key, router]);

  return <Slot />;
}

// ... existing imports

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthController />
      <CustomToast />
      <StatusBar style="dark" />
    </QueryClientProvider>
  );
}
