import { useDimension } from "@/hooks/useDimension";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import React from "react";
import { Text, View } from "react-native";

interface BranchCardProps {
  branch: {
    id: string | number;
    name: string;
    branch_code: string;
    address: string;
    email: string;
    is_active: boolean;
    geo_enabled: boolean;
    updated_at: string;
  };
  onView?: (branch: any) => void;
  onEdit?: (branch: any) => void;
  onDelete?: (branch: any) => void;
}

const BranchCard: React.FC<BranchCardProps> = ({
  branch,
  onView,
  onEdit,
  onDelete,
}) => {
  const { getResponsiveFontSize } = useDimension();

  return (
    <View className="bg-white rounded-3xl p-5 mb-4 border border-gray-100 shadow-sm elevation-2">
      {/* Top Section: Status and Actions */}
      <View className="flex-row justify-between items-center mb-4">
        <View
          className={`px-3 py-2 rounded-lg ${
            branch.is_active ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <Text
            className={`font-bold uppercase ${
              branch.is_active ? "text-green-600" : "text-red-600"
            }`}
            style={{ fontSize: getResponsiveFontSize("xs") }}
          >
            {branch.is_active ? "Active" : "Inactive"}
          </Text>
        </View>

        {/* <View className="flex-row gap-x-2 bg-gray-50 rounded-full p-1">
          <TouchableOpacity
            onPress={() => onView?.(branch)}
            className="p-2 bg-white rounded-full shadow-sm"
          >
            <Feather name="eye" size={18} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onEdit?.(branch)}
            className="p-2 bg-white rounded-full shadow-sm"
          >
            <Feather name="edit-2" size={18} color={COLORS.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete?.(branch)}
            className="p-2 bg-white rounded-full shadow-sm"
          >
            <Feather name="trash-2" size={18} color={COLORS["red-500"]} />
          </TouchableOpacity>
        </View> */}
      </View>

      {/* Title and Branch Code */}
      <View className="mb-5">
        <Text
          className="font-bold text-slate-800 mb-1"
          numberOfLines={1}
          style={{ fontSize: getResponsiveFontSize("xl") }}
        >
          {branch.name}
        </Text>
        <View className="self-start bg-gray-200 px-3 py-1 rounded-lg border border-gray-300">
          <Text
            className="text-slate-500 font-medium lowercase"
            style={{ fontSize: getResponsiveFontSize("sm") }}
          >
            {branch.branch_code}
          </Text>
        </View>
      </View>

      {/* Info Sections */}
      <View className="gap-y-4">
        {/* Address */}
        <View className="flex-row items-start">
          <View className="w-8 pt-1">
            <Feather name="map-pin" size={18} color="#94a3b8" />
          </View>
          <View className="flex-1">
            <Text
              className="text-slate-400 mt-0.5"
              style={{ fontSize: getResponsiveFontSize("xs") }}
            >
              Address
            </Text>
            <Text
              className="text-slate-600 font-medium leading-5"
              style={{ fontSize: getResponsiveFontSize("md") }}
            >
              {branch.address}
            </Text>
          </View>
        </View>

        {/* Email */}
        <View className="flex-row items-center">
          <View className="w-8">
            <Feather name="mail" size={18} color="#94a3b8" />
          </View>
          <View>
            <Text
              className="text-slate-400 mt-0.5"
              style={{ fontSize: getResponsiveFontSize("xs") }}
            >
              Email
            </Text>
            <Text
              className="text-slate-600 font-medium flex-1"
              style={{ fontSize: getResponsiveFontSize("md") }}
            >
              {branch.email}
            </Text>
          </View>
        </View>

        {/* Geo Status */}
        <View className="flex-row items-center">
          <View className="w-8">
            <MaterialIcons name="public" size={20} color="#94a3b8" />
          </View>
          <View>
            <Text
              className="text-slate-400 mt-0.5"
              style={{ fontSize: getResponsiveFontSize("xs") }}
            >
              Geo Location
            </Text>
            <View className={` py-1 `}>
              <Text
                className={`font-bold ${
                  branch.geo_enabled ? "text-green-600" : "text-red-500"
                }`}
                style={{ fontSize: getResponsiveFontSize("xs") }}
              >
                {branch.geo_enabled ? "Enabled" : "Disabled"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer: Divider and Modification Date */}
      <View className="mt-6">
        <View className="h-[1px] bg-slate-50 mb-4" />
        <View className="flex-row items-center justify-end">
          <Feather name="clock" size={14} color="#94a3b8" />
          <Text
            className="text-slate-400 italic ml-2"
            style={{ fontSize: getResponsiveFontSize("xs") }}
          >
            Last Modified:{" "}
            {moment(branch.updated_at, "YYYY-MM-DD HH:mm:ss").format(
              "DD MMM YYYY - HH:mm A",
            )}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BranchCard;
