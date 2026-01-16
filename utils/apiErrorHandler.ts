import { useAlertStore } from "@/store/useAlertStore";

export const apiErrorHandler = (error: any, onPressOk = (e: boolean) => e) => {
  console.log({ error });

  const title = error?.response?.data?.message || `Something went wrong!`;
  const message = `${
    (Object.keys(error?.response?.data?.errors || {}).length > 0 &&
      Object.values(error?.response?.data?.errors || {})
        ?.map((messages: any) => {
          if (Array.isArray(messages)) {
            return messages
              ?.map((message: string) => message?.split(".").at(-2))
              ?.join(" > ");
          }
          return messages;
        })
        ?.join(" | ")) ||
    error?.response?.data?.errors?.message ||
    error?.data?.message ||
    error?.message ||
    "Something went wrong! please contact to the customer support."
  }`;

  useAlertStore.getState().showError({
    title,
    message,
    buttonText: "Ok",
    onConfirm: () => onPressOk(false),
  });
};
