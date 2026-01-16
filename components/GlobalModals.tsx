import { useAuthStore } from "@/store/useAuthStore";
import React from "react";
import CreateBranchModal from "./modals/CreateBranchModal";

export const GlobalModals = () => {
  const { popupOption, setPopupOption } = useAuthStore();

  const handleClose = () => {
    setPopupOption({ open: false, data: null, type: "" });
  };

  return (
    <>
      {popupOption?.type === "branches" && (
        <CreateBranchModal visible={popupOption.open} onClose={handleClose} />
      )}
      {/* Add other global modals here as needed */}
    </>
  );
};
