import { useState } from "react";

export default function useCreateAndUpdateBranch({ handleClosePopup }) {
  // USER CONTEXT
  const { popupOption, user, setPopupOption } = useAuth();
  // ERROR STATE
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // GET EDIT DATA FROM POPUP
  const prevData = popupOption?.data || {};

  //Form Data
  const [formData, setFormData] = useState({
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
    lat: prevData?.lat ? parseFloat(prevData?.lat) : "",
    long: prevData?.long ? parseFloat(prevData?.long) : "",
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
        lat: prevData?.lat ? parseFloat(prevData?.lat) : "",
        long: prevData?.long ? parseFloat(prevData?.long) : "",
      });
      setHasChanges(false);
    }
  }, [prevData]);

  // Update popup cross button warning based on changes
  useEffect(() => {
    setPopupOption((prev) => ({
      ...prev,
      disabledButtonWarning: popupOption?.data ? true : !hasChanges,
    }));
  }, [hasChanges, popupOption?.data, setPopupOption]);

  const { data, isLoading } = useCustomQuery({
    queryKey: queryKeys?.allUsers,
    queryFunc: async () =>
      await getAllUsers({
        params: {
          role: "branch_manager",
          without_branch: 1,
          ignore_id: prevData?.id,
        },
      }),
  });

  // HANDLE FORM CHANGE
  const handleFormChange = (e) => {
    formChangeHandler(e, setFormData, setErrors);
    setHasChanges(true);
  };

  // HANDLE CANCEL
  const handleCancel = () => {
    if (!popupOption?.data && hasChanges) {
      CancelConfirmation({
        onConfirm: handleClosePopup,
      });
    } else {
      handleClosePopup();
    }
  };

  // Validate Form Data
  const validateForm = async () => {
    const validationErrors = Object.create({});

    // NAME
    if (!formData?.name) {
      validationErrors.name = "Name is Required";
    }
    // ADDRESS
    if (!formData?.address) {
      validationErrors.address = "Last Name is Required";
    }

    // BRANCH CODE
    if (!formData?.branch_code) {
      validationErrors.branch_code = "Branch Code is Required";
    }

    // MANAGER ID
    // if (!formData?.manager_id) {
    //   validationErrors.manager_id = 'Manager ID is Required';
    // }

    // EMAIL
    if (formData?.email) {
      if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
          formData.email.trim()
        )
      ) {
        validationErrors.email = "Invalid email";
      } else {
        try {
          setIsCheckingEmail(true);
          const resp = await checkUserEmail({ email: formData?.email });
          if (resp?.data) {
            validationErrors.email = "Email already exist";
          }
          setIsCheckingEmail(false);
        } catch (err) {
          setIsCheckingEmail(false);
          validationErrors.email = "Email already exist";
          throw err;
        }
      }
    } else {
      validationErrors.email = "Email is required";
    }

    // PHONE
    if (formData?.phone) {
      if (formData?.phone?.length !== 11) {
        validationErrors.phone = "Phone number must be 11 digits";
      }
    }

    // set erros to erros state
    setErrors(validationErrors);
    ValidationErrorHandler(validationErrors);

    // Return true if there is no validation error
    return Object.keys(validationErrors).length === 0;
  };

  // CREATE HANDLER
  const createFunc = useCustomMutation({
    mutationFunc: async (payload) =>
      await createBranch({
        business_id: user?.business?.id || "",
        ...payload,
        lat: formData?.lat ? formData?.lat + "" : "",
        long: formData?.long ? formData?.long + "" : "",
      }),
    onSuccess: async () => {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type={"success"}
          text={`Branch Added successfully`}
        />
      ));

      popupOption?.refetch?.();
      handleClosePopup?.();
    },
    onError: (err) => {
      handleApiError(err);
    },
  });

  // UPDATE HANDLER
  const updateFunc = useCustomMutation({
    mutationFunc: async (payload) =>
      await updateBranch({
        business_id: user?.business?.id || "",
        ...payload,
        lat: formData?.lat ? formData?.lat + "" : "",
        long: formData?.long ? formData?.long + "" : "",
      }),
    onSuccess: async () => {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type={"success"}
          text={`Branch Updated successfully`}
        />
      ));

      popupOption?.refetch?.();
      handleClosePopup?.();
    },
    onError: (err) => {
      handleApiError(err);
    },
  });

  // Handle form submission with file uploads
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
  const handleCheckUserEmail = (e) => {
    setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    const newErrorsForBusiness = {};
    setIsCheckingEmail(true);
    checkUserEmail({ email: e.target.value })
      .then((res) => {
        if (res?.data) {
          newErrorsForBusiness.email = "User Email already exist";
          setErrors((prevErrors) => ({
            ...prevErrors,
            ...newErrorsForBusiness,
          }));
        }
        setIsCheckingEmail(false);
      })
      .catch((error) => {
        setIsCheckingEmail(false);
        handleApiError(error, "#10359");
      });
    false;
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
