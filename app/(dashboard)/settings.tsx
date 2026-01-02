import IMAGES from "@/assets";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import HeaderButton from "@/components/HeaderButton";
import ProfileDropdown from "@/components/ProfileDropdown";
import ScreenTitle from "@/components/ScreenTitle";
import { useNotifications } from "@/hooks/useNotifications";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { unreadCount } = useNotifications();

  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
      {/* Header */}
      <Header
        leftComponent={
          <View className="relative">
            <HeaderButton
              IconComponent={Feather}
              iconName="bell"
              iconSize={20}
              onPress={() => router.push("/notifications")}
            />
            {unreadCount > 0 && (
              <View className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full justify-center items-center border border-white">
                <Text
                  className="text-white font-bold"
                  style={{ fontSize: 10, lineHeight: 12 }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </View>
        }
        centerComponent={<Image source={IMAGES.logo} className={`w-16 h-16`} />}
        rightComponent={<ProfileDropdown />}
      />
      <ScreenTitle title="Settings" />
      <View className="flex-1 items-center justify-center -mt-20">
        <Image
          source={IMAGES.comingSoon}
          className="w-80 h-80 rounded-full overflow-hidden"
          resizeMode="contain"
        />
        <Text className="text-primary font-bold text-2xl mt-4">
          Coming Soon
        </Text>
        <Text className="text-gray-400 text-center px-10 mt-2">
          We&apos;re working hard to enhance your settings. Stay tuned for more
          control!
        </Text>
      </View>
      <BottomNav activeTab="settings" />
    </SafeAreaView>
  );
}
