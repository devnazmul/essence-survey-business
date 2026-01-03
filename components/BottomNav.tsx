import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface BottomNavProps {
  activeTab: "dashboard" | "reviews" | "analytics" | "settings" | "menu";
}

const BottomNav = ({ activeTab }: BottomNavProps) => {
  const { getResponsiveFontSize } = useDimension();
  const router = useRouter();
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
      id: "analytics",
      label: "Analytics",
      icon: "bar-chart",
      IconComponent: MaterialIcons,
      route: "/(dashboard)/analytics",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "settings",
      IconComponent: Feather,
      route: "/(dashboard)/settings",
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
              <IconComponent
                name={item.icon as any}
                size={24}
                color={isActive ? COLORS.primary : COLORS["gray-400"]}
              />
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
