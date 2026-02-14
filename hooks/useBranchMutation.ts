import { createBranch, updateBranch } from "@/api/branch";
import { getAllUsers } from "@/api/users";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useAlertStore } from "@/store/useAlertStore";
import { useAuthStore } from "@/store/useAuthStore";
import { apiErrorHandler } from "@/utils/apiErrorHandler";

export interface BranchFormData {
  id: number | null;
  name: string;
  address: string;
  street: string;
  door_no: string;
  city: string;
  country: string;
  postcode: string;
  phone: string;
  email: string;
  is_active: string | number;
  is_geo_enabled: number;
  manager_id: string | number;
  branch_code: string;
  lat: string | number;
  long: string | number;
}

interface BranchMutationOptions {
  onSuccess?: () => void;
  refetch?: () => void;
}

export const useCreateBranchMutation = (options?: BranchMutationOptions) => {
  const { user } = useAuthStore();

  return useCustomMutation({
    mutationFn: async (payload: BranchFormData) =>
      await createBranch({
        business_id: user?.business?.id || user?.business_id || "",
        ...payload,
        lat: payload?.lat ? payload?.lat + "" : "",
        long: payload?.long ? payload?.long + "" : "",
      }),
    onSuccess: async () => {
      useAlertStore.getState().showSuccess({
        message: "Branch Added successfully",
        onConfirm: () => {
          options?.refetch?.();
          options?.onSuccess?.();
        },
      });
    },
    onError: (err) => {
      apiErrorHandler(err);
    },
  });
};

export const useUpdateBranchMutation = (options?: BranchMutationOptions) => {
  const { user } = useAuthStore();

  return useCustomMutation({
    mutationFn: async (payload: BranchFormData) =>
      await updateBranch({
        business_id: user?.business?.id || user?.business_id || "",
        ...payload,
        lat: payload?.lat ? payload?.lat + "" : "",
        long: payload?.long ? payload?.long + "" : "",
      }),
    onSuccess: async () => {
      useAlertStore.getState().showSuccess({
        message: "Branch Updated successfully",
        onConfirm: () => {
          options?.refetch?.();
          options?.onSuccess?.();
        },
      });
    },
    onError: (err) => {
      apiErrorHandler(err);
    },
  });
};

export const useBranchManagersQuery = (ignoreId?: number | null) => {
  return useCustomQuery({
    queryKey: [QUERY_KEYS.USERS, "branch_manager_select", ignoreId],
    queryFunc: async () =>
      await getAllUsers({
        role: "branch_manager",
        without_branch: true,
        ignore_id: ignoreId || undefined,
      }),
  });
};
