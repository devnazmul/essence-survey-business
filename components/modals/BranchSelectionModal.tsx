import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Branch {
  id: number | string | null;
  name: string;
}

interface BranchSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  branches: any[];
  currentBranchId?: number | string | null;
  onSelect: (branchId: number | string | null) => void;
  isLoading?: boolean;
  isUpdating?: boolean;
}

const BranchSelectionModal: React.FC<BranchSelectionModalProps> = ({
  visible,
  onClose,
  branches,
  currentBranchId,
  onSelect,
  isLoading,
  isUpdating,
}) => {
  const { getResponsiveFontSize } = useDimension();

  const allBranchesList = [{ id: null, name: "All Branch" }, ...branches];

  const renderBranchItem = ({ item }: { item: Branch }) => {
    const isSelected = item.id === currentBranchId;

    return (
      <TouchableOpacity
        className={`flex-row items-center justify-between p-4 rounded-xl mb-3 border ${
          isSelected ? "bg-green-50 border-primary" : "bg-white border-gray-100"
        }`}
        onPress={() => onSelect(item.id)}
        disabled={isUpdating}
      >
        <View className="flex-row items-center flex-1">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
              isSelected ? "bg-primary" : "bg-gray-100"
            }`}
          >
            <Feather
              name={item.id === null ? "layers" : "map-pin"}
              size={18}
              color={isSelected ? "white" : "#6b7280"}
            />
          </View>
          <Text
            className={`font-semibold flex-1 ${
              isSelected ? "text-primary" : "text-gray-800"
            }`}
            style={{ fontSize: getResponsiveFontSize("md") }}
          >
            {item.name}
          </Text>
        </View>

        {isSelected ? (
          <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
        ) : (
          <Ionicons name="ellipse-outline" size={24} color="#d1d5db" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <SafeAreaView className="bg-white rounded-t-[32px] max-h-[80%]">
          <View className="p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text
                className="font-bold text-gray-900"
                style={{ fontSize: getResponsiveFontSize("xl") }}
              >
                Switch Branch
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="bg-gray-100 p-2 rounded-full"
              >
                <Ionicons name="close" size={20} color="#4b5563" />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View className="py-20 justify-center items-center">
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text className="text-gray-500 mt-4">Loading branches...</Text>
              </View>
            ) : isUpdating ? (
              <View className="py-20 justify-center items-center">
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text className="text-gray-500 mt-4">Switching branch...</Text>
              </View>
            ) : (
              <FlatList
                data={allBranchesList}
                renderItem={renderBranchItem}
                keyExtractor={(item) =>
                  item.id === null ? "all" : item.id.toString()
                }
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default BranchSelectionModal;
