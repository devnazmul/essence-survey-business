import { useDimension } from "@/hooks/useDimension";
import React from "react";
import { Text, View } from "react-native";
import { BasicInputField } from "./InputField";

interface IGuestDetailsCompProps {
  errors: any;
  setGuestData: React.Dispatch<
    React.SetStateAction<{
      guest_full_name: string;
      guest_phone: string;
    }>
  >;
  guestData: any;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
}
const GuestDetailsComp: React.FC<IGuestDetailsCompProps> = ({
  errors,
  setGuestData,
  guestData,
  setErrors,
}) => {
  const { getResponsiveFontSize } = useDimension();
  return (
    <>
      <Text
        style={{
          fontSize: getResponsiveFontSize("lg"),
        }}
        className="text-left font-medium mb-5"
      >
        Provide your details
      </Text>
      <View className={`flex flex-col w-full`}>
        <View className={`min-h-20 w-full gap-4`}>
          <BasicInputField
            required
            inputMode="email"
            placeholder={"Enter your email"}
            type={"email"}
            name={"guest_full_name"}
            label={"Email"}
            isError={!!errors.guest_full_name}
            hintMessage={errors.guest_full_name}
            value={guestData.guest_full_name}
            onChangeText={(e: any) => {
              setErrors((prev: any) => ({
                ...prev,
                guest_full_name: "",
              }));
              setGuestData((prev) => ({
                ...prev,
                guest_full_name: e.target.value,
              }));
            }}
          />

          <BasicInputField
            maxLength={11}
            required
            placeholder={"Enter your phone number"}
            inputMode={"tel"}
            name={"guest_phone"}
            label="Phone"
            isError={!!errors.guest_phone}
            hintMessage={errors.guest_phone}
            value={guestData.guest_phone}
            onChangeText={(e: any) => {
              setErrors((prev: any) => ({
                ...prev,
                guest_phone: "",
              }));
              setGuestData((prev) => ({
                ...prev,
                guest_phone: e.target.value,
              }));
            }}
          />
        </View>
      </View>
    </>
  );
};

export default GuestDetailsComp;
