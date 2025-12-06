import { useDimension } from "@/hooks/useDimension";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
}) => {
  const { getResponsiveFontSize } = useDimension();

  return (
    <TouchableOpacity
      onPress={() => onChange(!checked)}
      className="flex-row items-center gap-2"
      activeOpacity={0.7}
    >
      <View
        className={`w-5 h-5 rounded border-2 items-center justify-center ${
          checked ? "bg-primary border-primary" : "border-gray-400 bg-white"
        }`}
      >
        {checked && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
      {label && (
        <Text
          style={{ fontSize: getResponsiveFontSize("sm") }}
          className="text-gray-700"
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};
