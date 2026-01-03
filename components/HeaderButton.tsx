import { COLORS } from "@/constants";
import React from "react";
import { TouchableOpacity } from "react-native";

interface IHeaderButtonProps {
  IconComponent: any;
  onPress?: () => void;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  buttonClassName?: string;
}

const HeaderButton: React.FC<IHeaderButtonProps> = ({
  IconComponent,
  iconName = "",
  iconSize = 20,
  iconColor = COLORS["base-300"],
  onPress = () => {},
  buttonClassName = "flex-row items-center bg-primary w-12 h-12 rounded-xl flex justify-center items-center",
}) => {
  return (
    <TouchableOpacity className={buttonClassName} onPress={onPress}>
      <IconComponent name={iconName} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

export default HeaderButton;
