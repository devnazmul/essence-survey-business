import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { useNotifications } from "@/hooks/useNotifications";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "dashboard",
    IconComponent: MaterialIcons,
    route: "/(dashboard)",
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: "star-border",
    IconComponent: MaterialIcons,
    route: "/(dashboard)/reviews",
  },
  {
    id: "insights",
    label: "Insights",
    icon: "bar-chart",
    IconComponent: MaterialIcons,
    route: "/(dashboard)/insights",
  },
  {
    id: "branches",
    label: "Branches",
    icon: "storefront",
    IconComponent: MaterialIcons,
    route: "/(dashboard)/branches",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: "notifications-none",
    IconComponent: MaterialIcons,
    route: "/(dashboard)/notifications",
  },
];

const BottomNav = React.memo(({ activeTab }: { activeTab: string }) => {
  const { getResponsiveFontSize } = useDimension();
  const router = useRouter();
  const { unreadCount } = useNotifications();

  const handlePress = React.useCallback(
    (route: string, id: string) => {
      if (activeTab === id) return;
      router.push(route as any);
    },
    [activeTab, router]
  );

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex-row justify-around py-3 pb-6 shadow-2xl">
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        const IconComponent = item.IconComponent;

        return (
          <TouchableOpacity
            key={item.id}
            className="items-center px-4"
            onPress={() => handlePress(item.route, item.id)}
          >
            <View>
              <IconComponent
                name={item.icon as any}
                size={22}
                color={isActive ? COLORS.primary : "#9ca3af"}
              />
              {item.id === "notifications" && unreadCount > 0 && (
                <View className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-500 rounded-full justify-center items-center border border-white">
                  <Text
                    className="text-white font-bold"
                    style={{ fontSize: 8, lineHeight: 10 }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={{
                color: isActive ? COLORS.primary : "#9ca3af",
                fontSize: getResponsiveFontSize("xs") || 10,
              }}
              className={`mt-1.5 ${isActive ? "font-bold" : "font-medium"}`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

BottomNav.displayName = "BottomNav";

export default BottomNav;
