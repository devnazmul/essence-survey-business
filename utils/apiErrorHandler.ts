import { Alert } from "react-native";

export const apiErrorHandler = (error: any, onPressOk = (e: boolean) => e) => {
  console.log({ error });
  Alert.alert(
    error?.response?.data?.message || `Something went wrong!`,
    `${
      (Object.keys(error?.response?.data?.errors || {}).length > 0 &&
        Object.values(error?.response?.data?.errors || {})
          ?.map((messages: any) =>
            messages
              ?.map((message: string) => message?.split(".").at(-2))
              ?.join(" > ")
          )
          ?.join(" | ")) ||
      error?.response?.data?.errors?.message ||
      error?.data?.message ||
      error?.message ||
      "Something went wrong! please contact to the customer support."
    }`,
    [
      {
        text: "Ok",
        onPress: () => onPressOk(false),
      },
    ],
    { cancelable: false, onDismiss: () => onPressOk(false) }
  );
};
