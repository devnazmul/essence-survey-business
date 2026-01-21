import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export interface PushNotificationTokens {
  expoToken?: string;
  fcmToken?: string;
  status: Notifications.PermissionStatus;
}

async function registerForPushNotificationsAsync(): Promise<PushNotificationTokens | null> {
  let expoToken: string | undefined;
  let fcmToken: string | undefined;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (!Device.isDevice) {
    console.log("Must use a physical device for push notifications.");
    return null;
  }

  // 👇 Only check once, don’t re-prompt if denied
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus === "undetermined") {
    // first time only
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    // just return null, no alert
    console.log("Push notification permission not granted.");
    return null;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    console.log("Project ID not found.");
    return null;
  }

  try {
    expoToken = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } catch (error: any) {
    console.log(`Failed to get Expo push token: ${error.message}`);
  }

  try {
    fcmToken = (await Notifications.getDevicePushTokenAsync()).data;
  } catch (error: any) {
    console.log(`Failed to get FCM token: ${error.message}`);
  }

  return { expoToken, fcmToken, status: existingStatus };
}

export { registerForPushNotificationsAsync };
