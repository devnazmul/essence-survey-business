import { Feather } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface FilterBarProps {
  search: string;
  onSearchChange: (text: string) => void;
  onFilterPress: () => void;
  placeholder?: string;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  onFilterPress,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <View className={`flex-row items-center mb-4 space-x-2 ${className}`}>
      <View className="flex-1 flex-row items-center bg-base-300 border border-gray-200 rounded-xl px-4 h-12 shadow-sm">
        <Feather name="search" size={20} color="#9ca3af" />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-3 text-gray-700 font-medium"
          value={search}
          onChangeText={onSearchChange}
        />
      </View>
      <TouchableOpacity
        onPress={onFilterPress}
        activeOpacity={0.7}
        className="w-12 h-12 ml-2 bg-primary rounded-xl justify-center items-center shadow-md shadow-primary/30"
      >
        <Feather name="filter" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};
