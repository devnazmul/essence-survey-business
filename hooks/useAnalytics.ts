import { getAnalyticsData } from "@/api/analytics";
import { useQuery } from "@tanstack/react-query";

export const useAnalytics = () => {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalyticsData,
  });
};
