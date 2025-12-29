import { apiErrorHandler } from "@/utils/apiErrorHandler";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface UseCustomMutationProps<TData, TError, TVariables, TContext>
  extends UseMutationOptions<TData, TError, TVariables, TContext> {
  showErrorMessage?: boolean;
}

export const useCustomMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>({
  showErrorMessage = true,
  onError,
  ...options
}: UseCustomMutationProps<TData, TError, TVariables, TContext>) => {
  const mutation = useMutation({
    ...options,
    onError: (error, variables, context, mutationContext) => {
      if (showErrorMessage) {
        apiErrorHandler(error);
      }
      if (onError) {
        onError(error, variables, context, mutationContext);
      }
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending, // Map isPending to isLoading for compatibility
  };
};
