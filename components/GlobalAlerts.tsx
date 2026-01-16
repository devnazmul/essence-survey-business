import { useAlertStore } from "@/store/useAlertStore";
import React from "react";
import { ConfirmModal } from "./modals/ConfirmModal";
import { ErrorModal } from "./modals/ErrorModal";
import { SuccessModal } from "./modals/SuccessModal";

export const GlobalAlerts = () => {
  const {
    visible,
    type,
    title,
    message,
    buttonText,
    onConfirm,
    onCancel,
    hideAlert,
  } = useAlertStore();

  if (!visible) return null;

  return (
    <>
      {type === "success" && (
        <SuccessModal
          visible={visible}
          onClose={() => {
            hideAlert();
            onConfirm?.();
          }}
          title={title}
          message={message}
          buttonText={buttonText}
        />
      )}
      {type === "error" && (
        <ErrorModal
          visible={visible}
          onClose={() => {
            hideAlert();
            onConfirm?.();
          }}
          title={title}
          message={message}
          buttonText={buttonText}
        />
      )}
      {type === "confirm" && (
        <ConfirmModal
          visible={visible}
          onClose={() => {
            hideAlert();
            onCancel?.();
          }}
          onConfirm={() => {
            onConfirm?.();
            // confirm modal closes automatically in component or can be closed here
          }}
          title={title}
          message={message}
          confirmText={buttonText}
          cancelText="Cancel" // Assuming default or can be added to store if dynamic needed
        />
      )}
    </>
  );
};
