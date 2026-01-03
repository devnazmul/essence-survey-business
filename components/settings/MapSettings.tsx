import { COLORS } from "@/constants";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Switch, Text, TextInput, View } from "react-native";

export default function MapSettings() {
  const settings = useBusinessStore((state) => state.settings);
  const setSettings = useBusinessStore((state) => state.setSettings);

  const ToggleRow = ({
    label,
    value,
    onValueChange,
  }: {
    label: string;
    value: boolean | undefined;
    onValueChange: (val: boolean) => void;
  }) => (
    <View className="flex-row justify-between items-center bg-white border border-gray-200 rounded-xl p-4 mb-3 flex-1 mx-1">
      <Text className="font-medium text-gray-900 text-sm flex-1 mr-2">
        {label}
      </Text>
      <Switch
        trackColor={{ false: "#e5e7eb", true: COLORS.primary }}
        thumbColor={"#fff"}
        ios_backgroundColor="#e5e7eb"
        onValueChange={onValueChange}
        value={value ?? false}
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
      />
    </View>
  );

  return (
    <ScrollView className="flex-1">
      {/* Basic Maps Settings */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <View className="flex-row items-center mb-6">
          <View className="bg-green-100 p-2 rounded-lg mr-3">
            <Feather name="settings" size={20} color={COLORS.primary} />
          </View>
          <Text className="text-lg font-bold text-primary">
            Basic Maps Settings
          </Text>
        </View>

        <View className="flex-row mb-3">
          <ToggleRow
            label="Enable IP"
            value={settings.enable_ip_check}
            onValueChange={(val) => setSettings({ enable_ip_check: val })}
          />
          <ToggleRow
            label="Enable Location"
            value={settings.enable_location_check}
            onValueChange={(val) => setSettings({ enable_location_check: val })}
          />
        </View>

        <View className="mb-2">
          <Text className="text-gray-900 font-bold mb-2">Radius(meter)</Text>
          <TextInput
            value={settings.review_distance_limit?.toString()}
            onChangeText={(text) =>
              setSettings({ review_distance_limit: Number(text) })
            }
            keyboardType="numeric"
            className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 bg-white"
          />
        </View>
      </View>

      {/* Our Location */}
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <View className="flex-row items-center mb-6">
          <View className="bg-green-100 p-2 rounded-lg mr-3">
            <Feather name="map-pin" size={20} color={COLORS.primary} />
          </View>
          <Text className="text-lg font-bold text-primary">Our location</Text>
        </View>

        <View className="rounded-xl overflow-hidden border border-gray-100 h-64 bg-gray-50 items-center justify-center">
          <Image
            source={{
              uri: "https://static.vecteezy.com/system/resources/previews/000/553/250/original/vector-map-location-background.jpg",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute bg-white/90 p-3 rounded-lg shadow-sm border border-gray-200">
            <Text className="font-bold text-gray-800">
              {settings.latitude?.toFixed(4) || "0.0"}°N,{" "}
              {settings.longitude?.toFixed(4) || "0.0"}°W
            </Text>
            <Text className="text-xs text-gray-500">
              {settings.Address || "Location Details"}
            </Text>
          </View>
        </View>
      </View>
      <View className="h-8" />
    </ScrollView>
  );
}
