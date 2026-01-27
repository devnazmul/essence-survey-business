import { getAllBranches } from "@/api/branch";
import { changeDefaultBranch } from "@/api/business";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useAlertStore } from "@/store/useAlertStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useBusinessStore } from "@/store/useBusinessStore";
import { useQueryClient } from "@tanstack/react-query";

export const useBranchesQuery = () => {
  const { user } = useAuthStore();
  const businessId = user?.business?.id || user?.business?.[0]?.id;
  const defaultBranchId = user?.business?.default_branch_id;

  return useCustomQuery({
    queryKey: ["branches", businessId, defaultBranchId],
    queryFunc: async ({ signal }) =>
      await getAllBranches({ signal, sort_by: "name" }),
    enabled: !!businessId,
  });
};

export const useChangeDefaultBranchMutation = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();
  const { showSuccess } = useAlertStore();
  const initializeSettings = useBusinessStore(
    (state) => state.initializeSettings,
  );
  const fetchBusinessSettings = useBusinessStore(
    (state) => state.fetchBusinessSettings,
  );
  const updateUser = useBusinessStore((state) => state.updateUser);

  return useCustomMutation({
    mutationFn: changeDefaultBranch,
    onSuccess: async (res: any) => {
      const userData = res?.data?.data || res?.data || res;
      const token = userData?.token;

      if (userData && token) {
        // 1. Update auth state with new user data (contains new active business)
        setAuth(userData, token);

        // 2. Update business store user state
        updateUser(userData);

        // 3. Sync business store with new business info (updates settings and businessId)
        if (userData.business) {
          initializeSettings({
            ...userData.business,
            id: userData.business_id || userData.business.id,
          });
        }

        // 3. Invalidate all queries to refresh data for the new branch
        await queryClient.invalidateQueries();

        // 4. Force refetch of active queries for immediate UI update
        queryClient.refetchQueries({ type: "active" });

        // 5. Refetch business settings explicitly
        await fetchBusinessSettings();

        showSuccess({
          title: "Success",
          message: "Default Branch Updated successfully",
        });
      }
    },
  });
};
