import { create } from "zustand";

interface AlertState {
  type: "success" | "error" | "confirm" | null;
  visible: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showSuccess: (params: {
    title?: string;
    message: string;
    buttonText?: string;
    onConfirm?: () => void;
  }) => void;
  showError: (params: {
    title?: string;
    message: string;
    buttonText?: string;
    onConfirm?: () => void;
  }) => void;
  showConfirm: (params: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  type: null,
  visible: false,
  title: "",
  message: "",
  buttonText: "OK",

  showSuccess: ({
    title = "Success",
    message,
    buttonText = "Continue",
    onConfirm,
  }) =>
    set({
      type: "success",
      visible: true,
      title,
      message,
      buttonText,
      onConfirm,
    }),

  showError: ({ title = "Error", message, buttonText = "Close", onConfirm }) =>
    set({
      type: "error",
      visible: true,
      title,
      message,
      buttonText,
      onConfirm,
    }),

  showConfirm: ({
    title = "Are you sure?",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
  }) =>
    set({
      type: "confirm",
      visible: true,
      title,
      message,
      buttonText: confirmText, // reusing buttonText for confirm button
      onConfirm,
      onCancel,
    }),

  hideAlert: () =>
    set({
      visible: false,
      type: null,
      title: "",
      message: "",
      onConfirm: undefined,
      onCancel: undefined,
    }),
}));
