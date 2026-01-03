import { useNotifications } from "@/hooks/useNotifications";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
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
      {leftComponent ? leftComponent : <ProfileDropdown />}
      {centerComponent ?? <View className="min-w-10" />}
      {rightComponent ? (
        rightComponent
      ) : (
        <HeaderButton
          IconComponent={Feather}
          iconName="settings"
          onPress={() => router.push("/settings")}
        />
      )}
    </View>
  );
};

export default Header;
