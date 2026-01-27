import { deleteBranch, getAllBranches, toggleBranch } from "@/api/branch";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useAlertStore } from "@/store/useAlertStore";
import { useAuthStore } from "@/store/useAuthStore";
import { apiErrorHandler } from "@/utils/apiErrorHandler";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function useAllBranchesService() {
  // AUTH
  const { popupOption, setPopupOption } = useAuthStore();
  const router = useRouter();
  const [currentFilter, setCurrentFilter] = useState("");

  const [isGrid] = useState(true);

  const [isStatusChanging, setIsStatusChanging] = useState({
    isLoading: false,
    id: "",
  });

  // DATABASE FILTER
  const [filters, setFilters] = useState({
    page: 1,
    per_page: 10,
    is_active: "",
    sort_order: "desc",
    start_date: "",
    end_date: "",
    search_key: "",
    sort_by: "created_at",
  });

  const filterValues = [
    {
      id: "is_active",
      label: "Status",
      value: filters?.is_active ? "Active" : "Inactive",
    },
    {
      id: "sort_order",
      label: "Sort Order",
      value: filters?.sort_order === "asc" ? "Ascending" : "Descending",
    },
    {
      id: "search_key",
      label: "Search Data",
      value: filters?.search_key,
    },
  ];

  // Fetching data
  const { data, isLoading, refetch, isFetching } = useCustomQuery({
    queryKey: [QUERY_KEYS.ALL_BRANCHES, filters],
    queryFunc: async ({ signal }) =>
      await getAllBranches({
        signal,
        ...filters,
        sort_by: "name",
      }),
  });

  const onRefresh = async () => {
    await refetch();
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const stats = [
    {
      label: "Total Branches",
      value: data?.summary?.total_branches || 0,
      icon: <MaterialIcons name="account-tree" size={24} color="#2DCE24" />,
      handler: () => router.push("/(dashboard)/reviews"),
    },
    {
      label: "Average Rating",
      value: `${data?.summary?.avg_rating || 0}/${
        data?.summary?.rating_out_of || 5
      }`,
      icon: <FontAwesome name="star" size={24} color="#FACC15" />,
      handler: () => router.push("/(dashboard)/reviews"),
    },
    {
      label: "Overall Sentiment",
      value: data?.summary?.overall_sentiment,
      icon: <MaterialCommunityIcons name="brain" size={24} color="#A855F7" />,
      handler: () => router.push("/(dashboard)/reviews"),
    },
  ];

  // HANDLE ADD
  const handleAddStuff = () => {
    setPopupOption({
      open: true,
      type: "branches",
      title: "Create Branch",
      data: null,
      refetch,
    });
  };

  // HANDLE EDIT
  const handleEdit = (data) => {
    setPopupOption({
      open: true,
      type: "branches",
      title: "Update Branch",
      data,
      refetch,
    });
  };

  // HANDLE DELETE
  const handleDelete = (data) => {
    useAlertStore.getState().showConfirm({
      title: "Are you sure?",
      message: "You want to delete this branch?",
      confirmText: "Yes, delete it!",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          const res = await deleteBranch(data.id);
          if (res?.success) {
            useAlertStore.getState().showSuccess({
              message: "Branch deleted successfully",
              onConfirm: () => refetch(),
            });
          }
        } catch (error) {
          console.error("Delete error:", error);
          apiErrorHandler(error);
        }
      },
    });
  };

  //HANDLE CHANGE STATUS
  const handleChangeStatus = (data) => {
    useAlertStore.getState().showConfirm({
      title: "Are you sure?",
      message: `You want to ${
        data?.is_active ? "deactivate" : "activate"
      } this branch?`,
      confirmText: "Yes, change it!",
      cancelText: "Cancel",
      onConfirm: async () => {
        setIsStatusChanging({ isLoading: true, id: data.id });
        try {
          const res = await toggleBranch(data.id);
          if (res?.success) {
            useAlertStore.getState().showSuccess({
              message: "Status changed successfully",
              onConfirm: () => refetch(),
            });
          }
        } catch (error) {
          console.error("Status change error:", error);
          apiErrorHandler(error);
        } finally {
          setIsStatusChanging({ isLoading: false, id: "" });
        }
      },
    });
  };

  // HANDLE VIEW
  const handleView = (data) => {
    // Assuming a similar path structure might exist or be needed
    // router.push(`/dashboard/branches/${encryptID(data?.id)}`);
    console.log("Viewing branch:", data.id);
  };

  // TABLE ACTION BUTTONS
  const [actions] = useState([
    {
      name: "view",
      handler: handleView,
      Icon: Feather,
      iconName: "eye",
      permissions: [],
      disabledOn: [],
    },
    {
      name: "edit",
      handler: handleEdit,
      Icon: MaterialIcons,
      iconName: "edit",
      permissions: [],
      disabledOn: [
        {
          attributeName: "is_default",
          value: 1,
        },
      ],
    },
    {
      name: "delete",
      handler: handleDelete,
      Icon: MaterialIcons,
      iconName: "delete",
      permissions: [],
      disabledOn: [
        {
          attributeName: "is_default",
          value: 1,
        },
      ],
    },
  ]);

  // TABLE COLUMNS (Keep for logic compatibility)
  const [cols] = useState([
    {
      name: "Name",
      attribute_name: "name",
      show: true,
    },
    {
      name: "Branch Code",
      attribute_name: "branch_code",
      show: true,
    },
    {
      name: "Address",
      attribute_name: "address",
      show: true,
    },
    {
      name: "Phone",
      attribute_name: "phone",
      show: true,
    },
    {
      name: "Email",
      attribute_name: "email",
      show: true,
    },
    {
      name: "Geo Enabled",
      attribute_name: "geo_enabled_display",
      show: true,
    },
    {
      name: "Status",
      attribute_name: "is_active",
      show: true,
    },
  ]);

  return {
    data,
    isLoading,
    isStatusChanging,
    handleChangeStatus,
    handleAddStuff,
    handleEdit,
    handleDelete,
    handleView,
    stats,
    filterValues,
    filters,
    setFilters,
    setCurrentFilter,
    currentFilter,
    cols,
    actions,
    isGrid,
    popupOption,
    setPopupOption,
    refetch,
    onRefresh,
    isFetching,
  };
}
