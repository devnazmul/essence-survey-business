import { forgotPassword, login } from "@/api/auth";
import { getDashboardData } from "@/api/dashboard";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useAuthStore } from "@/store/useAuthStore";
import { useBusinessStore } from "@/store/useBusinessStore";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useLoginMutation = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const setDashboardData = useBusinessStore((state) => state.setDashboardData);
  const initializeSettings = useBusinessStore(
    (state) => state.initializeSettings
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
          const dashboardResponse = await getDashboardData(businessId);

          // 3. Update business store with dashboard data
          const structuredData = {
            stats: {
              avgRating: {
                value:
                  dashboardResponse?.data?.metrics?.avg_overall_rating?.value,
                change:
                  dashboardResponse?.data?.metrics?.avg_overall_rating?.change,
              },
              totalReviews: {
                value: dashboardResponse?.data?.metrics?.total_reviews?.value,
                change: dashboardResponse?.data?.metrics?.total_reviews?.change,
              },
              staffLinkedReviews: {
                value:
                  dashboardResponse?.data?.metrics?.staff_linked_reviews?.count,
                change:
                  dashboardResponse?.data?.metrics?.staff_linked_reviews
                    ?.change,
                percentage:
                  dashboardResponse?.data?.metrics?.staff_linked_reviews
                    ?.percentage,
                total:
                  dashboardResponse?.data?.metrics?.staff_linked_reviews?.total,
              },
            },
            reviews: dashboardResponse?.data?.review_feed?.map(
              ({
                id,
                author,
                comment,
                is_ai_flagged,
                is_voice,
                rating,
                sentiment,
                staff_name,
                tags,
                time_ago,
                responded_at,
              }: {
                id: string | number;
                author: string;
                comment: string | null;
                is_ai_flagged: boolean;
                is_voice: boolean;
                rating: string;
                sentiment: string;
                staff_name: string;
                tags: string[];
                time_ago: string;
                responded_at: null | string;
              }) => ({
                id,
                customerName: author,
                date: time_ago,
                rating,
                comment,
                tags,
                staff_name,
                sentiment,
                is_ai_flagged,
                is_voice,
                responded_at,
              })
            ),
            notifications: [],
          };
          setDashboardData(structuredData);

          // 4. Navigate to dashboard
          router.replace("/(dashboard)");
        } catch (error) {
          console.log("Error fetching dashboard data:", error);
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
        [{ text: "OK", onPress: () => router.back() }]
      );
    },
    onError: (error: any) => {
      console.log("Forgot password error:", error);
      Alert.alert(
        "Error",
        "Could not send reset link. Please check your email and try again."
      );
    },
  });
};
