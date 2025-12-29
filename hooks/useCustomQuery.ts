import { apiErrorHandler } from "@/utils/apiErrorHandler";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type QueryFunc<T> = (params: { signal: AbortSignal }) => Promise<T>;

interface UseCustomQueryProps<T>
  extends Omit<UseQueryOptions<T>, "queryKey" | "queryFn"> {
  queryKey: any[];
  queryFunc: QueryFunc<T>;
  onError?: (error: unknown) => void;
  showErrorMessage?: boolean;
}

export const useCustomQuery = <T>({
  queryKey,
  queryFunc,
  enabled = true,
  onError = () => {},
  showErrorMessage = true,
  ...options
}: UseCustomQueryProps<T>) => {
  const query = useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      try {
        return await queryFunc({ signal });
      } catch (err) {
        if (showErrorMessage) {
          apiErrorHandler(err);
        }
        onError(err);
        throw err;
      }
    },
    enabled,
    ...options,
  });

  return {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    data: query.data ?? null,
    error: query.error,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
    isFetched: query.isFetched,
  };
};
