import { COLORS } from "@/constants";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SettingsToggleProps {
  label: string;
  value: boolean | undefined;
  onValueChange: (val: boolean) => void;
  subLabel?: string;
  icon?: string;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  label,
  value,
  onValueChange,
  subLabel,
  icon,
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() => onValueChange(!(value ?? false))}
    style={{
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 3,
    }}
    className={`flex-1 mx-1.5 mb-4 p-4 rounded-2xl border ${
      value ? "border-green-400 bg-base-300" : "border-red-400 bg-base-300"
    } min-h-[110px] justify-between transition-all`}
  >
    <View className="flex-row justify-between items-start">
      <View
        className={`${value ? "bg-green-50" : "bg-red-100"} p-2 rounded-xl`}
      >
        {icon && (
          <Feather
            name={icon as any}
            size={18}
            color={value ? COLORS["green-500"] : COLORS["red-500"]}
          />
        )}
      </View>
      <View
        className={`w-7 h-7 rounded-full items-center justify-center border-2 ${
          value ? "bg-green-500 border-green-500" : "border-gray-200 bg-white"
        }`}
      >
        {value && <Feather name="check" size={16} color="white" />}
      </View>
    </View>

    <View className="mt-2">
      <Text
        className={`text-xs font-bold ${
          value ? "text-gray-900" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
      {subLabel && (
        <Text className="text-[10px] text-gray-400 mt-0.5" numberOfLines={1}>
          {subLabel}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);
