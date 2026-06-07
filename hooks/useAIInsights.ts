import { useDashboard } from "./useDashboard";

export const useAIInsights = (period?: string, type?: string) => {
  const { data, isLoading, error, refetch, aiInsights } = useDashboard(
    period,
    type,
  );

  return {
    data: { data: aiInsights },
    isLoading,
    error,
    refetch,
  };
};
