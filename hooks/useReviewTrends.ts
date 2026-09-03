import { useDashboard } from "./useDashboard";

export const useReviewTrends = (period: string = "30d", activeTypeTab: string) => {
  const { data, isLoading, error, refetch, trends } = useDashboard(
    period,
    activeTypeTab,
  );

  return {
    data: { data: trends },
    isLoading,
    error,
    refetch,
  };
};
