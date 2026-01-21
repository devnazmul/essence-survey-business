import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

interface ScheduledNotification {
  title: string;
  message: string;
  data?: Record<string, any>;
  triggerDate: Date;
}

type ShowInAppCallback = (notification: {
  title: string;
  message: string;
}) => void;

let timers: ReturnType<typeof setTimeout>[] = [];

export async function scheduleNotifications(
  notifications: ScheduledNotification[],
  showInAppCallback: ShowInAppCallback,
) {
  await requestNotificationPermissions();
  clearCombinedNotifications(); // Reset timers

  for (const notification of notifications) {
    const { title, message, data, triggerDate } = notification;
    const delay = triggerDate.getTime() - Date.now();

    // Schedule push notification
    const trigger =
      Platform.OS === "android"
        ? {
            hour: triggerDate.getHours(),
            minute: triggerDate.getMinutes(),
            repeats: false,
          }
        : { date: triggerDate };

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: message,
        data,
      },
      trigger: trigger as unknown as Notifications.NotificationTriggerInput,
    });

    // Schedule in-app notification
    if (delay > 0) {
      const timer = setTimeout(() => {
        showInAppCallback({ title, message });
      }, delay);

      timers.push(timer);
    }
  }
}

function clearCombinedNotifications() {
  timers.forEach((timer) => clearTimeout(timer));
  timers = [];
}

async function requestNotificationPermissions() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: requestStatus } =
      await Notifications.requestPermissionsAsync();
    if (requestStatus !== "granted") {
      throw new Error("Notification permissions not granted");
    }
  }
}
