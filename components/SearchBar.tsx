import { useDimension } from "@/hooks/useDimension";
import React from "react";
import { TextInput, View } from "react-native";
import Svg, { Path } from "react-native-svg";

type SearchBarProps = {
  setSearchText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  setSearchText,
  placeholder = "Search Dish",
}: SearchBarProps) {
  const { HP, WP, getResponsiveFontSize } = useDimension();
  return (
    <View className="flex-row items-center bg-base-300 border border-gray-300 rounded-md px-2 gap-2 px-5">
      <TextInput
        style={{
          height: HP("5%"),
          fontSize: getResponsiveFontSize("md"),
        }}
        className="flex-1 text-gray-600 placeholder:text-gray-500"
        placeholder={placeholder}
        onChangeText={setSearchText}
      />
      <Svg
        width={20}
        height={20}
        viewBox="0 0 16 16"
        fill="currentColor"
        className="opacity-70"
      >
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
        />
      </Svg>
    </View>
  );
}
