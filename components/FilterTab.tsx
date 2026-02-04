import { useDimension } from "@/hooks/useDimension";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface IFilterTabProps {
  title?: string;
  labelAligh?: "center" | "left" | "right";
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
  title,
  labelAligh = "left",
  isLoading = false,
  tabs,
  activeTab,
}) => {
  const { getResponsiveFontSize } = useDimension();
  return (
    <View className={`flex-col`}>
      {title && (
        <Text
          style={{
            textAlign: labelAligh,
          }}
          className={`mb-1 font-medium`}
        >
          {title}
        </Text>
      )}
      <View className="flex-row">
        <View className="flex-row gap-2 mb-6 border border-black/10 bg-base-300 rounded-xl p-2">
          {tabs.map((tab) => (
            <TouchableOpacity
              disabled={isLoading}
              key={tab.value}
              className={
                tab.tabClassName ||
                `flex-row items-center gap-2 py-2 px-2 rounded-lg min-w-[40px] justify-center ${
                  tab.value === activeTab ? "bg-primary/10" : "bg-base-300"
                }`
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
                  fontSize: getResponsiveFontSize("xs"),
                }}
                className={
                  tab.textClassName ||
                  `text-base-300 text-center ${
                    tab.value === activeTab ? "text-primary" : "text-gray-400"
                  }`
                }
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default FilterTab;
