import { checkUserEmail } from "@/api/auth";
import {
  useBranchManagersQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  type BranchFormData,
} from "@/hooks/useBranchMutation";
import { useAlertStore } from "@/store/useAlertStore";
import { useAuthStore } from "@/store/useAuthStore";
import { apiErrorHandler } from "@/utils/apiErrorHandler";
import { ValidationErrorHandler } from "@/utils/validationErrorHandler";
import { useEffect, useMemo, useState } from "react";

export type { BranchFormData };

export default function useCreateAndUpdateBranch({
  handleClosePopup,
}: {
  handleClosePopup: () => void;
}) {
  // USER CONTEXT
  const { popupOption, setPopupOption } = useAuthStore();

  // ERROR STATE
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // GET EDIT DATA FROM POPUP WITH MEMOIZATION
  const prevData = useMemo(() => popupOption?.data || {}, [popupOption?.data]);

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
    lat:
      prevData?.lat != null && prevData.lat !== ""
        ? parseFloat(prevData.lat.toString())
        : "",
    long:
      prevData?.long != null && prevData.long !== ""
        ? parseFloat(prevData.long.toString())
        : "",
  });

  useEffect(() => {
    if (popupOption?.data?.id) {
      const prevData = popupOption.data;
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
        lat:
          prevData?.lat != null && prevData.lat !== ""
            ? parseFloat(prevData.lat.toString())
            : "",
        long:
          prevData?.long != null && prevData.long !== ""
            ? parseFloat(prevData.long.toString())
            : "",
      });
      setHasChanges(false);
    }
  }, [popupOption?.data]);

  // Update popup cross button warning based on changes
  useEffect(() => {
    setPopupOption((prev: any) => ({
      ...prev,
      disabledButtonWarning: popupOption?.data ? true : !hasChanges,
    }));
  }, [hasChanges, popupOption?.data, setPopupOption]);

  // Use new mutation hooks
  const createFunc = useCreateBranchMutation({
    onSuccess: handleClosePopup,
    refetch: popupOption?.refetch,
  });

  const updateFunc = useUpdateBranchMutation({
    onSuccess: handleClosePopup,
    refetch: popupOption?.refetch,
  });

  const { data, isLoading } = useBranchManagersQuery(prevData?.id);

  // HANDLE FORM CHANGE
  const handleFormChange = (name: keyof BranchFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setHasChanges(true);
  };

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
    console.log({ s: formData.email });
    if (formData?.email) {
      if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
          formData.email,
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
        } catch {
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
    if (!email || email === prevData?.email) return;
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
