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
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ThresholdRow = React.memo(function ThresholdRow({
  item,
  index,
  isEditing,
  onValuesChange,
  onStatusChange,
  onColorChange,
  onDelete,
  setScrollEnabled,
  isOverlapping,
}: {
  item: any;
  index: number;
  isEditing: boolean;
  onValuesChange: (index: number, values: number[]) => void;
  onStatusChange: (index: number, text: string) => void;
  onColorChange: (index: number) => void;
  onDelete: (index: number) => void;
  setScrollEnabled: (enabled: boolean) => void;
  isOverlapping?: boolean;
}) {
  // Helper to extract hex from bg-class for the slider
  const getHexFromClass = (bgClass: string) => {
    const colorMap: { [key: string]: string } = {
      "bg-green-500": "#22c55e",
      "bg-yellow-500": "#eab308",
      "bg-orange-500": "#f97316",
      "bg-amber-500": "#d97706",
      "bg-red-500": "#ef4444",
      "bg-blue-500": "#3b82f6",
      "bg-purple-500": "#a855f7",
    };
    return colorMap[bgClass] || "#3b82f6";
  };

  const hexColor = getHexFromClass(item.color);

  return (
    <View
      className={`flex-row py-4 border-b border-gray-50 items-center ${
        isOverlapping ? "bg-red-50" : isEditing ? "bg-gray-50/30" : ""
      }`}
    >
      {/* Score Range Column */}
      <View className="flex-[1.5] pl-2 pr-4">
        {isEditing ? (
          <View className="items-center">
            <MultiSlider
              values={item.score_range}
              sliderLength={120}
              onValuesChangeStart={() => setScrollEnabled(false)}
              onValuesChangeFinish={(values) => {
                setScrollEnabled(true);
                onValuesChange(index, values);
              }}
              onValuesChange={(values) => onValuesChange(index, values)}
              min={0}
              max={100}
              step={1}
              allowOverlap={false}
              snapped
              selectedStyle={{ backgroundColor: hexColor }}
              markerStyle={{
                height: 16,
                width: 16,
                borderRadius: 8,
                backgroundColor: "white",
                borderWidth: 2,
                marginTop: 4,
                borderColor: hexColor,
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
                {item.score_range ? item.score_range[0] : 0}
              </Text>
              <Text className="text-[10px] text-gray-500 font-bold">
                {item.score_range ? item.score_range[1] : 0}
              </Text>
            </View>
          </View>
        ) : (
          <View className="bg-gray-100 px-2 py-1 rounded self-start">
            <Text className="text-gray-600 text-[10px] font-bold">
              {item.score_range
                ? `${item.score_range[0]} - ${item.score_range[1]}`
                : "0 - 0"}
            </Text>
          </View>
        )}
      </View>

      {/* Status Column */}
      <View className="flex-1 pr-2">
        {isEditing ? (
          <TextInput
            value={item.status}
            onChangeText={(text) => onStatusChange(index, text)}
            className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 bg-base-300"
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
            onPress={() => onColorChange(index)}
            className="flex-row items-center bg-green-50 border border-green-200 rounded px-2 py-1"
          >
            <View className={`w-2 h-2 rounded-full mr-1.5 ${item.color}`} />
            <Text className="text-[10px] text-gray-600">
              {item.color ? item.color.replace("bg-", "") : ""}
            </Text>
            <Feather
              name="x-circle"
              size={10}
              color="gray"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        ) : (
          <>
            <View className={`w-3 h-3 rounded-full mr-2 ${item.color}`} />
            <Text className="text-gray-600 text-xs">
              {item.color ? item.color.replace("bg-", "") : ""}
            </Text>
          </>
        )}
      </View>

      {/* Action Column */}
      {isEditing && (
        <View className="w-10 items-center">
          <TouchableOpacity onPress={() => onDelete(index)} className="p-1">
            <Feather name="trash-2" size={14} color="#ef4444" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});
ThresholdRow.displayName = "ThresholdRow";

export default function GeneralSettings() {
  const settings = useBusinessStore((state) => state.settings);
  const setSettings = useBusinessStore((state) => state.setSettings);
  const surveys = useBusinessStore((state) => state.surveys);
  const fetchSurveys = useBusinessStore((state) => state.fetchSurveys);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const [isEditingThresholds, setIsEditingThresholds] = useState(false);
  const [localThresholds, setLocalThresholds] = useState(
    settings.default_color_threshold || []
  );
  console.log({ settings });
  const [scrollEnabled, setScrollEnabled] = useState(true);

  useEffect(() => {
    if (settings.default_color_threshold) {
      setLocalThresholds(settings.default_color_threshold);
    }
  }, [settings.default_color_threshold]);

  const [thresholdRatingInput, setThresholdRatingInput] = useState(
    settings.threshold_rating?.toString() || ""
  );

  // Sync only if not editing to avoid overwriting user input
  useEffect(() => {
    setThresholdRatingInput(settings.threshold_rating?.toString() || "");
  }, [settings.threshold_rating]);

  const handleAddRow = useCallback(() => {
    setLocalThresholds([
      ...localThresholds,
      { score_range: [0, 10], status: "New", color: "bg-blue-500" },
    ]);
  }, [localThresholds]);

  const handleDeleteRow = useCallback((index: number) => {
    setLocalThresholds((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleValuesChange = useCallback((index: number, values: number[]) => {
    setLocalThresholds((prev) => {
      const newState = [...prev];
      newState[index] = {
        ...newState[index],
        score_range: [values[0], values[1]],
      };
      return newState;
    });
  }, []);

  const handleStatusChange = useCallback((index: number, text: string) => {
    setLocalThresholds((prev) => {
      const newState = [...prev];
      newState[index] = { ...newState[index], status: text };
      return newState;
    });
  }, []);

  const handleColorChange = useCallback((index: number) => {
    const colors = [
      "bg-green-500",
      "bg-yellow-500",
      "bg-orange-500",
      "bg-amber-500",
      "bg-red-500",
      "bg-blue-500",
      "bg-purple-500",
    ];
    setLocalThresholds((prev) => {
      const newState = [...prev];
      const currentIndex = colors.findIndex((c) => c === newState[index].color);
      const next = colors[(currentIndex + 1) % colors.length];
      newState[index] = {
        ...newState[index],
        color: next,
      };
      return newState;
    });
  }, []);

  /* Validation State */
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getOverlappingIndices = useCallback((thresholds: any[]) => {
    const overlapping = new Set<number>();
    for (let i = 0; i < thresholds.length; i++) {
      for (let j = i + 1; j < thresholds.length; j++) {
        const r1 = thresholds[i].score_range;
        const r2 = thresholds[j].score_range;
        if (r1 && r2) {
          if (Math.max(r1[0], r2[0]) <= Math.min(r1[1], r2[1])) {
            overlapping.add(i);
            overlapping.add(j);
          }
        }
      }
    }
    return Array.from(overlapping);
  }, []);

  const overlappingIndices = React.useMemo(() => {
    if (!isEditingThresholds) return [];
    return getOverlappingIndices(localThresholds);
  }, [localThresholds, isEditingThresholds, getOverlappingIndices]);

  const handleSaveThresholds = async () => {
    // Validate Statuses
    const isStatusValid = localThresholds.every(
      (item: any) => item.status && item.status.trim() !== ""
    );

    if (!isStatusValid) {
      setErrorMessage("Please ensure all threshold statuses have a name.");
      setShowErrorModal(true);
      return;
    }

    // Validate Overlaps
    const overlaps = getOverlappingIndices(localThresholds);
    if (overlaps.length > 0) {
      setErrorMessage(
        "Threshold ranges cannot overlap. Please adjust the highlighted rows."
      );
      setShowErrorModal(true);
      return;
    }

    setSettings({ default_color_threshold: localThresholds });
    setIsEditingThresholds(false);
    const updateBusiness = useBusinessStore.getState().updateBusiness;
    await updateBusiness();
  };

  return (
    <ScrollView className="flex-1" scrollEnabled={scrollEnabled}>
      {/* General Settings */}
      <Section
        title="General Settings"
        icon="settings"
        description="Configure basic application behavior and thresholds."
      >
        <View className="flex-row mb-3">
          <ToggleRow
            label="Guest User"
            subLabel="Allow guests to submit reviews"
            icon="user"
            value={!!settings.Is_guest_user}
            onValueChange={(val) => setSettings({ Is_guest_user: val })}
          />
          {!!settings.Is_guest_user && (
            <ToggleRow
              label="Guest Report"
              subLabel="Enable guest reporting"
              icon="bar-chart-2"
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
            className="border border-gray-200 rounded-lg px-4 py-3 text-gray-700 bg-base-300"
          />
        </View>
      </Section>

      {/* Guest Survey Settings */}
      {!!settings.Is_guest_user && (
        <Section
          title="Guest Survey Settings"
          icon="message-square"
          description="Manage how guest users interact with surveys."
        >
          <View className="flex-row mb-2">
            <ToggleRow
              label="Overall Review"
              icon="star"
              value={!!settings.is_guest_user_overall_review}
              onValueChange={(val) =>
                setSettings({ is_guest_user_overall_review: val })
              }
            />
            <ToggleRow
              label="Survey"
              icon="file-text"
              value={!!settings.is_guest_user_survey}
              onValueChange={(val) =>
                setSettings({ is_guest_user_survey: val })
              }
            />
            {!!settings.is_guest_user_survey && (
              <ToggleRow
                label="Required"
                icon="alert-circle"
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
      <Section
        title="User Survey Settings"
        icon="file-text"
        description="Configure survey options for registered users."
      >
        <View className="flex-row mb-2">
          <ToggleRow
            label="Overall Review"
            icon="star"
            value={!!settings.is_registered_user_overall_review}
            onValueChange={(val) =>
              setSettings({ is_registered_user_overall_review: val })
            }
          />
          <ToggleRow
            label="Survey"
            icon="file-text"
            value={!!settings.is_registered_user_survey}
            onValueChange={(val) =>
              setSettings({ is_registered_user_survey: val })
            }
          />
          {!!settings.is_registered_user_survey && (
            <ToggleRow
              label="Required"
              icon="alert-circle"
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
      <Section
        title="Staff Display (Guest)"
        icon="users"
        description="Visibility of staff information for guest users."
      >
        <View className="flex-row">
          <ToggleRow
            label="Show Staffs"
            icon="users"
            value={!!settings.is_guest_user_show_stuffs}
            onValueChange={(val) =>
              setSettings({ is_guest_user_show_stuffs: val })
            }
          />
          {!!settings.is_guest_user_show_stuffs && (
            <>
              <ToggleRow
                label="Show Image"
                icon="image"
                value={!!settings.is_guest_user_show_stuff_image}
                onValueChange={(val) =>
                  setSettings({ is_guest_user_show_stuff_image: val })
                }
              />
              <ToggleRow
                label="Show Name"
                icon="type"
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
      <Section
        title="Staff Display (User)"
        icon="users"
        description="Visibility of staff information for registered users."
      >
        <View className="flex-row">
          <ToggleRow
            label="Show Staffs"
            icon="users"
            value={!!settings.is_registered_user_show_stuffs}
            onValueChange={(val) =>
              setSettings({ is_registered_user_show_stuffs: val })
            }
          />
          {!!settings.is_registered_user_show_stuffs && (
            <>
              <ToggleRow
                label="Show Image"
                icon="image"
                value={!!settings.is_registered_user_show_stuff_image}
                onValueChange={(val) =>
                  setSettings({ is_registered_user_show_stuff_image: val })
                }
              />
              <ToggleRow
                label="Show Name"
                icon="type"
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
      <Section
        title="Default Color Thresholds"
        icon="sliders"
        description="Define score ranges and their associated colors/statuses."
      >
        <View className="flex-row justify-end mb-4 gap-2">
          {!isEditingThresholds ? (
            <TouchableOpacity
              onPress={() => setIsEditingThresholds(true)}
              className="bg-green-100 px-4 py-2 rounded-lg"
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
                <Text
                  style={{
                    lineHeight: 20,
                  }}
                  className="text-green-700 w-14 text-xs font-bold ml-1"
                >
                  Add Row
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setLocalThresholds(settings.default_color_threshold || []);
                  setIsEditingThresholds(false);
                }}
                className="bg-gray-100 px-3 py-1 rounded-lg"
              >
                <Text
                  style={{
                    lineHeight: 20,
                  }}
                  className="text-gray-700 text-xs font-bold"
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveThresholds}
                className="bg-green-500 px-3 py-1 rounded-lg"
              >
                <Text
                  style={{
                    lineHeight: 20,
                  }}
                  className="text-white text-xs font-bold"
                >
                  Save
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View className="bg-base-300 rounded-lg overflow-hidden">
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
              isOverlapping={overlappingIndices.includes(index)}
              setScrollEnabled={setScrollEnabled}
              onValuesChange={handleValuesChange}
              onStatusChange={handleStatusChange}
              onColorChange={handleColorChange}
              onDelete={handleDeleteRow}
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
  icon,
}: {
  label: string;
  value: boolean | undefined;
  onValueChange: (val: boolean) => void;
  subLabel?: string;
  icon?: string;
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() => onValueChange(!(value ?? false))}
    style={{
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 3,
    }}
    className={`flex-1 mx-1.5 mb-4 p-4 rounded-2xl border ${
      value ? "border-green-400 bg-base-300" : "border-red-400 bg-base-300"
    } min-h-[110px] justify-between transition-all`}
  >
    <View className="flex-row justify-between items-start">
      <View
        className={`${value ? "bg-green-50" : "bg-red-100"} p-2 rounded-xl`}
      >
        {icon && (
          <Feather
            name={icon as any}
            size={18}
            color={value ? COLORS["green-500"] : COLORS["red-500"]}
          />
        )}
      </View>
      <View
        className={`w-7 h-7 rounded-full items-center justify-center border-2 ${
          value ? "bg-green-500 border-green-500" : "border-gray-200 bg-white"
        }`}
      >
        {value && <Feather name="check" size={16} color="white" />}
      </View>
    </View>

    <View className="mt-2">
      <Text
        className={`text-xs font-bold ${
          value ? "text-gray-900" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
      {subLabel && (
        <Text className="text-[10px] text-gray-400 mt-0.5" numberOfLines={1}>
          {subLabel}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);

const Section = ({
  title,
  icon,
  children,
  description,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
  description?: string;
}) => (
  <View className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-100/50 overflow-hidden">
    <View className="flex-row items-center mb-5">
      {icon && (
        <View className="bg-green-50 p-2.5 rounded-2xl mr-4 shadow-sm">
          <Feather name={icon as any} size={20} color={COLORS.primary} />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </Text>
        {description && (
          <Text className="text-xs text-gray-400 mt-0.5">{description}</Text>
        )}
      </View>
    </View>
    <View>{children}</View>
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
          <View className="bg-base-300 rounded-t-3xl p-6 max-h-[50%]">
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
                  className={`p-4 border-b border-gray-100 flex-row justify-between items-center ${
                    selectedId === item.id ? "bg-blue-50" : ""
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      selectedId === item.id ? "text-primary" : "text-gray-700"
                    }`}
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
