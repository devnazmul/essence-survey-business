import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface BottomNavProps {
  activeTab: "dashboard" | "reviews" | "insights" | "notifications" | "menu";
}

import { useNotifications } from "@/hooks/useNotifications";

const BottomNav = ({ activeTab }: BottomNavProps) => {
  const { getResponsiveFontSize } = useDimension();
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const navItems = [
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
      id: "notifications",
      label: "Notifications",
      icon: "notifications-none",
      IconComponent: MaterialIcons,
      route: "/(dashboard)/notifications",
    },
    // {
    //   id: "menu",
    //   label: "Menu",
    //   icon: "menu", // Changed icon to menu
    //   IconComponent: Feather,
    //   route: "#", // No route, handles internally
    // },
  ];

  const handlePress = (route: string, id: string) => {
    if (id === "menu") {
      setDrawerVisible(true);
      return;
    }
    if (activeTab === id) return;
    router.push(route as any);
  };

  return (
    <>
      <View className="absolute bottom-0 left-0 right-0 bg-base-300 border-t border-gray-200 flex-row justify-around py-4 pb-6">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.IconComponent;

          return (
            <TouchableOpacity
              key={item.id}
              className="items-center"
              onPress={() => handlePress(item.route, item.id)}
            >
              <View>
                <IconComponent
                  name={item.icon as any}
                  size={24}
                  color={isActive ? COLORS.primary : COLORS["gray-400"]}
                />
                {item.id === "notifications" && unreadCount > 0 && (
                  <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full justify-center items-center border border-white">
                    <Text
                      className="text-white font-bold"
                      style={{ fontSize: 9, lineHeight: 10 }}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={{
                  color: isActive ? COLORS.primary : COLORS["gray-400"],
                  fontSize: getResponsiveFontSize("xs"),
                }}
                className="mt-1 font-medium"
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* <DrawerModal
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      /> */}
    </>
  );
};

export default BottomNav;
