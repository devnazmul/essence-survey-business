import { useNotifications } from "@/hooks/useNotifications";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import HeaderButton from "./HeaderButton";
import ProfileDropdown from "./ProfileDropdown";

interface IHeaderProps {
  rightComponent?: React.ReactNode;
  centerComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}
const Header: React.FC<IHeaderProps> = ({
  rightComponent,
  centerComponent,
  leftComponent,
}) => {
  const { unreadCount } = useNotifications();

  return (
    <View className="flex-row justify-between items-center mb-6 w-full">
      {leftComponent ? (
        leftComponent
      ) : (
        <View className="relative">
          <HeaderButton
            IconComponent={Feather}
            iconName="bell"
            onPress={() => router.push("/notifications")}
          />
          {unreadCount > 0 && (
            <View className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full justify-center items-center border border-white">
              <Text
                className="text-white font-bold"
                style={{ fontSize: 10, lineHeight: 12 }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          )}
        </View>
      )}
      {centerComponent ?? <View className="min-w-10" />}
      {rightComponent ? rightComponent : <ProfileDropdown />}
    </View>
  );
};

export default Header;
