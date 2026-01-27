import { COLORS } from "@/constants";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

interface FilterChipsProps {
  activeFilters: any;
  onRemove: (key: string) => void;
  getLabel: (key: string, value: any) => string;
  className?: string;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  activeFilters,
  onRemove,
  getLabel,
  className = "",
}) => {
  const filterKeys = Object.keys(activeFilters).filter(
    (key) =>
      activeFilters[key] !== "" &&
      activeFilters[key] !== undefined &&
      activeFilters[key] !== null,
  );

  if (filterKeys.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={`mb-4 flex-row max-h-12 ${className}`}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {filterKeys.map((key) => {
        const value = activeFilters[key];
        const label = getLabel(key, value);

        if (!label) return null;

        return (
          <TouchableOpacity
            key={key}
            onPress={() => onRemove(key)}
            activeOpacity={0.7}
            className="rounded-full flex-row items-center bg-primary/10 px-4 py-2 mr-2 border border-primary h-9"
          >
            <Text className="text-primary font-bold mr-2 text-xs">{label}</Text>
            <Feather name="x" size={12} color={COLORS.primary} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
