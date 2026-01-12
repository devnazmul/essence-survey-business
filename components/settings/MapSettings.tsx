import { COLORS } from "@/constants";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Switch, Text, TextInput, View } from "react-native";

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
    <View
      style={{
        shadowColor: "#a0a0a0ff",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      className="flex-row justify-between items-center bg-base-300 border border-primary rounded-xl p-4 mb-3 flex-1 mx-1"
    >
      <Text className="font-medium text-gray-900 text-sm flex-1 mr-2">
        {label}
      </Text>
      <Switch
        trackColor={{ false: COLORS["red-500"], true: COLORS["green-500"] }}
        thumbColor={value ? COLORS["green-100"] : COLORS["red-100"]}
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
      <View className="bg-base-300 rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
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
            value={!!settings.enable_ip_check}
            onValueChange={(val) => setSettings({ enable_ip_check: val })}
          />
          <ToggleRow
            label="Enable Location"
            value={!!settings.enable_location_check}
            onValueChange={(val) => setSettings({ enable_location_check: val })}
          />
        </View>

        {!!settings.enable_location_check && (
          <View className="mb-2">
            <Text className="text-gray-900 font-bold mb-2">Radius(meter)</Text>
            <TextInput
              value={settings.review_distance_limit?.toString()}
              onChangeText={(text) =>
                setSettings({ review_distance_limit: Number(text) })
              }
              keyboardType="numeric"
              className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 bg-base-300"
            />
          </View>
        )}
      </View>

      {/* Our Location */}
      {/* <View className="bg-base-300 rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <View className="flex-row items-center mb-6">
          <View className="bg-green-100 p-2 rounded-lg mr-3">
            <Feather name="map-pin" size={20} color={COLORS.primary} />
          </View>
          <Text className="text-lg font-bold text-primary">Our location</Text>
        </View>

        <View className="rounded-xl overflow-hidden border border-gray-100 h-64 bg-gray-50 items-center justify-center">
          <MapView
            style={{ width: "100%", height: "100%" }}
            region={{
              latitude: Number(settings.latitude) || 0,
              longitude: Number(settings.longitude) || 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: Number(settings.latitude) || 0,
                longitude: Number(settings.longitude) || 0,
              }}
              title="Our Location"
              description={settings.Address}
            />
          </MapView>
        </View>
      </View> */}
      <View className="h-8" />
    </ScrollView>
  );
}
