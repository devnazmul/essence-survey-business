import { ErrorModal } from "@/components/modals/ErrorModal";
import { SettingsToggle } from "@/components/ui/SettingsToggle";
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
      "bg-lime-500": "#84cc16",
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
      <View className="flex-[1.3]  pl-2 pr-4">
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
      <View className="flex-1  pr-2">
        {isEditing ? (
          <TextInput
            value={item.status}
            onChangeText={(text) => onStatusChange(index, text)}
            className="border border-gray-200 w-full rounded px-2 py-1 text-xs text-gray-700 bg-base-300"
          />
        ) : (
          <Text className="text-gray-600 text-xs w-full font-medium">
            {item.status}
          </Text>
        )}
      </View>

      {/* Color Column */}
      <View className="flex-1 flex-row items-center justify-end">
        {isEditing ? (
          <TouchableOpacity onPress={() => onColorChange(index)}>
            <View
              className={`w-7 h-7 shadow rounded-full border-2 border-base-300 ${item.color}`}
            />
          </TouchableOpacity>
        ) : (
          <View
            className={`w-7 h-7 shadow rounded-full border-2 border-base-300 ${item.color}`}
          />
        )}
      </View>
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
    settings.default_color_threshold || [],
  );
  console.log({ settings });
  const [scrollEnabled, setScrollEnabled] = useState(true);

  useEffect(() => {
    if (settings.default_color_threshold) {
      setLocalThresholds(settings.default_color_threshold);
    }
  }, [settings.default_color_threshold]);

  const [thresholdRatingInput, setThresholdRatingInput] = useState(
    settings.threshold_rating?.toString() || "",
  );

  // Sync only if not editing to avoid overwriting user input
  useEffect(() => {
    setThresholdRatingInput(settings.threshold_rating?.toString() || "");
  }, [settings.threshold_rating]);

  const handleApplyStandardDefaults = useCallback(() => {
    setLocalThresholds([
      { score_range: [80, 100], status: "Excellent", color: "bg-green-500" },
      { score_range: [65, 79], status: "Good", color: "bg-lime-500" },
      { score_range: [50, 64], status: "Average", color: "bg-yellow-500" },
      {
        score_range: [40, 49],
        status: "Needs Attention",
        color: "bg-orange-500",
      },
      { score_range: [0, 39], status: "Critical", color: "bg-red-500" },
    ]);
  }, []);

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
      "bg-lime-500",
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

  const getInvalidIndices = useCallback((thresholds: any[]) => {
    const invalid = new Set<number>();
    if (!thresholds || thresholds.length === 0) return [];

    // Check Overlaps
    for (let i = 0; i < thresholds.length; i++) {
      for (let j = i + 1; j < thresholds.length; j++) {
        const r1 = thresholds[i].score_range;
        const r2 = thresholds[j].score_range;
        if (r1 && r2) {
          if (Math.max(r1[0], r2[0]) <= Math.min(r1[1], r2[1])) {
            invalid.add(i);
            invalid.add(j);
          }
        }
      }
    }

    // Check Gaps
    const sortedWithIndices = thresholds
      .map((t, i) => ({ t, i }))
      .sort((a, b) => a.t.score_range[0] - b.t.score_range[0]);

    if (sortedWithIndices[0].t.score_range[0] !== 0) {
      invalid.add(sortedWithIndices[0].i);
    }
    if (
      sortedWithIndices[sortedWithIndices.length - 1].t.score_range[1] !== 100
    ) {
      invalid.add(sortedWithIndices[sortedWithIndices.length - 1].i);
    }

    for (let i = 0; i < sortedWithIndices.length - 1; i++) {
      const current = sortedWithIndices[i];
      const next = sortedWithIndices[i + 1];
      if (current.t.score_range[1] + 1 !== next.t.score_range[0]) {
        invalid.add(current.i);
        invalid.add(next.i);
      }
    }

    return Array.from(invalid);
  }, []);

  const invalidIndices = React.useMemo(() => {
    if (!isEditingThresholds) return [];
    return getInvalidIndices(localThresholds);
  }, [localThresholds, isEditingThresholds, getInvalidIndices]);

  const handleSaveThresholds = async () => {
    // Validate Statuses
    const isStatusValid = localThresholds.every(
      (item: any) => item.status && item.status.trim() !== "",
    );

    if (!isStatusValid) {
      setErrorMessage("Please ensure all threshold statuses have a name.");
      setShowErrorModal(true);
      return;
    }

    // Use the comprehensive invalid index check
    const invalid = getInvalidIndices(localThresholds);
    if (invalid.length > 0) {
      // Re-run the detailed check to get the specific message for the modal
      const sorted = [...localThresholds].sort(
        (a, b) => a.score_range[0] - b.score_range[0],
      );

      if (sorted[0].score_range[0] !== 0) {
        setErrorMessage("Thresholds must start from score 0.");
      } else if (sorted[sorted.length - 1].score_range[1] !== 100) {
        setErrorMessage("Thresholds must end at score 100.");
      } else {
        // Find if it's an overlap or a gap
        let foundSpecificError = false;
        for (let i = 0; i < sorted.length - 1; i++) {
          if (sorted[i].score_range[1] >= sorted[i + 1].score_range[0]) {
            setErrorMessage(
              `Overlap detected between ${sorted[i].status} and ${sorted[i + 1].status}.`,
            );
            foundSpecificError = true;
            break;
          }
          if (sorted[i].score_range[1] + 1 !== sorted[i + 1].score_range[0]) {
            setErrorMessage(
              `Gap found between ${sorted[i].score_range[1]} and ${
                sorted[i + 1].score_range[0]
              }. Ranges must be continuous.`,
            );
            foundSpecificError = true;
            break;
          }
        }
        if (!foundSpecificError) {
          setErrorMessage("Please fix the highlighted threshold issues.");
        }
      }

      setShowErrorModal(true);
      return;
    }

    setSettings({ default_color_threshold: localThresholds });
    setIsEditingThresholds(false);
    const updateBusiness = useBusinessStore.getState().updateBusiness;
    await updateBusiness();
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" scrollEnabled={scrollEnabled}>
        <Section
          title="General Settings"
          icon="settings"
          description="Configure basic application behavior and thresholds."
        >
          <View className="flex-row mb-3">
            <SettingsToggle
              label="Guest User"
              subLabel="Allow guests to submit reviews"
              icon="user"
              value={!!settings.Is_guest_user}
              onValueChange={(val) => setSettings({ Is_guest_user: val })}
            />
            {!!settings.Is_guest_user && (
              <SettingsToggle
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
            <Text className="text-gray-900 font-bold mb-2">
              Threshold Rating
            </Text>
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
              <SettingsToggle
                label="Overall Review"
                icon="star"
                value={!!settings.is_guest_user_overall_review}
                onValueChange={(val) =>
                  setSettings({ is_guest_user_overall_review: val })
                }
              />
              <SettingsToggle
                label="Survey"
                icon="file-text"
                value={!!settings.is_guest_user_survey}
                onValueChange={(val) =>
                  setSettings({ is_guest_user_survey: val })
                }
              />
              {!!settings.is_guest_user_survey && (
                <SettingsToggle
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
            <SettingsToggle
              label="Overall Review"
              icon="star"
              value={!!settings.is_registered_user_overall_review}
              onValueChange={(val) =>
                setSettings({ is_registered_user_overall_review: val })
              }
            />
            <SettingsToggle
              label="Survey"
              icon="file-text"
              value={!!settings.is_registered_user_survey}
              onValueChange={(val) =>
                setSettings({ is_registered_user_survey: val })
              }
            />
            {!!settings.is_registered_user_survey && (
              <SettingsToggle
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
            <SettingsToggle
              label="Show Staffs"
              icon="users"
              value={!!settings.is_guest_user_show_stuffs}
              onValueChange={(val) =>
                setSettings({ is_guest_user_show_stuffs: val })
              }
            />
            {!!settings.is_guest_user_show_stuffs && (
              <>
                <SettingsToggle
                  label="Show Image"
                  icon="image"
                  value={!!settings.is_guest_user_show_stuff_image}
                  onValueChange={(val) =>
                    setSettings({ is_guest_user_show_stuff_image: val })
                  }
                />
                <SettingsToggle
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
            <SettingsToggle
              label="Show Staffs"
              icon="users"
              value={!!settings.is_registered_user_show_stuffs}
              onValueChange={(val) =>
                setSettings({ is_registered_user_show_stuffs: val })
              }
            />
            {!!settings.is_registered_user_show_stuffs && (
              <>
                <SettingsToggle
                  label="Show Image"
                  icon="image"
                  value={!!settings.is_registered_user_show_stuff_image}
                  onValueChange={(val) =>
                    setSettings({ is_registered_user_show_stuff_image: val })
                  }
                />
                <SettingsToggle
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
                  onPress={handleApplyStandardDefaults}
                  className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg flex-row items-center"
                >
                  <Feather name="refresh-ccw" size={14} color="#1d4ed8" />
                  <Text
                    style={{
                      lineHeight: 20,
                    }}
                    className="text-blue-700 font-bold px-2 text-xs  ml-1"
                  >
                    Apply Standards
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
              <Text className="flex-[2] text-gray-400 text-[10px] font-bold uppercase pl-2">
                Score Range
              </Text>
              <Text className="flex-[1.5]  text-gray-400 text-[10px] font-bold uppercase">
                Status
              </Text>
              <Text className="flex-[1.5] text-gray-400 text-right text-[10px] font-bold uppercase">
                Color
              </Text>
            </View>

            {localThresholds.map((item: any, index: number) => (
              <ThresholdRow
                key={index}
                item={item}
                index={index}
                isEditing={isEditingThresholds}
                isOverlapping={invalidIndices.includes(index)}
                setScrollEnabled={setScrollEnabled}
                onValuesChange={handleValuesChange}
                onStatusChange={handleStatusChange}
                onColorChange={handleColorChange}
                onDelete={handleDeleteRow}
              />
            ))}
          </View>
        </Section>
      </ScrollView>
      <ErrorModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Validation Error"
        message={errorMessage}
      />
    </View>
  );
}

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
