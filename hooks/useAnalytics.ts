import { getAnalyticsData } from "@/api/analytics";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export const useAnalytics = (
  period: string = "last_30_days",
  start_date?: string,
  end_date?: string
) => {
  const { user } = useAuthStore();
  const businessId = user?.business?.id || user?.business?.[0]?.id;

  return useQuery({
    queryKey: ["analytics", businessId, period, start_date, end_date],
    queryFn: () => getAnalyticsData(businessId, period, start_date, end_date),
    enabled: !!businessId,
  });
};
