import { ErrorModal } from "@/components/modals/ErrorModal";
import { COLORS } from "@/constants";
import { useBusinessStore } from "@/store/useBusinessStore";
import { Feather } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React, { useCallback, useEffect, useState } from "react";
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

const DEFAULT_THRESHOLDS = [
  { min: 80, max: 100, status: "Excellent", color: "#22c55e", label: "Green" },
  { min: 60, max: 79, status: "Good", color: "#eab308", label: "Yellow" },
  {
    min: 40,
    max: 59,
    status: "Needs Attention",
    color: "#f97316",
    label: "Orange",
  },
  { min: 20, max: 39, status: "Critical", color: "#d97706", label: "Amber" },
  { min: 0, max: 19, status: "Very Bad", color: "#ef4444", label: "Red" },
];

const ThresholdRow = React.memo(
  ({
    item,
    index,
    isEditing,
    onValuesChange,
    onStatusChange,
    onColorChange,
    onDelete,
    setScrollEnabled,
  }: {
    item: any;
    index: number;
    isEditing: boolean;
    onValuesChange: (values: number[]) => void;
    onStatusChange: (text: string) => void;
    onColorChange: () => void;
    onDelete: () => void;
    setScrollEnabled: (enabled: boolean) => void;
  }) => {
    return (
      <View
        className={`flex-row py-4 border-b border-gray-50 items-center ${isEditing ? "bg-gray-50/30" : ""}`}
      >
        {/* Score Range Column */}
        <View className="flex-[1.5] pl-2 pr-4">
          {isEditing ? (
            <View className="items-center">
              <MultiSlider
                values={[item.min, item.max]}
                sliderLength={120}
                onValuesChangeStart={() => setScrollEnabled(false)}
                onValuesChangeFinish={(values) => {
                  setScrollEnabled(true);
                  onValuesChange(values);
                }}
                onValuesChange={onValuesChange}
                min={0}
                max={100}
                step={1}
                allowOverlap={false}
                snapped
                selectedStyle={{ backgroundColor: item.color }}
                markerStyle={{
                  height: 16,
                  width: 16,
                  borderRadius: 8,
                  backgroundColor: "black",
                  borderWidth: 2,
                  borderColor: item.color,
                }}
                pressedMarkerStyle={{
                  height: 20,
                  width: 20,
                }}
                containerStyle={{ height: 30 }}
                trackStyle={{ height: 4, borderRadius: 2 }}
              />
              <View className="flex-row justify-between w-full mt-1">
                <Text className="text-[10px] text-gray-500 font-bold">
                  {item.min}
                </Text>
                <Text className="text-[10px] text-gray-500 font-bold">
                  {item.max}
                </Text>
              </View>
            </View>
          ) : (
            <View className="bg-gray-100 px-2 py-1 rounded self-start">
              <Text className="text-gray-600 text-[10px] font-bold">
                {item.min} - {item.max}
              </Text>
            </View>
          )}
        </View>

        {/* Status Column */}
        <View className="flex-1 pr-2">
          {isEditing ? (
            <TextInput
              value={item.status}
              onChangeText={onStatusChange}
              className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 bg-white"
            />
          ) : (
            <Text className="text-gray-600 text-xs font-medium">
              {item.status}
            </Text>
          )}
        </View>

        {/* Color Column */}
        <View className="flex-1 flex-row items-center">
          {isEditing ? (
            <TouchableOpacity
              onPress={onColorChange}
              className="flex-row items-center bg-green-50 border border-green-200 rounded px-2 py-1"
            >
              <View
                className="w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: item.color }}
              />
              <Text className="text-[10px] text-gray-600">{item.label}</Text>
              <Feather
                name="x-circle"
                size={10}
                color="gray"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          ) : (
            <>
              <View
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <Text className="text-gray-600 text-xs">{item.label}</Text>
            </>
          )}
        </View>

        {/* Action Column */}
        {isEditing && (
          <View className="w-10 items-center">
            <TouchableOpacity onPress={onDelete} className="p-1">
              <Feather name="trash-2" size={14} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
);

export default function GeneralSettings() {
  const settings = useBusinessStore((state) => state.settings);
  const setSettings = useBusinessStore((state) => state.setSettings);
  const surveys = useBusinessStore((state) => state.surveys);
  const fetchSurveys = useBusinessStore((state) => state.fetchSurveys);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const [isEditingThresholds, setIsEditingThresholds] = useState(false);
  const [localThresholds, setLocalThresholds] = useState(
    settings.threshold_labels || DEFAULT_THRESHOLDS
  );
  const [scrollEnabled, setScrollEnabled] = useState(true);

  useEffect(() => {
    if (settings.threshold_labels) {
      setLocalThresholds(settings.threshold_labels);
    }
  }, [settings.threshold_labels]);

  const [thresholdRatingInput, setThresholdRatingInput] = useState(
    settings.threshold_rating?.toString() || ""
  );

  // Sync only if not editing to avoid overwriting user input
  useEffect(() => {
    setThresholdRatingInput(settings.threshold_rating?.toString() || "");
  }, [settings.threshold_rating]);

  const handleAddRow = () => {
    setLocalThresholds([
      ...localThresholds,
      { min: 0, max: 10, status: "New", color: "#3b82f6", label: "Blue" },
    ]);
  };

  const handleDeleteRow = useCallback((index: number) => {
    setLocalThresholds((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /* Validation State */
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSaveThresholds = async () => {
    // Validate Thresholds
    const isValid = localThresholds.every(
      (item: any) => item.status && item.status.trim() !== ""
    );

    if (!isValid) {
      setErrorMessage("Please ensure all threshold statuses have a name.");
      setShowErrorModal(true);
      return;
    }

    setSettings({ threshold_labels: localThresholds });
    setIsEditingThresholds(false);
    const updateBusiness = useBusinessStore.getState().updateBusiness;
    await updateBusiness();
  };

  return (
    <ScrollView className="flex-1" scrollEnabled={scrollEnabled}>
      {/* General Settings */}
      <Section title="General Settings" icon="settings">
        <View className="flex-row mb-3">
          <ToggleRow
            label="Guest User"
            subLabel="Allow guests to submit reviews."
            value={!!settings.Is_guest_user}
            onValueChange={(val) => setSettings({ Is_guest_user: val })}
          />
          {!!settings.Is_guest_user && (
            <ToggleRow
              label="Guest User Report"
              subLabel="Enable reporting features for guests."
              value={!!settings.guest_user_review_report}
              onValueChange={(val) =>
                setSettings({ guest_user_review_report: val })
              }
            />
          )}
        </View>

        <View className="mb-2">
          <Text className="text-gray-900 font-bold mb-2">Threshold Rating</Text>
          <TextInput
            value={thresholdRatingInput}
            onChangeText={(text) => {
              // Allow digits and a single decimal point
              if (/^\d*\.?\d*$/.test(text)) {
                setThresholdRatingInput(text);
              }
            }}
            onEndEditing={(e) => {
              const val = Number(e.nativeEvent.text);
              if (!isNaN(val)) {
                setSettings({ threshold_rating: val });
              }
            }}
            keyboardType="numeric"
            className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 bg-white"
          />
        </View>
      </Section>

      {/* Guest Survey Settings */}
      {!!settings.Is_guest_user && (
        <Section title="Guest Survey Settings" icon="message-square">
          <View className="flex-row mb-2">
            <ToggleRow
              label="Overall Review"
              value={!!settings.is_guest_user_overall_review}
              onValueChange={(val) =>
                setSettings({ is_guest_user_overall_review: val })
              }
            />
            <ToggleRow
              label="Survey"
              value={!!settings.is_guest_user_survey}
              onValueChange={(val) =>
                setSettings({ is_guest_user_survey: val })
              }
            />
            {!!settings.is_guest_user_survey && (
              <ToggleRow
                label="Survey required?"
                value={!!settings.is_guest_user_survey_required}
                onValueChange={(val) =>
                  setSettings({ is_guest_user_survey_required: val })
                }
              />
            )}
          </View>
          {!!settings.is_guest_user_survey && (
            <SurveySelector
              label="Guest Survey"
              surveys={surveys}
              selectedId={settings.guest_survey_id}
              onSelect={(id) => setSettings({ guest_survey_id: id })}
            />
          )}
        </Section>
      )}

      {/* User Survey Settings */}
      <Section title="User Survey Settings" icon="file-text">
        <View className="flex-row mb-2">
          <ToggleRow
            label="Overall Review"
            value={!!settings.is_registered_user_overall_review}
            onValueChange={(val) =>
              setSettings({ is_registered_user_overall_review: val })
            }
          />
          <ToggleRow
            label="Survey"
            value={!!settings.is_registered_user_survey}
            onValueChange={(val) =>
              setSettings({ is_registered_user_survey: val })
            }
          />
          {!!settings.is_registered_user_survey && (
            <ToggleRow
              label="Survey required?"
              value={!!settings.is_registered_user_survey_required}
              onValueChange={(val) =>
                setSettings({ is_registered_user_survey_required: val })
              }
            />
          )}
        </View>
        {!!settings.is_registered_user_survey && (
          <SurveySelector
            label="User Survey"
            surveys={surveys}
            selectedId={settings.registered_user_survey_id}
            onSelect={(id) => setSettings({ registered_user_survey_id: id })}
          />
        )}
      </Section>

      {/* Staff Display (Guest) */}
      <Section title="Staff Display (Guest)" icon="users">
        <View className="flex-row">
          <ToggleRow
            label="Show Staffs"
            value={!!settings.is_guest_user_show_stuffs}
            onValueChange={(val) =>
              setSettings({ is_guest_user_show_stuffs: val })
            }
          />
          {!!settings.is_guest_user_show_stuffs && (
            <>
              <ToggleRow
                label="Show Staffs image"
                value={!!settings.is_guest_user_show_stuff_image}
                onValueChange={(val) =>
                  setSettings({ is_guest_user_show_stuff_image: val })
                }
              />
              <ToggleRow
                label="Show Staffs name"
                value={!!settings.is_guest_user_show_stuff_name}
                onValueChange={(val) =>
                  setSettings({ is_guest_user_show_stuff_name: val })
                }
              />
            </>
          )}
        </View>
      </Section>

      {/* Staff Display (User) */}
      <Section title="Staff Display (User)" icon="users">
        <View className="flex-row">
          <ToggleRow
            label="Show Staffs"
            value={!!settings.is_registered_user_show_stuffs}
            onValueChange={(val) =>
              setSettings({ is_registered_user_show_stuffs: val })
            }
          />
          {!!settings.is_registered_user_show_stuffs && (
            <>
              <ToggleRow
                label="Show Staffs image"
                value={!!settings.is_registered_user_show_stuff_image}
                onValueChange={(val) =>
                  setSettings({ is_registered_user_show_stuff_image: val })
                }
              />
              <ToggleRow
                label="Show Staffs name"
                value={!!settings.is_registered_user_show_stuff_name}
                onValueChange={(val) =>
                  setSettings({ is_registered_user_show_stuff_name: val })
                }
              />
            </>
          )}
        </View>
      </Section>

      {/* Default Color Thresholds */}
      <Section title="Default Color Thresholds" icon="sliders">
        <View className="flex-row justify-end mb-4 gap-2">
          {!isEditingThresholds ? (
            <TouchableOpacity
              onPress={() => setIsEditingThresholds(true)}
              className="bg-green-100 px-3 py-1 rounded-lg"
            >
              <Text className="text-green-700 text-xs font-bold">Edit</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleAddRow}
                className="bg-green-50 border border-green-200 px-3 py-1 rounded-lg flex-row items-center"
              >
                <Feather name="plus" size={14} color="#15803d" />
                <Text className="text-green-700 text-xs font-bold ml-1">
                  Add Row
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setLocalThresholds(
                    settings.threshold_labels || DEFAULT_THRESHOLDS
                  );
                  setIsEditingThresholds(false);
                }}
                className="bg-gray-100 px-3 py-1 rounded-lg"
              >
                <Text className="text-gray-700 text-xs font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveThresholds}
                className="bg-green-500 px-3 py-1 rounded-lg"
              >
                <Text className="text-white text-xs font-bold">Save</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View className="bg-white rounded-lg overflow-hidden">
          <View className="flex-row py-2 border-b border-gray-100 items-center">
            <Text className="flex-[1.5] text-gray-400 text-[10px] font-bold uppercase pl-2">
              Score Range
            </Text>
            <Text className="flex-1 text-gray-400 text-[10px] font-bold uppercase">
              Status
            </Text>
            <Text className="flex-1 text-gray-400 text-[10px] font-bold uppercase">
              Color
            </Text>
            {isEditingThresholds && (
              <Text className="w-10 text-gray-400 text-[10px] font-bold uppercase text-center">
                Action
              </Text>
            )}
          </View>

          {localThresholds.map((item: any, index: number) => (
            <ThresholdRow
              key={index}
              item={item}
              index={index}
              isEditing={isEditingThresholds}
              setScrollEnabled={setScrollEnabled}
              onValuesChange={(values) => {
                setLocalThresholds((prev) => {
                  const newState = [...prev];
                  newState[index] = {
                    ...newState[index],
                    min: values[0],
                    max: values[1],
                  };
                  return newState;
                });
              }}
              onStatusChange={(text) => {
                setLocalThresholds((prev) => {
                  const newState = [...prev];
                  newState[index] = { ...newState[index], status: text };
                  return newState;
                });
              }}
              onColorChange={() => {
                const colors = [
                  { c: "#22c55e", l: "Green" },
                  { c: "#eab308", l: "Yellow" },
                  { c: "#f97316", l: "Orange" },
                  { c: "#d97706", l: "Amber" },
                  { c: "#ef4444", l: "Red" },
                  { c: "#3b82f6", l: "Blue" },
                  { c: "#a855f7", l: "Purple" },
                ];
                setLocalThresholds((prev) => {
                  const newState = [...prev];
                  const currentIndex = colors.findIndex(
                    (c) => c.c === newState[index].color
                  );
                  const next = colors[(currentIndex + 1) % colors.length];
                  newState[index] = {
                    ...newState[index],
                    color: next.c,
                    label: next.l,
                  };
                  return newState;
                });
              }}
              onDelete={() => handleDeleteRow(index)}
            />
          ))}
        </View>
      </Section>
      <View className="h-8" />
      <ErrorModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Validation Error"
        message={errorMessage}
      />
    </ScrollView>
  );
}

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
    className="flex-row justify-between items-center bg-white border border-primary rounded-xl p-4 mb-3 flex-1 mx-1"
  >
    <View className="flex-1 mr-2">
      <Text className="font-medium text-gray-900 text-sm">{label}</Text>
      {subLabel && (
        <Text className="text-xs text-gray-500 mt-0.5">{subLabel}</Text>
      )}
    </View>
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
  surveys,
}: {
  label: string;
  selectedId: number | null | undefined;
  onSelect: (id: number) => void;
  surveys: any[];
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedSurvey = surveys.find((s) => s.id === selectedId);

  // Filter surveys based on the label type
  // Use .filter to return an array, not .find which returns a single item
  const filteredSurveys = surveys.filter((s) => {
    if (label === "Guest Survey") {
      return s.show_in_guest_user;
    } else if (label === "User Survey") {
      return s.show_in_user;
    }
    return true;
  });

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
              data={filteredSurveys}
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
