import { COLORS } from "@/constants";
import { Feather, FontAwesome } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export interface FilterOption {
  label?: string;
  name?: string;
  value?: any;
  id?: any;
  setToTheFilter?: any;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: "select" | "date" | "text" | "rating" | "boolean" | "searchable-select";
  options?: FilterOption[];
  placeholder?: string;
  colorScheme?:
    | "blue"
    | "purple"
    | "green"
    | "red"
    | "indigo"
    | "teal"
    | "yellow"
    | "primary";
}

interface UniversalFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  onReset: () => void;
  initialFilters: any;
  configs: FilterConfig[];
  title?: string;
}

const colorMaps = {
  blue: { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-600" },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-500",
    text: "text-purple-600",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-500",
    text: "text-green-600",
  },
  red: { bg: "bg-red-50", border: "border-red-500", text: "text-red-600" },
  indigo: {
    bg: "bg-indigo-50",
    border: "border-indigo-500",
    text: "text-indigo-600",
  },
  teal: { bg: "bg-teal-50", border: "border-teal-500", text: "text-teal-600" },
  yellow: {
    bg: "bg-yellow-50",
    border: "border-yellow-500",
    text: "text-yellow-600",
  },
  primary: {
    bg: "bg-primary/10",
    border: "border-primary",
    text: "text-primary",
  },
};

export const UniversalFilterModal: React.FC<UniversalFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  onReset,
  initialFilters,
  configs,
  title = "Filters",
}) => {
  const [tempFilters, setTempFilters] = useState<any>({});
  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState<
    "start_date" | "end_date" | null
  >(null);
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (visible) {
      setTempFilters({ ...initialFilters });
      setSearchQueries({});
    }
  }, [visible, initialFilters]);

  const handleApply = () => {
    onApply(tempFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  const updateFilter = (id: string, value: any, setToTheFilter?: any) => {
    setTempFilters((prev: any) => {
      const isSelected = prev[id] === value;
      const next = { ...prev };

      if (isSelected) {
        delete next[id];
        if (setToTheFilter) {
          Object.keys(setToTheFilter).forEach((key) => delete next[key]);
        }
      } else {
        next[id] = value;
        if (setToTheFilter) {
          Object.assign(next, setToTheFilter);
        }
      }
      return next;
    });
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    setShowPicker(Platform.OS === "ios");

    if (currentDate && pickerType) {
      const selectedFormatted = moment(currentDate).format("DD-MM-YYYY");

      // Validation
      if (pickerType === "start_date" && tempFilters.end_date) {
        if (
          moment(currentDate).isAfter(
            moment(tempFilters.end_date, "DD-MM-YYYY"),
            "day",
          )
        ) {
          Toast.show({
            type: "error",
            text1: "Invalid Date",
            text2: "Start date cannot be after end date",
          });
          if (Platform.OS === "android") {
            setShowPicker(false);
            setPickerType(null);
          }
          return;
        }
      }

      if (pickerType === "end_date" && tempFilters.start_date) {
        if (
          moment(currentDate).isBefore(
            moment(tempFilters.start_date, "DD-MM-YYYY"),
            "day",
          )
        ) {
          Toast.show({
            type: "error",
            text1: "Invalid Date",
            text2: "End date cannot be before start date",
          });
          if (Platform.OS === "android") {
            setShowPicker(false);
            setPickerType(null);
          }
          return;
        }
      }

      setTempFilters({
        ...tempFilters,
        [pickerType]: selectedFormatted,
      });
    }
    if (Platform.OS === "android") {
      setShowPicker(false);
      setPickerType(null);
    }
  };

  const openDatePicker = (type: "start_date" | "end_date") => {
    setPickerType(type);
    setShowPicker(true);
  };

  const renderField = (config: FilterConfig) => {
    const colors = colorMaps[config.colorScheme || "blue"];

    switch (config.type) {
      case "select":
        return (
          <View key={config.id} className="mb-6">
            <Text className="font-bold text-gray-700 mb-3">{config.label}</Text>
            <View className="flex-row flex-wrap gap-2">
              {config.options?.map((option) => {
                const label = option.label || option.name;
                const value =
                  option.value !== undefined ? option.value : option.id;

                return (
                  <TouchableOpacity
                    key={value}
                    onPress={() =>
                      updateFilter(config.id, value, option.setToTheFilter)
                    }
                    className={`px-4 py-2 rounded-full border ${
                      tempFilters[config.id] === value
                        ? `${colors.bg} ${colors.border}`
                        : "bg-base-300 border-gray-200"
                    }`}
                  >
                    <Text
                      className={`${
                        tempFilters[config.id] === value
                          ? `${colors.text} font-bold`
                          : "text-gray-600"
                      }`}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case "rating":
        return (
          <View key={config.id} className="mb-6">
            <Text className="font-bold text-gray-700 mb-3">{config.label}</Text>
            <View className="flex-row flex-wrap gap-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  onPress={() => updateFilter(config.id, rating)}
                  className={`px-4 py-2 rounded-full border flex-row items-center ${
                    tempFilters[config.id] === rating
                      ? "bg-yellow-50 border-yellow-500"
                      : "bg-base-300 border-gray-200"
                  }`}
                >
                  <Text
                    className={`mr-1 ${
                      tempFilters[config.id] === rating
                        ? "text-yellow-600 font-bold"
                        : "text-gray-600"
                    }`}
                  >
                    {rating}
                  </Text>
                  <FontAwesome
                    name="star"
                    size={14}
                    color={
                      tempFilters[config.id] === rating ? "#d97706" : "#9ca3af"
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "text":
        return (
          <View key={config.id} className="mb-6">
            <Text className="font-bold text-gray-700 mb-3">{config.label}</Text>
            <View className="flex-row items-center bg-base-200 border border-gray-200 rounded-xl px-4 h-12">
              <Feather name="hash" size={18} color="#9ca3af" />
              <TextInput
                placeholder={config.placeholder || `Search ${config.label}...`}
                placeholderTextColor="#9ca3af"
                className="flex-1 ml-3 text-base text-gray-700 font-medium"
                value={tempFilters[config.id] || ""}
                onChangeText={(text) =>
                  setTempFilters({ ...tempFilters, [config.id]: text })
                }
              />
            </View>
          </View>
        );

      case "date":
        return (
          <View key={config.id} className="mb-6">
            <Text className="font-bold text-gray-700 mb-3">{config.label}</Text>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-gray-500 mb-1 text-xs font-semibold">
                  START DATE
                </Text>
                <TouchableOpacity
                  onPress={() => openDatePicker("start_date")}
                  className="flex-row items-center bg-base-200 border border-gray-200 rounded-xl px-4 h-12"
                >
                  <Text className="flex-1 text-gray-700 font-medium">
                    {tempFilters.start_date || "DD-MM-YYYY"}
                  </Text>
                  <Feather name="calendar" size={18} color="#9ca3af" />
                </TouchableOpacity>
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 mb-1 text-xs font-semibold">
                  END DATE
                </Text>
                <TouchableOpacity
                  onPress={() => openDatePicker("end_date")}
                  className="flex-row items-center bg-base-200 border border-gray-200 rounded-xl px-4 h-12"
                >
                  <Text className="flex-1 text-gray-700 font-medium">
                    {tempFilters.end_date || "DD-MM-YYYY"}
                  </Text>
                  <Feather name="calendar" size={18} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case "boolean":
        return (
          <View key={config.id} className="mb-6">
            <Text className="font-bold text-gray-700 mb-3">{config.label}</Text>
            <View className="flex-row flex-wrap gap-2">
              {config.options?.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => updateFilter(config.id, option.value)}
                  className={`px-4 py-2 rounded-full border ${
                    tempFilters[config.id] === option.value
                      ? `${colors.bg} ${colors.border}`
                      : "bg-base-300 border-gray-200"
                  }`}
                >
                  <Text
                    className={`${
                      tempFilters[config.id] === option.value
                        ? `${colors.text} font-bold`
                        : "text-gray-600"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case "searchable-select": {
        const query = (searchQueries[config.id] || "").toLowerCase();
        const filteredOptions =
          config.options?.filter((opt) =>
            (opt.label || opt.name || "").toLowerCase().includes(query),
          ) || [];

        return (
          <View key={config.id} className="mb-6">
            <Text className="font-bold text-gray-700 mb-3">{config.label}</Text>

            {/* Search Input */}
            <View className="flex-row items-center bg-base-200 border border-gray-200 rounded-xl px-4 h-10 mb-3">
              <Feather name="search" size={16} color="#9ca3af" />
              <TextInput
                placeholder={`Search ${config.label}...`}
                placeholderTextColor="#9ca3af"
                className="flex-1 ml-2 text-sm text-gray-700 font-medium"
                value={searchQueries[config.id] || ""}
                onChangeText={(text) =>
                  setSearchQueries((prev) => ({ ...prev, [config.id]: text }))
                }
              />
              {searchQueries[config.id] && (
                <TouchableOpacity
                  onPress={() =>
                    setSearchQueries((prev) => ({ ...prev, [config.id]: "" }))
                  }
                >
                  <Feather name="x" size={14} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>

            {/* Scrollable Results - Only show if query is NOT empty */}
            {query.length > 0 && (
              <View className="max-h-40 bg-base-200 rounded-2xl overflow-hidden border border-gray-100 mt-2">
                <ScrollView nestedScrollEnabled className="w-full">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => {
                      const label = option.label || option.name;
                      const value =
                        option.value !== undefined ? option.value : option.id;
                      const isSelected = tempFilters[config.id] === value;

                      return (
                        <TouchableOpacity
                          key={value}
                          onPress={() =>
                            updateFilter(
                              config.id,
                              value,
                              option.setToTheFilter,
                            )
                          }
                          className={`px-4 py-3 border-b border-gray-100 flex-row items-center justify-between ${
                            isSelected ? "bg-primary/5" : ""
                          }`}
                        >
                          <Text
                            className={`flex-1 ${
                              isSelected
                                ? "text-primary font-bold"
                                : "text-gray-600"
                            }`}
                          >
                            {label}
                          </Text>
                          {isSelected && (
                            <Feather
                              name="check"
                              size={16}
                              color={COLORS.primary}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <View className="p-4 items-center">
                      <Text className="text-gray-400 text-xs italic">
                        No results found
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}

            {/* Show currently selected item label if dropdown is closed and something is selected */}
            {query.length === 0 && tempFilters[config.id] && (
              <View className="flex-row items-center px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
                <Feather name="check-circle" size={14} color={COLORS.primary} />
                <Text className="ml-2 text-primary font-medium text-xs">
                  Selected:{" "}
                  {config.options?.find(
                    (o) =>
                      (o.value !== undefined ? o.value : o.id) ===
                      tempFilters[config.id],
                  )?.name ||
                    config.options?.find(
                      (o) =>
                        (o.value !== undefined ? o.value : o.id) ===
                        tempFilters[config.id],
                    )?.label ||
                    tempFilters[config.id]}
                </Text>
              </View>
            )}
          </View>
        );
      }

      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-base-300 rounded-t-[40px] p-8 h-[85%] shadow-2xl">
              <View className="flex-row justify-between items-center mb-8">
                <View>
                  <Text className="text-2xl font-black text-gray-900">
                    {title}
                  </Text>
                  <View className="h-1 w-12 bg-primary mt-1 rounded-full" />
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  className="bg-gray-100 p-2 rounded-full"
                >
                  <Feather name="x" size={24} color="#4b5563" />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {configs.map(renderField)}
              </ScrollView>

              <View className="flex-row items-center gap-x-3 mt-4 pt-6 pb-2 border-t border-red-100">
                <TouchableOpacity
                  onPress={handleReset}
                  className="w-14 h-14 items-center justify-center rounded-2xl bg-red-200 border border-red-200"
                >
                  <Feather
                    name="rotate-ccw"
                    size={20}
                    color={COLORS["red-500"]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleApply}
                  className="flex-1 h-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30"
                >
                  <Text className="text-white font-bold text-lg text-center w-full">
                    Apply Filters
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {showPicker && (
              <DateTimePicker
                value={
                  pickerType && tempFilters[pickerType]
                    ? moment(tempFilters[pickerType], [
                        "DD-MM-YYYY",
                        "YYYY-MM-DD",
                      ]).toDate()
                    : new Date()
                }
                mode="date"
                minimumDate={
                  pickerType === "end_date" && tempFilters.start_date
                    ? moment(tempFilters.start_date, "DD-MM-YYYY").toDate()
                    : undefined
                }
                maximumDate={
                  pickerType === "start_date" && tempFilters.end_date
                    ? moment(tempFilters.end_date, "DD-MM-YYYY").toDate()
                    : undefined
                }
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
                {...(Platform.OS === "ios" && { textColor: "#000" })}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};
