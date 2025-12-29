import { useDimension } from "@/hooks/useDimension";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface IFilterTabProps {
  isLoading?: boolean;
  tabs: {
    IconComponent?: React.FC<any>;
    iconName?: string;
    iconSize?: number;
    iconColor?: string;
    textClassName?: string;
    tabClassName?: string;
    label: string;
    value: string;
    onPress: () => void;
  }[];
  activeTab: string;
}
const FilterTab: React.FC<IFilterTabProps> = ({
  isLoading = false,
  tabs,
  activeTab,
}) => {
  const { getResponsiveFontSize } = useDimension();
  return (
    <View className="flex-row gap-2 mb-6">
      {tabs.map((tab) => (
        <TouchableOpacity
          disabled={isLoading}
          key={tab.value}
          className={
            tab.tabClassName ||
            `flex-row items-center gap-2 p-2 rounded-lg min-w-[40px] justify-center ${tab.value === activeTab ? "bg-primary" : "bg-gray-200"}`
          }
          onPress={tab.onPress}
        >
          {tab.IconComponent ? (
            <tab.IconComponent
              name={tab.iconName}
              size={tab.iconSize}
              color={tab.iconColor}
            />
          ) : (
            ""
          )}
          <Text
            style={{
              fontSize: getResponsiveFontSize("md"),
            }}
            className={
              tab.textClassName ||
              `text-base-300 text-center ${tab.value === activeTab ? "text-white" : "text-gray-400"}`
            }
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default FilterTab;
