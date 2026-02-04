import { getDashboardAIInsights } from "@/api/dashboard";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export const useAIInsights = (period?: string, type?: string) => {
  const { user } = useAuthStore();
  const businessId = user?.business?.id || user?.business?.[0]?.id;

  return useQuery({
    queryKey: ["dashboard-ai-insights", period, type],
    queryFn: () => getDashboardAIInsights(period, type),
    enabled: !!businessId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
