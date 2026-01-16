import { getAllBranches } from "@/api/branch";
import { changeDefaultBranch } from "@/api/business";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useAuthStore } from "@/store/useAuthStore";
import { useBusinessStore } from "@/store/useBusinessStore";
import { useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useBranchesQuery = () => {
  const { user } = useAuthStore();
  const businessId = user?.business?.id || user?.business?.[0]?.id;

  return useCustomQuery({
    queryKey: ["branches", businessId],
    queryFunc: async ({ signal }) =>
      await getAllBranches({ signal, sort_by: "name" }),
    enabled: !!businessId,
  });
};

export const useChangeDefaultBranchMutation = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();
  const initializeSettings = useBusinessStore(
    (state) => state.initializeSettings
  );
  const fetchBusinessSettings = useBusinessStore(
    (state) => state.fetchBusinessSettings
  );

  return useCustomMutation({
    mutationFn: changeDefaultBranch,
    onSuccess: async (res: any) => {
      const userData = res?.data?.data || res?.data || res;
      const token = userData?.token;

      if (userData && token) {
        // 1. Update auth state with new user data (contains new active business)
        setAuth(userData, token);

        // 2. Sync business store with new business info (updates settings and businessId)
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

        Alert.alert("Success", "Default Branch Updated successfully");
      }
    },
  });
};
