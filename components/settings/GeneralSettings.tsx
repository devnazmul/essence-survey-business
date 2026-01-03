import { COLORS } from "@/constants";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function GeneralSettings() {
  const settings = useBusinessStore((state) => state.settings);
  const setSettings = useBusinessStore((state) => state.setSettings);
  const surveys = useBusinessStore((state) => state.surveys);
  const fetchSurveys = useBusinessStore((state) => state.fetchSurveys);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const ToggleRow = ({
    label,
    value,
    onValueChange,
    subLabel,
  }: {
    label: string;
    value: boolean | undefined;
    onValueChange: (val: boolean) => void;
    subLabel?: string;
  }) => (
    <View className="flex-row justify-between items-center bg-white border border-gray-200 rounded-xl p-4 mb-3 flex-1 mx-1">
      <View className="flex-1 mr-2">
        <Text className="font-medium text-gray-900 text-sm">{label}</Text>
        {subLabel && (
          <Text className="text-xs text-gray-500 mt-0.5">{subLabel}</Text>
        )}
      </View>
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

  const Section = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon?: string;
    children: React.ReactNode;
  }) => (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center mb-4">
        {icon && (
          <View className="bg-green-100 p-2 rounded-lg mr-3">
            <Feather name={icon as any} size={18} color={COLORS.primary} />
          </View>
        )}
        <Text className="text-lg font-bold text-primary">{title}</Text>
      </View>
      {children}
    </View>
  );

  const SurveySelector = ({
    label,
    selectedId,
    onSelect,
  }: {
    label: string;
    selectedId: number | null | undefined;
    onSelect: (id: number) => void;
  }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const selectedSurvey = surveys.find((s) => s.id === selectedId);

    return (
      <View>
        <Text className="text-gray-900 font-bold mb-2">
          {label} <Text className="text-red-500">*</Text>
        </Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            {selectedSurvey ? (
              <>
                <Text className="text-gray-900 font-medium mr-2">
                  {selectedSurvey.name}
                </Text>
                <View className="bg-green-100 px-2 py-0.5 rounded">
                  <Text className="text-green-700 text-[10px] font-bold">
                    Active
                  </Text>
                </View>
              </>
            ) : (
              <Text className="text-gray-400">Select {label}</Text>
            )}
          </View>
          <Feather name="chevron-down" size={20} color="gray" />
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
            className="flex-1 justify-end bg-black/50"
          >
            <View className="bg-white rounded-t-3xl p-6 max-h-[50%]">
              <Text className="text-xl font-bold text-gray-900 mb-4">
                Select {label}
              </Text>
              <FlatList
                data={surveys}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(item.id);
                      setModalVisible(false);
                    }}
                    className={`p-4 border-b border-gray-100 flex-row justify-between items-center ${selectedId === item.id ? "bg-blue-50" : ""}`}
                  >
                    <Text
                      className={`font-medium ${selectedId === item.id ? "text-primary" : "text-gray-700"}`}
                    >
                      {item.name}
                    </Text>
                    {selectedId === item.id && (
                      <Feather name="check" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  return (
    <ScrollView className="flex-1">
      {/* General Settings */}
      <Section title="General Settings" icon="settings">
        <View className="flex-row mb-3">
          <ToggleRow
            label="Guest User"
            subLabel="Allow guests to submit reviews."
            value={settings.Is_guest_user}
            onValueChange={(val) => setSettings({ Is_guest_user: val })}
          />
          <ToggleRow
            label="Guest User Report"
            subLabel="Enable reporting features for guests."
            value={settings.guest_user_review_report}
            onValueChange={(val) =>
              setSettings({ guest_user_review_report: val })
            }
          />
        </View>

        <View className="mb-2">
          <Text className="text-gray-900 font-bold mb-2">Threshold Rating</Text>
          <TextInput
            value={settings.threshold_rating?.toString()}
            onChangeText={(text) =>
              setSettings({ threshold_rating: Number(text) })
            }
            keyboardType="numeric"
            className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 bg-white"
          />
        </View>
      </Section>

      {/* Guest Survey Settings */}
      <Section title="Guest Survey Settings" icon="message-square">
        <View className="flex-row mb-2">
          <ToggleRow
            label="Overall Review"
            value={settings.is_guest_user_overall_review}
            onValueChange={(val) =>
              setSettings({ is_guest_user_overall_review: val })
            }
          />
          <ToggleRow
            label="Survey"
            value={settings.is_guest_user_survey}
            onValueChange={(val) => setSettings({ is_guest_user_survey: val })}
          />
          <ToggleRow
            label="Survey required?"
            value={settings.is_guest_user_survey_required}
            onValueChange={(val) =>
              setSettings({ is_guest_user_survey_required: val })
            }
          />
        </View>
        <SurveySelector
          label="Guest Survey"
          selectedId={settings.guest_survey_id}
          onSelect={(id) => setSettings({ guest_survey_id: id })}
        />
      </Section>

      {/* User Survey Settings */}
      <Section title="User Survey Settings" icon="file-text">
        <View className="flex-row mb-2">
          <ToggleRow
            label="Overall Review"
            value={settings.is_registered_user_overall_review}
            onValueChange={(val) =>
              setSettings({ is_registered_user_overall_review: val })
            }
          />
          <ToggleRow
            label="Survey"
            value={settings.is_registered_user_survey}
            onValueChange={(val) =>
              setSettings({ is_registered_user_survey: val })
            }
          />
          <ToggleRow
            label="Survey required?"
            value={settings.is_registered_user_survey_required}
            onValueChange={(val) =>
              setSettings({ is_registered_user_survey_required: val })
            }
          />
        </View>
        <SurveySelector
          label="User Survey"
          selectedId={settings.registered_user_survey_id}
          onSelect={(id) => setSettings({ registered_user_survey_id: id })}
        />
      </Section>

      {/* Staff Display (Guest) */}
      <Section title="Staff Display (Guest)" icon="users">
        <View className="flex-row">
          <ToggleRow
            label="Show Staffs"
            value={settings.is_guest_user_show_stuffs}
            onValueChange={(val) =>
              setSettings({ is_guest_user_show_stuffs: val })
            }
          />
          <ToggleRow
            label="Show Staffs image"
            value={settings.is_guest_user_show_stuff_image}
            onValueChange={(val) =>
              setSettings({ is_guest_user_show_stuff_image: val })
            }
          />
          <ToggleRow
            label="Show Staffs name"
            value={settings.is_guest_user_show_stuff_name}
            onValueChange={(val) =>
              setSettings({ is_guest_user_show_stuff_name: val })
            }
          />
        </View>
      </Section>

      {/* Staff Display (User) */}
      <Section title="Staff Display (User)" icon="users">
        <View className="flex-row">
          <ToggleRow
            label="Show Staffs"
            value={settings.is_registered_user_show_stuffs}
            onValueChange={(val) =>
              setSettings({ is_registered_user_show_stuffs: val })
            }
          />
          <ToggleRow
            label="Show Staffs image"
            value={settings.is_registered_user_show_stuff_image}
            onValueChange={(val) =>
              setSettings({ is_registered_user_show_stuff_image: val })
            }
          />
          <ToggleRow
            label="Show Staffs name"
            value={settings.is_registered_user_show_stuff_name}
            onValueChange={(val) =>
              setSettings({ is_registered_user_show_stuff_name: val })
            }
          />
        </View>
      </Section>

      {/* Default Color Thresholds */}
      <Section title="Default Color Thresholds" icon="sliders">
        <View className="flex-row justify-end mb-4">
          <TouchableOpacity className="bg-green-100 px-3 py-1 rounded-lg">
            <Text className="text-green-700 text-xs font-bold">Edit</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-lg overflow-hidden">
          <View className="flex-row py-2 border-b border-gray-100">
            <Text className="flex-1 text-gray-400 text-xs font-bold uppercase pl-4">
              Score Range
            </Text>
            <Text className="flex-1 text-gray-400 text-xs font-bold uppercase">
              Status
            </Text>
            <Text className="flex-1 text-gray-400 text-xs font-bold uppercase">
              Color
            </Text>
          </View>

          {[
            {
              range: "80 - 100",
              status: "Excellent",
              color: "#22c55e",
              label: "Green",
            },
            {
              range: "60 - 79",
              status: "Good",
              color: "#eab308",
              label: "Yellow",
            },
            {
              range: "40 - 59",
              status: "Needs Attention",
              color: "#f97316",
              label: "Orange",
            },
            {
              range: "20 - 39",
              status: "Critical",
              color: "#d97706",
              label: "Amber",
            },
            {
              range: "0 - 19",
              status: "Very Bad",
              color: "#ef4444",
              label: "Red",
            },
          ].map((item, index) => (
            <View
              key={index}
              className="flex-row py-4 border-b border-gray-50 items-center"
            >
              <View className="flex-1 pl-4">
                <View className="bg-gray-100 px-2 py-1 rounded self-start">
                  <Text className="text-gray-600 text-xs font-bold">
                    {item.range}
                  </Text>
                </View>
              </View>
              <Text className="flex-1 text-gray-600 text-sm font-medium">
                {item.status}
              </Text>
              <View className="flex-1 flex-row items-center">
                <View
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <Text className="text-gray-600 text-sm">{item.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </Section>
      <View className="h-8" />
    </ScrollView>
  );
}
