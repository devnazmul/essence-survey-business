import { COLORS } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DrawerModalProps {
  visible: boolean;
  onClose: () => void;
}

const MenuItem = ({ icon, label, IconComponent }: any) => (
  <TouchableOpacity className="items-center w-[23%] mb-6">
    <View className="w-12 h-12 justify-center items-center mb-2">
      <IconComponent name={icon} size={24} color={COLORS.primary} />
    </View>
    <Text className="text-center text-xs text-gray-600 font-medium leading-4">
      {label}
    </Text>
  </TouchableOpacity>
);

import { useRouter } from "expo-router";

const DrawerModal: React.FC<DrawerModalProps> = ({ visible, onClose }) => {
  const { user } = useBusinessStore();
  const router = useRouter(); // Use Expo Router
  // State for expanded menu items
  const [expandedItems, setExpandedItems] = React.useState<
    Record<string, boolean>
  >({});

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: "grid",
      IconComponent: Feather,
    },
    {
      label: "Staffs",
      icon: "users",
      IconComponent: Feather,
      items: [
        { label: "Staff List", icon: "list", IconComponent: Feather },
        {
          label: "Staff Comparison",
          icon: "bar-chart-2",
          IconComponent: Feather,
        },
      ],
    },
    {
      label: "Branches",
      icon: "git-branch", // or share-2
      IconComponent: Feather,
      items: [
        { label: "Branch List", icon: "list", IconComponent: Feather },
        {
          label: "Branch Comparison",
          icon: "bar-chart-2",
          IconComponent: Feather,
        },
      ],
    },
    {
      label: "Overall Review",
      icon: "message-square",
      IconComponent: Feather,
    },
    {
      label: "Surveys",
      icon: "clipboard",
      IconComponent: Feather,
    },
    {
      label: "Review Management",
      icon: "pie-chart",
      IconComponent: Feather,
    },
    {
      label: "Questions",
      icon: "star",
      IconComponent: Feather,
      items: [
        { label: "Question List", icon: "list", IconComponent: Feather },
        {
          label: "Question Categories",
          icon: "folder",
          IconComponent: Feather,
        },
        // { label: "Labels", icon: "tag", IconComponent: Feather },
      ],
    },
    {
      label: "Leaflet",
      icon: "grid", // Using generic grid for QR like/Leaflet if QR not avail in feather directly or use MaterialCommunityIcons
      IconComponent: MaterialCommunityIcons, // Changed below to specific
      items: [
        { label: "Menu Leaflet", icon: "book-open", IconComponent: Feather },
        { label: "User Review Leaflet", icon: "star", IconComponent: Feather },
        {
          label: "Guest Review Leaflet",
          icon: "users",
          IconComponent: Feather,
        },
      ],
    },
    {
      label: "Settings",
      icon: "settings",
      IconComponent: Feather,
      items: [
        { label: "Update Business", icon: "edit", IconComponent: Feather },
        {
          label: "Business Services",
          icon: "briefcase",
          IconComponent: Feather,
        },
      ],
    },
    {
      label: "Visit Client Site",
      icon: "external-link",
      IconComponent: Feather,
    },
  ];

  const handleNavigation = (label: string) => {
    onClose();
    switch (label) {
      case "Dashboard":
        router.push("/(dashboard)"); // Or just "/"
        break;
      case "Overall Review":
        router.push("/reviews");
        break;
      case "Settings":
        router.push("/settings");
        break;
      case "Visit Client Site":
        // Linking.openURL(...) if strictly external, or maybe internal webview
        break;
      default:
        console.log(`Navigation for ${label} not implemented`);
        break;
    }
  };

  const handleLogout = () => {
    onClose();
    useAuthStore.getState().logout();
    router.replace("/signin");
  };

  // Helper to render items
  const renderMenuItem = (item: any, isSubItem = false) => {
    const isExpanded = expandedItems[item.label];
    const hasSubItems = item.items && item.items.length > 0;

    return (
      <View key={item.label} className={`${isSubItem ? "pl-8" : "px-4"} mb-1`}>
        <TouchableOpacity
          onPress={() => {
            if (hasSubItems) {
              toggleExpand(item.label);
            } else {
              handleNavigation(item.label);
            }
          }}
          className={`flex-row items-center justify-between py-3 ${
            !isSubItem && "border-b border-gray-100"
          }`}
        >
          <View className="flex-row items-center">
            {item.IconComponent && ( // Check if component exists
              <item.IconComponent
                name={item.label === "Leaflet" ? "qrcode" : (item.icon as any)}
                size={20}
                color={COLORS.primary}
                className="mr-3"
              />
            )}
            <Text
              className={`text-base ${isSubItem ? "text-gray-600" : "font-medium text-gray-800"}`}
            >
              {item.label}
            </Text>
          </View>
          {hasSubItems && (
            <Feather
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="gray"
            />
          )}
        </TouchableOpacity>

        {hasSubItems && isExpanded && (
          <View className="mt-1">
            {item.items.map((subItem: any) => renderMenuItem(subItem, true))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 rounded-full bg-orange-100 justify-center items-center mr-3">
              <Feather name="user" size={20} color={COLORS.primary} />
            </View>
            <View>
              <View className="flex-row items-center">
                <Text className="font-bold text-gray-800 text-lg mr-1">
                  {user?.name || "User"}
                </Text>
                <Feather name="chevron-down" size={16} color="gray" />
              </View>
              <Text className="text-gray-500 text-sm">01924521771</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity onPress={onClose} className="p-1">
              <Feather name="x" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1 bg-white"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        >
          {menuItems.map((item) => renderMenuItem(item))}

          {/* Logout Button */}
          <View className="mt-4 px-4 pb-8">
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center py-3"
            >
              <Feather
                name="log-out"
                size={20}
                color={COLORS.primary}
                className="mr-3"
              />
              <Text className="text-base font-medium text-gray-800">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default DrawerModal;
