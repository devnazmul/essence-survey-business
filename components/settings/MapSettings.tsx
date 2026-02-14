import { SettingsToggle } from "@/components/ui/SettingsToggle";
import { COLORS } from "@/constants";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Feather } from "@expo/vector-icons";
import { GoogleMaps } from "expo-maps";
import React from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

export default function MapSettings() {
  const settings = useBusinessStore((state) => state.settings);
  const setSettings = useBusinessStore((state) => state.setSettings);

  const region = {
    latitude: Number(settings.latitude) || 0,
    longitude: Number(settings.longitude) || 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <ScrollView className="flex-1">
      {/* Basic Maps Settings */}
      <View className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-100/50">
        <View className="flex-row items-center mb-6">
          <View className="bg-green-50 p-2.5 rounded-2xl mr-4 shadow-sm">
            <Feather name="settings" size={20} color={COLORS.primary} />
          </View>
          <Text className="text-xl font-extrabold text-gray-900 tracking-tight">
            Basic Maps Settings
          </Text>
        </View>

        <View className="flex-row mb-3">
          <SettingsToggle
            label="Enable IP"
            icon="globe"
            value={!!settings.enable_ip_check}
            onValueChange={(val) => setSettings({ enable_ip_check: val })}
          />
          <SettingsToggle
            label="Enable Location"
            icon="map-pin"
            value={!!settings.enable_location_check}
            onValueChange={(val) => setSettings({ enable_location_check: val })}
          />
        </View>

        {!!settings.enable_location_check && (
          <View className="mb-2 px-1.5">
            <Text className="text-gray-900 font-bold mb-2">Radius(meter)</Text>
            <TextInput
              value={settings.review_distance_limit?.toString()}
              onChangeText={(text) =>
                setSettings({ review_distance_limit: Number(text) })
              }
              keyboardType="numeric"
              className="border border-gray-200 rounded-xl px-4 py-3 text-gray-700 bg-base-300 mb-4"
            />

            <View className="rounded-2xl overflow-hidden border border-gray-100 h-64 bg-gray-50">
              <GoogleMaps.View
                style={{ width: "100%", height: "100%" }}
                cameraPosition={{
                  coordinates: {
                    latitude: region.latitude,
                    longitude: region.longitude,
                  },
                  zoom: 15,
                }}
                markers={[
                  {
                    coordinates: {
                      latitude: region.latitude,
                      longitude: region.longitude,
                    },
                    title: "Business Location",
                  },
                ]}
                circles={[
                  {
                    center: {
                      latitude: region.latitude,
                      longitude: region.longitude,
                    },
                    radius: Number(settings.review_distance_limit) || 0,
                    color: `${COLORS.primary}20`,
                    lineColor: COLORS.primary,
                    lineWidth: 2,
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
