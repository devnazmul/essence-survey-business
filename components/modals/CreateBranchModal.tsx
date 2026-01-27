import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import useCreateAndUpdateBranch from "@/services/CreateAndUpdateBranch.service";
import { getFullName } from "@/utils/getFullName";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import AutoComplete from "../CustomAutoComplete";
import { BasicInputField } from "../InputField";

interface CreateBranchModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreateBranchModal: React.FC<CreateBranchModalProps> = ({
  visible,
  onClose,
}) => {
  const { getResponsiveFontSize } = useDimension();
  const {
    formData,
    setFormData,
    errors,
    handleFormChange,
    isLoading,
    isLoadingMap,
    setIsLoadingMap,
    handleCancel,
    setHasChanges,
    handleCheckUserEmail,
    data,
    popupOption,
    updateFunc,
    isCheckingEmail,
    createFunc,
    handleSubmit,
  } = useCreateAndUpdateBranch({ handleClosePopup: onClose });

  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);

  const getComponent = (details: any, type: string) =>
    details?.address_components?.find((c: any) => c.types.includes(type))
      ?.long_name || "";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
          <Text
            className="font-bold text-gray-800"
            style={{ fontSize: getResponsiveFontSize("xl") }}
          >
            {popupOption?.data ? "Update Branch" : "Create Branch"}
          </Text>
          <TouchableOpacity onPress={handleCancel} className="p-1">
            <Feather name="x" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-4 py-4"
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-y-5 pb-20">
            {/* NAME */}
            <BasicInputField
              label="Name"
              required
              name="name"
              value={formData.name}
              placeholder="Enter branch name"
              isError={!!errors.name}
              hintMessage={errors.name}
              onChangeText={(text: string) => handleFormChange("name", text)}
            />

            {/* ADDRESS AUTOCOMPLETE */}
            <View className="z-50">
              <AutoComplete
                label="Address"
                required
                error={errors.address}
                placeholder="Search address"
                value={formData.address}
                onPress={(data, details = null) => {
                  setIsLoadingMap(true);
                  if (details) {
                    const { lat, lng } = details.geometry.location;
                    setFormData((prev) => ({
                      ...prev,
                      address: details.formatted_address,
                      street: getComponent(details, "route"),
                      door_no: getComponent(details, "street_number"),
                      city:
                        getComponent(details, "locality") ||
                        getComponent(details, "administrative_area_level_2"),
                      country: getComponent(details, "country"),
                      postcode: getComponent(details, "postal_code"),
                      lat: lat,
                      long: lng,
                    }));
                    setHasChanges(true);
                    setTimeout(() => setIsLoadingMap(false), 1000);
                  }
                }}
                onChange={(text) => handleFormChange("address", text)}
              />
            </View>

            {/* STREET */}
            <BasicInputField
              label="Street"
              name="street"
              value={formData.street}
              placeholder="Street"
              onChangeText={(text: string) => handleFormChange("street", text)}
            />

            {/* DOOR NO */}
            <BasicInputField
              label="Door No"
              name="door_no"
              value={formData.door_no}
              placeholder="Door No"
              onChangeText={(text: string) => handleFormChange("door_no", text)}
            />

            {/* CITY & COUNTRY */}
            <View className="flex-row gap-x-4">
              <View className="flex-1">
                <BasicInputField
                  label="City"
                  name="city"
                  value={formData.city}
                  placeholder="City"
                  onChangeText={(text: string) =>
                    handleFormChange("city", text)
                  }
                />
              </View>
              <View className="flex-1">
                <BasicInputField
                  label="Country"
                  name="country"
                  value={formData.country}
                  placeholder="Country"
                  onChangeText={(text: string) =>
                    handleFormChange("country", text)
                  }
                />
              </View>
            </View>

            {/* POSTCODE */}
            <BasicInputField
              label="Postcode"
              name="postcode"
              value={formData.postcode}
              placeholder="Postcode"
              onChangeText={(text: string) =>
                handleFormChange("postcode", text)
              }
            />

            {/* PHONE */}
            <BasicInputField
              label="Phone"
              name="phone"
              value={formData.phone}
              placeholder="Phone"
              keyboardType="phone-pad"
              isError={!!errors.phone}
              hintMessage={errors.phone}
              onChangeText={(text: string) => handleFormChange("phone", text)}
            />

            {/* EMAIL */}
            <BasicInputField
              label="Email"
              required
              name="email"
              value={formData.email}
              placeholder="Email"
              keyboardType="email-address"
              isError={!!errors.email}
              hintMessage={errors.email}
              onBlur={() => handleCheckUserEmail(formData.email)}
              onChangeText={(text: string) => handleFormChange("email", text)}
            />

            {/* MANAGER SELECT */}
            <View>
              <Text
                className="font-semibold mb-2"
                style={{ fontSize: getResponsiveFontSize("md") }}
              >
                Select Manager
              </Text>
              <TouchableOpacity
                onPress={() => setIsManagerModalOpen(true)}
                className={`border border-gray-200 px-4 py-3 rounded-lg bg-base-300 flex-row justify-between items-center ${
                  !!errors.manager_id ? "border-red-500" : ""
                }`}
              >
                <Text
                  className={`${
                    formData.manager_id ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {formData.manager_id
                    ? getFullName(
                        data?.find((d: any) => d.id === formData.manager_id),
                      ) || "Select Manager"
                    : "Select Manager"}
                </Text>
                <Feather name="chevron-down" size={20} color="gray" />
              </TouchableOpacity>
              {!!errors.manager_id && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.manager_id}
                </Text>
              )}
            </View>

            {/* BRANCH CODE */}
            <BasicInputField
              label="Branch Code"
              required
              name="branch_code"
              value={formData.branch_code}
              placeholder="Branch Code"
              isError={!!errors.branch_code}
              hintMessage={errors.branch_code}
              onChangeText={(text: string) =>
                handleFormChange("branch_code", text)
              }
            />

            {/* GEO ENABLED */}
            <View className="flex-row items-center justify-between py-2">
              <Text
                className="font-semibold"
                style={{ fontSize: getResponsiveFontSize("md") }}
              >
                Enable Geo Location
              </Text>
              <Switch
                value={formData.is_geo_enabled === 1}
                onValueChange={(val) =>
                  handleFormChange("is_geo_enabled", val ? 1 : 0)
                }
                trackColor={{ false: "#767577", true: COLORS.primary }}
                thumbColor={"#f4f3f4"}
              />
            </View>

            {/* MAP */}
            {formData.lat && formData.long && formData.is_geo_enabled === 1 && (
              <View className="h-48 rounded-lg overflow-hidden border border-gray-200 mt-2">
                {isLoadingMap ? (
                  <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={COLORS.primary} />
                  </View>
                ) : (
                  <MapView
                    style={{ flex: 1 }}
                    region={{
                      latitude: Number(formData.lat),
                      longitude: Number(formData.long),
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: Number(formData.lat),
                        longitude: Number(formData.long),
                      }}
                      title={formData.name}
                    />
                  </MapView>
                )}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View className="p-4 border-t border-gray-100 flex-row gap-4 bg-white">
          <TouchableOpacity
            onPress={handleCancel}
            className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
          >
            <Text className="text-gray-700 font-bold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={
              createFunc.isPending || updateFunc.isPending || isCheckingEmail
            }
            className={`flex-1 py-3 rounded-xl items-center ${
              createFunc.isPending || updateFunc.isPending || isCheckingEmail
                ? "bg-gray-300"
                : "bg-primary"
            }`}
          >
            {createFunc.isPending || updateFunc.isPending || isCheckingEmail ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold">
                {popupOption?.data ? "Update" : "Create"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Manager Selection Modal */}
        <Modal
          visible={isManagerModalOpen}
          animationType="slide"
          onRequestClose={() => setIsManagerModalOpen(false)}
        >
          <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
              <Text className="font-bold text-lg">Select Manager</Text>
              <TouchableOpacity
                onPress={() => setIsManagerModalOpen(false)}
                className="p-1"
              >
                <Feather name="x" size={24} color="gray" />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            ) : (
              <FlatList
                data={data || []}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      handleFormChange("manager_id", item.id);
                      setIsManagerModalOpen(false);
                    }}
                    className="p-4 border-b border-gray-50 flex-row justify-between items-center"
                  >
                    <Text className="text-gray-800 text-base">
                      {getFullName(item)}
                    </Text>
                    {formData.manager_id === item.id && (
                      <Feather name="check" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View className="p-10 items-center">
                    <Text className="text-gray-400">No managers found</Text>
                  </View>
                }
              />
            )}
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

export default CreateBranchModal;
