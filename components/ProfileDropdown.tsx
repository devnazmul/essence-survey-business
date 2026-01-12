import { COLORS } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";
import { formatRole } from "@/utils/formatRole";
import getFullImageLink from "@/utils/getFullImageLink";
import { AntDesign, Feather } from "@expo/vector-icons";
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

const ProfileDropdown = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { user } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    setVisible(false);
    logout();
    router.replace("/signin");
  };

  const handleProfileNavigation = () => {
    setVisible(false);
    router.push("/(dashboard)/profile");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View className="relative z-50">
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="w-12 h-12  rounded-xl bg-primary justify-center items-center border-2 border-white shadow-sm"
      >
        <Image
          source={{ uri: getFullImageLink(user?.image) }}
          className="w-12 h-12  rounded-xl bg-primary justify-center items-center border-2 border-white shadow-sm"
        />
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
                <View className="p-4 border-b border-gray-100 bg-gray-50">
                  <Text className="font-bold text-gray-900" numberOfLines={1}>
                    {formatRole(
                      user
                        ? `${user.first_Name || ""} ${user.middle_Name || ""} ${
                            user.last_Name || ""
                          }`
                        : "User"
                    )}
                  </Text>
                  <Text className="text-xs text-gray-500" numberOfLines={1}>
                    {user?.email}
                  </Text>
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

                  {/* <TouchableOpacity
                    className="flex-row items-center p-3 rounded-lg active:bg-gray-100"
                    onPress={() => setVisible(false)}
                  >
                    <MaterialIcons
                      name="storefront"
                      size={18}
                      color="#4B5563"
                    />
                    <Text className="ml-3 text-gray-700 font-medium">
                      Change Branch
                    </Text>
                  </TouchableOpacity> */}

                  <View className="h-[1px] bg-gray-100 my-1" />

                  <TouchableOpacity
                    className="flex-row items-center p-3 rounded-lg active:bg-red-50"
                    onPress={handleLogout}
                  >
                    <AntDesign name="logout" size={18} color={COLORS.error} />
                    <Text className="ml-3 text-error font-medium">Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ProfileDropdown;
