import { COLORS } from "@/constants";
import { useNotification } from "@/context/useNotification";
import {
  useBranchesQuery,
  useChangeDefaultBranchMutation,
} from "@/hooks/useBusiness";
import { useAuthStore } from "@/store/useAuthStore";
import { useBusinessStore } from "@/store/useBusinessStore";
import { formatRole } from "@/utils/formatRole";
import { getFullImageLink } from "@/utils/getFullImageLink";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BranchSelectionModal from "./modals/BranchSelectionModal";

const ProfileDropdown = () => {
  const { badgeCount, clearNotificationBadge } = useNotification();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);

  const { user } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);

  const { data: branchesData, isLoading: isBranchesLoading } =
    useBranchesQuery();
  const branchMutation = useChangeDefaultBranchMutation();

  const handleLogout = () => {
    setVisible(false);
    useBusinessStore.getState().clearStore();
    logout();
    clearNotificationBadge();
    router.replace("/signin");
  };

  const handleProfileNavigation = () => {
    setVisible(false);
    router.push("/(dashboard)/profile");
  };

  const handleBranchSelect = async (branchId: number | string | null) => {
    try {
      await branchMutation.mutateAsync({ default_branch_id: branchId });
      setShowBranchModal(false);
      setVisible(false);
    } catch (error) {
      console.error("Failed to switch branch:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const branches = branchesData?.data || [];
  const currentBranchId = user?.business?.default_branch_id;
  const isBusinessOwner = user?.role?.name === "business_owner";

  return (
    <View className="relative z-50">
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="w-12 h-12 relative rounded-xl bg-base-300 justify-center items-center border-2 border-primary shadow-sm"
      >
        {badgeCount > 0 && (
          <View className="absolute -top-2 -right-2 z-50 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
            <Text className="text-xs text-white">
              {badgeCount > 9 ? `+9q76` : badgeCount}
            </Text>
          </View>
        )}
        {!user?.image ? (
          <Image
            source={{ uri: getFullImageLink(user?.image) }}
            className="w-12 h-12  rounded-xl bg-primary justify-center items-center border-2 border-primary shadow-sm"
          />
        ) : (
          <View className="w-12 h-12  rounded-xl bg-base-300 justify-center items-center border-2 border-primary shadow-sm">
            <Text className="text-primary font-bold">
              {getInitials(user?.first_Name || "")}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View className="flex-1 bg-black/20">
            <TouchableWithoutFeedback>
              <View
                className="absolute left-4 top-[110px] bg-base-300 rounded-xl shadow-lg w-56 overflow-hidden"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                {/* Profile Header */}
                <View className="p-4 flex-row items-center border-b border-gray-100 bg-gray-50">
                  {!user?.image ? (
                    <Image
                      source={{ uri: getFullImageLink(user?.image) }}
                      className="w-12 h-12  rounded-xl bg-primary justify-center items-center shadow-sm"
                    />
                  ) : (
                    <View className="w-12 h-12  rounded-xl bg-base-300 justify-center items-center shadow-sm">
                      <Text className="text-primary font-bold">
                        {getInitials(user?.first_Name || "")}
                      </Text>
                    </View>
                  )}
                  <View className="flex-1 ml-4">
                    <Text className="font-bold text-gray-900" numberOfLines={1}>
                      {formatRole(
                        user
                          ? `${user.first_Name || ""} ${user.middle_Name || ""} ${
                              user.last_Name || ""
                            }`
                          : "User",
                      )}
                    </Text>
                    <Text className="text-xs text-gray-500" numberOfLines={1}>
                      {user?.email}
                    </Text>
                  </View>
                </View>

                {/* Options */}
                <View className="p-2">
                  <TouchableOpacity
                    className="flex-row items-center p-3 rounded-lg active:bg-gray-100"
                    onPress={handleProfileNavigation}
                  >
                    <Feather name="user" size={18} color="#4B5563" />
                    <Text className="ml-3 text-gray-700 font-medium">
                      Profile
                    </Text>
                  </TouchableOpacity>

                  {isBusinessOwner && (
                    <TouchableOpacity
                      className="flex-row items-center p-3 rounded-lg active:bg-gray-100"
                      onPress={() => {
                        setVisible(false);
                        setShowBranchModal(true);
                      }}
                    >
                      <MaterialIcons
                        name="storefront"
                        size={18}
                        color="#4B5563"
                      />
                      <Text
                        className="ml-3 text-gray-700 font-medium flex-1"
                        numberOfLines={1}
                      >
                        {branches.find((b: any) => b.id === currentBranchId)
                          ?.name || "All Branch"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    className="flex-row items-center p-3 rounded-lg active:bg-gray-100"
                    onPress={() => {
                      setVisible(false);
                      setShowBranchModal(true);
                    }}
                  >
                    <MaterialIcons
                      name="notifications-none"
                      size={18}
                      color="#4B5563"
                    />
                    <View className="ml-3 text-gray-700 font-medium items-center justify-between flex-row flex-1">
                      <Text numberOfLines={1}>Notifications</Text>
                      {badgeCount > 0 && (
                        <View className="bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                          <Text className="text-base-300 text-xs font-bold">
                            {badgeCount > 9 ? "9+" : badgeCount}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>

                  <View className="h-[1px] bg-gray-100 my-1" />

                  <TouchableOpacity
                    className="flex-row items-center p-3 rounded-lg active:bg-red-200 bg-red-100"
                    onPress={handleLogout}
                  >
                    <MaterialIcons
                      name="logout"
                      size={18}
                      color={COLORS["red-500"]}
                    />
                    <Text className="ml-3 text-error font-medium">Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <BranchSelectionModal
        visible={showBranchModal}
        onClose={() => setShowBranchModal(false)}
        branches={branches}
        currentBranchId={currentBranchId}
        onSelect={handleBranchSelect}
        isLoading={isBranchesLoading}
        isUpdating={branchMutation.isPending}
      />
    </View>
  );
};

export default ProfileDropdown;
