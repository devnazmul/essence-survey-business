import { DeviceEventEmitter } from "react-native";

const SHOW_TOAST_EVENT = "SHOW_TOAST";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastPayload {
  type: ToastType;
  message: string;
  duration?: number;
}

export const toastEmitter = {
  show: (payload: ToastPayload) => {
    DeviceEventEmitter.emit(SHOW_TOAST_EVENT, payload);
  },
  addListener: (callback: (payload: ToastPayload) => void) => {
    return DeviceEventEmitter.addListener(SHOW_TOAST_EVENT, callback);
  },
};
