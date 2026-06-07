import { useDimension } from "@/hooks/useDimension";
import { Feather, FontAwesome } from "@expo/vector-icons";
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
    phone?: string;
    is_active: boolean;
    geo_enabled: boolean;
    updated_at: string;
    avg_rating?: string | number;
    overall_review_count?: number;
    survey_review_count?: number;
    total_reviews?: string | number;
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

  // Assuming address might contain commas that we can split by for the two-line effect
  const addressLines = branch.address ? branch.address.split(",") : [];
  const addressLine1 = addressLines[0]?.trim() || branch.address || "N/A";
  const addressLine2 = addressLines.slice(1).join(",").trim() || "";

  // Calculate the total reviews by summing overall and survey review counts
  const overall = Number(branch.overall_review_count) || 0;
  const survey = Number(branch.survey_review_count) || 0;

  // Use the calculated sum, or fallback to total_reviews if the others don't exist
  const reviewCount =
    branch.overall_review_count !== undefined ||
    branch.survey_review_count !== undefined
      ? overall + survey
      : branch.total_reviews;

  return (
    <View className="bg-white rounded-[24px] p-5 mb-4 border border-gray-100 shadow-sm elevation-1">
      {/* Top Section: Status and Actions */}
      <View className="flex-row justify-between items-center mb-5">
        <View
          className={`px-3 py-1.5 rounded-md ${
            branch.is_active ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <Text
            className={`font-bold ${
              branch.is_active ? "text-green-700" : "text-red-700"
            }`}
            style={{ fontSize: getResponsiveFontSize("xs") }}
          >
            {branch.is_active ? "Active" : "Inactive"}
          </Text>
        </View>

        <View className="flex-row items-center gap-x-4">
          {/* <TouchableOpacity onPress={() => onView?.(branch)}>
            <Feather name="eye" size={20} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onEdit?.(branch)}>
            <MaterialIcons name="edit" size={20} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete?.(branch)}>
            <Feather name="trash-2" size={20} color="#ef4444" />
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Title and Stats Row */}
      <View className="flex-row justify-between items-start mb-6">
        <View className="flex-1 pr-4">
          <Text
            className="font-bold text-[#1e3a8a] mb-2 leading-6"
            numberOfLines={2}
            style={{ fontSize: getResponsiveFontSize("xl") }}
          >
            {branch.name}
          </Text>
          <View className="self-start bg-blue-50 px-2.5 py-1 rounded-md">
            <Text
              className="text-blue-600 font-bold"
              style={{ fontSize: getResponsiveFontSize("xs") }}
            >
              #{branch.branch_code}
            </Text>
          </View>
        </View>

        {/* Right Stats Badges */}
        <View className="items-end gap-y-2">
          {branch.avg_rating !== undefined && branch.avg_rating !== null && (
            <View className="flex-row items-center bg-[#fffbeb] px-2.5 py-1 rounded-lg border border-[#fef3c7]">
              <FontAwesome name="star" size={14} color="#f59e0b" />
              <Text className="text-[#d97706] font-bold ml-1.5 text-xs">
                {branch.avg_rating}
              </Text>
            </View>
          )}
          {reviewCount !== undefined && reviewCount !== null && (
            <View className="flex-row items-center bg-[#eff6ff] px-2.5 py-1 rounded-lg border border-[#dbeafe]">
              <Feather name="message-square" size={14} color="#3b82f6" />
              <Text className="text-[#2563eb] font-bold ml-1.5 text-xs">
                {reviewCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Info Sections */}
      <View className="gap-y-3 mb-5">
        {/* Address */}
        <View className="flex-row items-start">
          <View className="w-8 pt-0.5">
            <Feather name="map-pin" size={16} color="#94a3b8" />
          </View>
          <View className="flex-1">
            <Text
              className="text-[#475569] font-medium"
              style={{ fontSize: getResponsiveFontSize("md") }}
            >
              {addressLine1}
            </Text>
            {!!addressLine2 && (
              <Text
                className="text-[#94a3b8] mt-0.5"
                style={{ fontSize: getResponsiveFontSize("sm") }}
              >
                {addressLine2}
              </Text>
            )}
          </View>
        </View>

        {/* Phone */}
        <View className="flex-row items-center">
          <View className="w-8">
            <Feather name="phone" size={16} color="#94a3b8" />
          </View>
          <Text
            className="text-[#64748b] font-medium flex-1"
            style={{ fontSize: getResponsiveFontSize("sm") }}
          >
            {branch.phone || "N/A"}
          </Text>
        </View>

        {/* Email */}
        <View className="flex-row items-center">
          <View className="w-8">
            <Feather name="mail" size={16} color="#94a3b8" />
          </View>
          <Text
            className="text-[#64748b] font-medium flex-1"
            style={{ fontSize: getResponsiveFontSize("sm") }}
            numberOfLines={1}
          >
            {branch.email || "N/A"}
          </Text>
        </View>
      </View>

      {/* Geo Status Pill */}
      <View className="mb-6 self-start">
        <View className="flex-row items-center bg-[#f8fafc] px-3 py-1.5 rounded-full border border-gray-100">
          <Feather
            name="globe"
            size={14}
            color={branch.geo_enabled ? "#16a34a" : "#ef4444"}
          />
          <Text
            className={`font-bold ml-1.5 uppercase ${
              branch.geo_enabled ? "text-[#16a34a]" : "text-[#ef4444]"
            }`}
            style={{ fontSize: 11 }}
          >
            GEO {branch.geo_enabled ? "ON" : "OFF"}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View className="pt-4 border-t border-gray-50 flex-row items-center">
        <Feather name="calendar" size={14} color="#94a3b8" />
        <Text
          className="text-[#94a3b8] font-medium ml-2 uppercase"
          style={{ fontSize: 11 }}
        >
          UPDATED:{" "}
          {moment(branch.updated_at, "YYYY-MM-DD HH:mm:ss").format(
            "DD-MM-YYYY hh:mm A",
          )}
        </Text>
      </View>
    </View>
  );
};

export default BranchCard;
