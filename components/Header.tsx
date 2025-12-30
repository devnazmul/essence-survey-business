import React from "react";
import { View } from "react-native";

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
  return (
    <View className="flex-row justify-between items-center mb-6 w-full">
      {leftComponent ?? <View className="w-10" />}
      {centerComponent ?? <View className="min-w-10" />}
      {rightComponent ?? <View className="w-10" />}
    </View>
  );
};

export default Header;
