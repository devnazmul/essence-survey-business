import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const registerForPushNotificationsAsync = async (): Promise<
  string | null
> => {
  let token: string | null = null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Notification permissions not granted");
      return null;
    }

    // This gives you the FCM (Android) or APNs (iOS) device token
    // Actually, usually for Expo Push Notifications we want getExpoPushTokenAsync if using Expo Push service
    // But the original code used getDevicePushTokenAsync here.
    // Wait, let's double check if context expects expo token or device token.
    // Context Interface says: expoPushToken: string | null;
    // But implementation in context sets it from this function.
    // If this function returns getDevicePushTokenAsync().data, that is a Device Token (FCM/APNs), not Expo Token.
    // However, the function name is somewhat generic.
    // The previous utils/Notifications.ts fetched BOTH.
    // This one fetches Device Token.
    // I will KEEP the logic as is (fetching Device Token) but type it.
    // Note: getDevicePushTokenAsync().data is string.

    const { data } = await Notifications.getDevicePushTokenAsync();
    token = data;
  } else {
    console.log("Must use physical device for push notifications");
  }

  return token;
};
