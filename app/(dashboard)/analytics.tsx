import IMAGES from "@/assets";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import HeaderButton from "@/components/HeaderButton";
import ScreenTitle from "@/components/ScreenTitle";
import { useAuthStore } from "@/store/useAuthStore";
import { AntDesign, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnalyticsScreen() {
  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.replace("/signin");
  };
  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
      {/* Header */}
      <Header
        leftComponent={
          <HeaderButton
            IconComponent={Feather}
            iconName="bell"
            iconSize={20}
            onPress={() => router.push("/notifications")}
          />
        }
        centerComponent={<Image source={IMAGES.logo} className={`w-16 h-16`} />}
        rightComponent={
          <HeaderButton
            IconComponent={AntDesign}
            iconName="logout"
            onPress={handleLogout}
          />
        }
      />
      <ScreenTitle title="Analytics" />
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
          We&apos;re working hard to bring you detailed analytics. Stay tuned
          for powerful insights!
        </Text>
      </View>
      <BottomNav activeTab="analytics" />
    </SafeAreaView>
  );
}
