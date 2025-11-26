import { apiErrorHandler } from "@/utils/apiErrorHandler";
import { useEffect, useState } from "react";

type QueryFunc<T> = (params: { signal: AbortSignal }) => Promise<T>;

interface UseCustomQueryProps<T> {
  queryFunc: QueryFunc<T>;
  enabled?: boolean;
  onError?: (error: unknown) => void;
  showErrorMessage?: boolean;
}

export const useCustomQuery = <T>({
  queryFunc,
  enabled = true,
  onError = () => {},
  showErrorMessage = true,
}: UseCustomQueryProps<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  // FIXED
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isUpdated, setIsUpdated] = useState(Math.random());

  const refetch = () => setIsUpdated(Math.random());

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await queryFunc({ signal });
        setData(response);
        setIsSuccess(true);
        setIsError(false);
      } catch (err) {
        if (signal.aborted) return;

        if (showErrorMessage) {
          apiErrorHandler(err);
        }

        setIsError(true);
        setError(err);
        onError(err);
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    if (enabled) fetchData();

    return () => controller.abort();
  }, [isUpdated, enabled]);

  return {
    isLoading,
    isError,
    data,
    error,
    refetch,
    isSuccess,
  };
};
