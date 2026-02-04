import { getReviewTrends } from "@/api/dashboard";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export const useReviewTrends = (
  period: string = "30d",
  activeTypeTab: string,
) => {
  const { user } = useAuthStore();
  const businessId = user?.business?.id || user?.business?.[0]?.id;

  return useQuery({
    queryKey: ["review-trends", businessId, period, activeTypeTab],
    queryFn: () => getReviewTrends(businessId, period, activeTypeTab),
    enabled: !!businessId,
  });
};
