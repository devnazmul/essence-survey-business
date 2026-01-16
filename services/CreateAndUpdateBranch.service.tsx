import { checkUserEmail } from "@/api/auth";
import { createBranch, updateBranch } from "@/api/branch";
import { getAllUsers } from "@/api/users";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useCustomMutation } from "@/hooks/useCustomMutation";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useAlertStore } from "@/store/useAlertStore";
import { useAuthStore } from "@/store/useAuthStore";
import { apiErrorHandler } from "@/utils/apiErrorHandler";
import { ValidationErrorHandler } from "@/utils/validationErrorHandler";
import { useEffect, useState } from "react";

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

export default function useCreateAndUpdateBranch({
  handleClosePopup,
}: {
  handleClosePopup: () => void;
}) {
  // USER CONTEXT
  const { popupOption, user, setPopupOption } = useAuthStore();

  // ERROR STATE
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // GET EDIT DATA FROM POPUP
  const prevData = popupOption?.data || {};

  // Form Data
  const [formData, setFormData] = useState<BranchFormData>({
    id: prevData?.id || null,
    name: prevData?.name || "",
    address: prevData?.address || "",
    street: prevData?.street || "",
    door_no: prevData?.door_no || "",
    city: prevData?.city || "",
    country: prevData?.country || "",
    postcode: prevData?.postcode || "",
    phone: prevData?.phone || "",
    email: prevData?.email || "",
    is_active: prevData?.is_active || "",
    is_geo_enabled: prevData?.is_geo_enabled || 0,
    manager_id: prevData?.manager_id || "",
    branch_code: prevData?.branch_code || "",
    lat: prevData?.lat != null ? parseFloat(prevData.lat) : "",
    long: prevData?.long != null ? parseFloat(prevData.long) : "",
  });

  useEffect(() => {
    if (prevData?.id) {
      setFormData({
        id: prevData?.id || null,
        name: prevData?.name || "",
        address: prevData?.address || "",
        street: prevData?.street || "",
        door_no: prevData?.door_no || "",
        city: prevData?.city || "",
        country: prevData?.country || "",
        postcode: prevData?.postcode || "",
        phone: prevData?.phone || "",
        email: prevData?.email || "",
        is_active: prevData?.is_active || "",
        is_geo_enabled: prevData?.is_geo_enabled || 0,
        manager_id: prevData?.manager_id || "",
        branch_code: prevData?.branch_code || "",
        lat: prevData?.lat != null ? parseFloat(prevData.lat) : "",
        long: prevData?.long != null ? parseFloat(prevData.long) : "",
      });
      setHasChanges(false);
    }
  }, [prevData]);

  // Update popup cross button warning based on changes
  useEffect(() => {
    setPopupOption((prev: any) => ({
      ...prev,
      disabledButtonWarning: popupOption?.data ? true : !hasChanges,
    }));
  }, [hasChanges, popupOption?.data, setPopupOption]);

  const { data, isLoading } = useCustomQuery({
    queryKey: [QUERY_KEYS.USERS, "branch_manager_select"],
    queryFunc: async () =>
      await getAllUsers({
        role: "branch_manager",
        without_branch: true,
        ignore_id: prevData?.id,
      }),
  });

  // HANDLE FORM CHANGE
  const handleFormChange = (name: keyof BranchFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setHasChanges(true);
  };

  // HANDLE CANCEL
  // HANDLE CANCEL
  const handleCancel = () => {
    if (!popupOption?.data && hasChanges) {
      useAlertStore.getState().showConfirm({
        title: "Discard Changes",
        message: "Are you sure you want to discard your changes?",
        confirmText: "Yes, discard",
        cancelText: "No",
        onConfirm: handleClosePopup,
      });
    } else {
      handleClosePopup();
    }
  };

  // Validate Form Data
  const validateForm = async () => {
    const validationErrors: Record<string, string> = {};

    if (!formData?.name) validationErrors.name = "Name is Required";
    if (!formData?.address) validationErrors.address = "Address is Required";
    if (!formData?.branch_code)
      validationErrors.branch_code = "Branch Code is Required";

    if (formData?.email) {
      if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
          formData.email.trim()
        )
      ) {
        validationErrors.email = "Invalid email";
      } else if (formData?.email !== prevData?.email) {
        try {
          setIsCheckingEmail(true);
          const resp = await checkUserEmail({
            email: formData?.email,
            ignore_user_id: prevData?.id,
          });
          if (resp?.data) {
            validationErrors.email = "Email already exist";
          }
          setIsCheckingEmail(false);
        } catch (err) {
          setIsCheckingEmail(false);
        }
      }
    } else {
      validationErrors.email = "Email is required";
    }

    if (formData?.phone && formData?.phone?.toString().length !== 11) {
      validationErrors.phone = "Phone number must be 11 digits";
    }

    setErrors(validationErrors);
    ValidationErrorHandler(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  // CREATE HANDLER
  const createFunc = useCustomMutation({
    mutationFunc: async (payload: BranchFormData) =>
      await createBranch({
        business_id: user?.business?.id || user?.business_id || "",
        ...payload,
        lat: formData?.lat ? formData?.lat + "" : "",
        long: formData?.long ? formData?.long + "" : "",
      }),
    onSuccess: async () => {
      useAlertStore.getState().showSuccess({
        message: "Branch Added successfully",
        onConfirm: () => {
          popupOption?.refetch?.();
          handleClosePopup?.();
        },
      });
    },
    onError: (err) => {
      apiErrorHandler(err);
    },
  });

  // UPDATE HANDLER
  const updateFunc = useCustomMutation({
    mutationFunc: async (payload: BranchFormData) =>
      await updateBranch(payload.id!, {
        business_id: user?.business?.id || user?.business_id || "",
        ...payload,
        lat: formData?.lat ? formData?.lat + "" : "",
        long: formData?.long ? formData?.long + "" : "",
      }),
    onSuccess: async () => {
      useAlertStore.getState().showSuccess({
        message: "Branch Updated successfully",
        onConfirm: () => {
          popupOption?.refetch?.();
          handleClosePopup?.();
        },
      });
    },
    onError: (err) => {
      apiErrorHandler(err);
    },
  });

  // Handle form submission
  const handleSubmit = async () => {
    if (await validateForm()) {
      if (popupOption?.data?.id) {
        await updateFunc.mutateAsync(formData);
      } else {
        await createFunc.mutateAsync(formData);
      }
    }
  };

  // CHECK USER EMAIL
  const handleCheckUserEmail = (email: string) => {
    if (email === prevData?.email) return;
    setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    setIsCheckingEmail(true);
    checkUserEmail({ email, ignore_user_id: prevData?.id })
      .then((res: any) => {
        if (res?.data) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "User Email already exist",
          }));
        }
        setIsCheckingEmail(false);
      })
      .catch((error: any) => {
        setIsCheckingEmail(false);
        apiErrorHandler(error);
      });
  };

  return {
    formData,
    setFormData,
    errors,
    handleFormChange,
    isLoading,
    isLoadingMap,
    setIsLoadingMap,
    handleCancel,
    setHasChanges,
    handleCheckUserEmail,
    data,
    popupOption,
    updateFunc,
    isCheckingEmail,
    createFunc,
    handleSubmit,
  };
}
