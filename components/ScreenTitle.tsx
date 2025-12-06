import React from "react";
import { Text } from "react-native";

interface IScreenTitleProps {
  title: string;
}
const ScreenTitle: React.FC<IScreenTitleProps> = ({ title }) => {
  return <Text className="text-3xl font-bold text-gray-900 mb-4">{title}</Text>;
};

export default ScreenTitle;
