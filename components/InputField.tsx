import COLORS from "@/constants/colors";
import { useDimension } from "@/hooks/useDimension";
import Feather from "@expo/vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardTypeOptions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const BasicInputField = ({
  label,
  placeholder,
  type,
  required,
  hintMessage,
  isError,
  secureTextEntry = false,
  name,
  value,
  keyboardType,
  size = "md",
  disable = false,
  inputMode = "text",
  onBlur = (e: any) => e,
  onChangeText = (e: any) => ({ target: { name: name, value: e } }),
  isLoading = false,
  maxLength,
}: {
  maxLength?: any;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hintMessage?: string;
  isError?: boolean;
  secureTextEntry?: boolean;
  name?: string;
  value?: string;
  keyboardType?: KeyboardTypeOptions;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  disable?: boolean;
  onBlur?: any;
  onChangeText?: any;
  isLoading?: boolean;
  inputMode?:
    | "decimal"
    | "email"
    | "none"
    | "numeric"
    | "search"
    | "tel"
    | "text"
    | "url";
}) => {
  const { getResponsiveHeight, getResponsiveFontSize, getResponsiveWidth, WP } =
    useDimension();
  const [isVisibleContent, setIsVisibleContent] = useState(false);
  return (
    <View className={``}>
      {label && (
        <View className={`flex flex-row p-0 mb-2`}>
          <Text
            style={{
              fontSize: getResponsiveFontSize("md"),
            }}
            className={`font-semibold`}
          >
            {label}{" "}
          </Text>
          <Text
            style={{
              fontSize: getResponsiveFontSize("md"),
            }}
            className={`font-semibold text-red-500`}
          >
            {required && "*"}
          </Text>
        </View>
      )}
      <View className={`relative`}>
        <TextInput
          maxLength={maxLength}
          inputMode={inputMode}
          onBlur={onBlur}
          editable={!disable}
          style={{
            fontSize: getResponsiveFontSize("md"),
          }}
          keyboardType={keyboardType}
          secureTextEntry={!isVisibleContent && secureTextEntry}
          className={`border ${
            isError ? "border-red-500 focus:border-red-500" : "border-gray-200"
          } focus:border-primary px-4 py-3 rounded-lg text-gray-700 bg-base-300 placeholder:text-gray-400`}
          placeholder={placeholder}
          value={value}
          onChangeText={(e) => {
            onChangeText({
              target: {
                name,
                value: e,
              },
            });
          }}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => {
              setIsVisibleContent(!isVisibleContent);
            }}
            style={{ width: getResponsiveWidth("md") }}
            className={`h-full absolute right-0 justify-center items-center `}
          >
            {isVisibleContent ? (
              <Feather
                name="eye-off"
                size={getResponsiveFontSize("2xl")}
                color={"#9ca3af"}
              />
            ) : (
              <Feather
                name="eye"
                size={getResponsiveFontSize("2xl")}
                color={"#9ca3af"}
              />
            )}
          </TouchableOpacity>
        )}
      </View>

      <>
        {isLoading ? (
          <View className={` items-start`}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : (
          <>
            {hintMessage && (
              <Text
                className={`text-sm font-medium pl-2 ${isError ? "text-red-500" : ""}`}
              >
                {hintMessage}
              </Text>
            )}
          </>
        )}
      </>
    </View>
  );
};

export const TextAreaInputField = ({
  label,
  placeholder,
  type,
  required,
  hintMessage,
  isError,
  secureTextEntry = false,
  name,
  value,
  keyboardType,
  rows = 7,
  disable = false,
  onChangeText = (e: any) => ({ target: { name: name, value: e } }),
}: {
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hintMessage?: string;
  isError?: boolean;
  secureTextEntry?: boolean;
  name?: string;
  value?: string;
  keyboardType?: KeyboardTypeOptions;
  rows?: number;
  onChangeText?: any;
  disable?: boolean;
}) => {
  const { getResponsiveHeight, getResponsiveFontSize, getResponsiveWidth, WP } =
    useDimension();
  const [isVisibleContent, setIsVisibleContent] = useState(false);

  return (
    <View className={`relative`}>
      {label && (
        <View className={`flex flex-row p-0  mb-2`}>
          <Text className={`font-semibold`}>{label} </Text>
          <Text className={`font-semibold text-red-500`}>
            {required && "*"}
          </Text>
        </View>
      )}

      <TextInput
        editable={!disable}
        style={{
          paddingHorizontal: 10,
          paddingTop: 10,
          textAlignVertical: "top",
          height: rows * 18,
        }}
        keyboardType={keyboardType}
        secureTextEntry={!isVisibleContent && secureTextEntry}
        className={`border-2 bg-base-300 ${
          isError ? "border-red-500 focus:border-red-500" : "border-gray-300"
        } focus:border-primary px-4 text-start text-black rounded-[10px]`}
        placeholder={placeholder}
        placeholderTextColor={COLORS["gray-400"]}
        value={value}
        multiline
        numberOfLines={rows}
        onChangeText={(e) => {
          onChangeText({
            target: {
              name,
              value: e,
            },
          });
        }}
      />

      {secureTextEntry && (
        <TouchableOpacity
          onPress={() => {
            setIsVisibleContent(!isVisibleContent);
          }}
          className={` absolute left-[90%] ${label ? "top-[40px]" : "top-[18px]"} `}
        >
          {isVisibleContent ? (
            <Feather name="eye-off" size={20} color={"#9ca3af"} />
          ) : (
            <Feather name="eye" size={20} color={"#9ca3af"} />
          )}
        </TouchableOpacity>
      )}

      {hintMessage && (
        <Text
          className={`text-sm font-medium pl-2 ${isError ? "text-red-500" : ""}`}
        >
          {hintMessage}
        </Text>
      )}
    </View>
  );
};

export const DatePickerInputField = ({
  label,
  placeholder,
  type,
  required,
  secureTextEntry = false,
  name,
  value,
  keyboardType,
  size = "md",
  hintMessage = "",
  isError = false,
  minDate,
  maxDate,
  disable = false,
  onChange = (e: any) => ({ target: { name: name, value: e } }),
}: {
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  name?: string;
  value?: string;
  keyboardType?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  hintMessage?: string;
  isError?: boolean;
  minDate?: any;
  maxDate?: any;
  onChange?: any;
  disable?: boolean;
}) => {
  const { getResponsiveHeight, getResponsiveFontSize, getResponsiveWidth, WP } =
    useDimension();
  const [isVisibleContent, setIsVisibleContent] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <View className={`flex-1`}>
      {label && (
        <View className={`flex flex-row p-0  mb-2`}>
          <Text
            style={{
              fontSize: getResponsiveFontSize(size),
            }}
            className={`font-semibold`}
          >
            {label}{" "}
          </Text>
          <Text
            style={{
              fontSize: getResponsiveFontSize(size),
            }}
            className={`font-semibold text-red-500`}
          >
            {required && "*"}
          </Text>
        </View>
      )}
      <TouchableOpacity
        disabled={disable}
        onPress={() => {
          setOpen(true);
        }}
        className={`border-2 ${
          isError ? "border-red-500 focus:border-red-500" : "border-gray-300"
        } focus:border-primary px-4 h-[3.5rem] rounded-[10px] justify-center cursor-pointer`}
      >
        {value ? (
          <Text>{value}</Text>
        ) : (
          <Text className={`text-gray-600`}>{placeholder}</Text>
        )}
      </TouchableOpacity>

      {open && (
        <DateTimePicker
          minimumDate={
            minDate ? moment(minDate, "DD-MM-YYYY").toDate() : undefined
          }
          maximumDate={
            maxDate ? moment(maxDate, "DD-MM-YYYY").toDate() : undefined
          }
          mode="date"
          value={value ? moment(value, "DD-MM-YYYY").toDate() : new Date()}
          onChange={(_, date) => {
            setOpen(false);
            onChange({
              target: {
                name,
                value: date ? moment(date).format("DD-MM-YYYY") : "",
              },
            });
          }}
        />
      )}

      {hintMessage && (
        <Text
          className={`text-sm font-medium pl-2 ${isError ? "text-red-500" : ""}`}
        >
          {hintMessage}
        </Text>
      )}
    </View>
  );
};

export const TimePickerInputField = ({
  label,
  placeholder,
  type,
  required,
  hintMessage,
  isError,
  secureTextEntry = false,
  name,
  value,
  keyboardType,
  size = "md",
  onChange = (e: any) => ({ target: { name: name, value: e } }),
  minTime,
  maxTime,
  disable = false,
}: {
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hintMessage?: string;
  isError?: boolean;
  secureTextEntry?: boolean;
  name?: string;
  value?: string;
  keyboardType?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  onChange?: any;
  minTime?: any;
  maxTime?: any;
  disable?: boolean;
}) => {
  const { getResponsiveHeight, getResponsiveFontSize, getResponsiveWidth, WP } =
    useDimension();
  const [isVisibleContent, setIsVisibleContent] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <View className={`flex-1`}>
      {label && (
        <View className={`flex flex-row p-0  mb-2`}>
          <Text
            style={{
              fontSize: getResponsiveFontSize(size),
            }}
            className={`font-semibold`}
          >
            {label}{" "}
          </Text>
          <Text
            style={{
              fontSize: getResponsiveFontSize(size),
            }}
            className={`font-semibold text-red-500`}
          >
            {required && "*"}
          </Text>
        </View>
      )}
      <TouchableOpacity
        disabled={disable}
        onPress={() => {
          setOpen(true);
        }}
        className={`border-2 ${
          isError ? "border-red-500 focus:border-red-500" : "border-gray-300"
        } focus:border-primary px-4 h-[3.5rem] rounded-[10px] justify-center cursor-pointer`}
      >
        {value ? (
          <Text>{value}</Text>
        ) : (
          <Text className={`text-gray-600`}>{placeholder}</Text>
        )}
      </TouchableOpacity>
      {hintMessage && (
        <Text
          className={`text-sm font-medium pl-2 ${isError ? "text-red-500" : ""}`}
        >
          {hintMessage}
        </Text>
      )}

      {open && (
        <DateTimePicker
          mode="time"
          minimumDate={
            minTime
              ? moment(minTime, "DD-MM-YYYY HH:mm:ss").toDate()
              : undefined
          }
          maximumDate={
            maxTime
              ? moment(maxTime, "DD-MM-YYYY HH:mm:ss").toDate()
              : undefined
          }
          style={{
            width: WP("100%"),
          }}
          is24Hour={false}
          value={value ? moment(value, "HH:mm:ss").toDate() : new Date()}
          onChange={(_, date) => {
            setOpen(false);
            onChange({
              target: {
                name: name,
                value: moment(date).format("HH:mm:ss"),
              },
            });
          }}
        />
      )}
    </View>
  );
};
export default BasicInputField;
