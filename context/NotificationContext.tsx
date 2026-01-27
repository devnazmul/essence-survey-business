import { getNotification, updateNotification } from "@/api/notification";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationAsync";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export interface INotificationContext {
  badgeCount: number;
  unReadNotificationCount: number;
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
  setIsNotificationChanged: (value: number) => void;
  clearNotificationBadge: () => void;
  setUnreadNotification: () => void;
}

export const NotificationContext = createContext<INotificationContext | null>(
  null,
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [isNotificationChanged, setIsNotificationChanged] = useState<number>(0);
  const [expoPushToken, setExpoPushToken] = useState<string | null>("");
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<any>(null);
  const router = useRouter();

  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );

  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  const [unReadNotificationCount, setUnReadNotificationCount] =
    useState<number>(0);

  const fetchUnreadCount = async (page = 1) => {
    try {
      const res = await getNotification({
        status: "unread",
        page,
      });
      setUnReadNotificationCount(res?.total_unread_messages || 0);
      return res;
    } catch (err) {
      console.error("Failed to fetch notification count", err);
      return null;
    }
  };

  useEffect(() => {
    fetchUnreadCount().then((res) => {
      if (res) {
        setBadgeCount(res?.total_unread_messages || 0);
      }
    });
  }, [isNotificationChanged]);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token);
      })
      .catch((err) => {
        setError(err);
      });

    // On notification received
    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        setNotification(notification);

        // increment badge count
        const current = await Notifications.getBadgeCountAsync();
        await Notifications.setBadgeCountAsync(current + 1);

        setIsNotificationChanged(Math.random());
      });

    // On user taps notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          const data = response.notification.request.content.data;
          Notifications.getBadgeCountAsync().then((count) => {
            if (count > 0) {
              Notifications.setBadgeCountAsync(Math.max(count - 1, 0));
            } else {
              Notifications.setBadgeCountAsync(0);
            }
            setIsNotificationChanged(Math.random());
          });

          const notificationId = (data?.notification_id || data?.id) as
            | string
            | number
            | undefined;
          const entityId = (data?.entity_id || data?.entityId) as
            | string
            | undefined;
          const type = data?.type as string | undefined;

          if (notificationId) {
            updateNotification(notificationId, { status: "read" }).catch(
              (err: any) =>
                console.error("Failed to mark push notification as read:", err),
            );
          }

          if (entityId) {
            switch (type) {
              case "new_review":
                router.push(`/review/${entityId}?from=notifications` as any);
                break;
              case "update":
                // No navigation for update type as per notifications.tsx
                router.push("/(dashboard)/notifications" as any);
                break;
              default:
                router.push(`/review/${entityId}?from=notifications` as any);
                break;
            }
          } else {
            router.push("/(dashboard)/notifications" as any);
          }
        },
      );

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearNotificationBadge = () => {
    Notifications.setBadgeCountAsync(0);
    setBadgeCount(0); // Also update local state
  };

  const setUnreadNotification = () => {
    fetchUnreadCount().then((res) => {
      if (res) {
        Notifications.setBadgeCountAsync(res?.total_unread_messages || 0);
        setBadgeCount(res?.total_unread_messages || 0);
      }
    });
  };

  const value: INotificationContext = {
    setIsNotificationChanged,
    badgeCount,
    expoPushToken,
    notification,
    error,
    clearNotificationBadge,
    setUnreadNotification,
    unReadNotificationCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
