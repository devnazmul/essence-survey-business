import { toastEmitter } from "./toastEmitter";

/**
 * Handles validation errors by showing a toast notification for the first error.
 * @param errors An object where keys are field names and values are error messages.
 */
export const ValidationErrorHandler = (errors: Record<string, string>) => {
  const errorMessages = Object.values(errors);
  if (errorMessages.length > 0) {
    toastEmitter.show({
      type: "error",
      message: errorMessages[0],
    });
  }
};
