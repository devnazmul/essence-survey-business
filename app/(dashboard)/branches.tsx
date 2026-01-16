import { IMAGES } from "@/assets";
import BottomNav from "@/components/BottomNav";
import BranchCard from "@/components/BranchCard";
import Header from "@/components/Header";
import ScreenTitle from "@/components/ScreenTitle";
import StatCard from "@/components/StatCard";
import { COLORS } from "@/constants";
import useAllBranchesService from "@/services/AllBranches.service";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BranchesScreen() {
  const {
    data,
    isLoading,
    handleAddStuff,
    handleEdit,
    handleDelete,
    handleView,
    setFilters,
    filters,
    onRefresh,
    isFetching,
  } = useAllBranchesService();

  const branches = data?.data || [];
  const summary = data?.summary || {};

  const handleSearch = (text: string) => {
    setFilters((prev: any) => ({ ...prev, search_key: text }));
  };

  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
      <Header
        centerComponent={<Image source={IMAGES.logo} className="w-16 h-16" />}
      />

      <View className="flex-row justify-between items-center mb-4">
        <ScreenTitle title="All Branches" />
        <TouchableOpacity
          onPress={handleAddStuff}
          className="bg-primary px-4 py-2 rounded-xl flex-row items-center"
        >
          <Feather name="plus" size={20} color="white" />
          <Text className="text-white font-bold ml-2">Add Branch</Text>
        </TouchableOpacity>
      </View>

      {/* Analytics Summary */}
      <View className="flex-row flex-wrap justify-between mb-4">
        <StatCard
          title="Total Branches"
          value={summary.total_branches || 0}
          color="#E7F8ED"
          iconName="account-tree"
          iconColor="#2DCE24"
          Icon={MaterialIcons}
          iconSize={20}
          iconPosition="left"
          bottomRightSection={summary.total_branches || 0}
        />
        <StatCard
          title="Avg Rating"
          value={`${summary.avg_rating || 0}/5`}
          color="#FFFBEB"
          iconName="star"
          iconColor="#FACC15"
          Icon={MaterialIcons}
          iconSize={20}
          iconPosition="left"
          bottomRightSection={summary.total_reviews || 0}
        />
        <StatCard
          title="Sentiment"
          value={summary.overall_sentiment || "Neutral"}
          color="#F5F3FF"
          iconName="brain"
          iconColor="#A855F7"
          Icon={MaterialCommunityIcons}
          iconSize={20}
          iconPosition="left"
          fullWidth
          bottomRightSection={summary.total_reviews || 0}
        />
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center mb-6">
        <View className="flex-1 flex-row items-center bg-base-300 border border-gray-200 rounded-2xl px-4 h-14">
          <Feather name="search" size={20} color="#9ca3af" />
          <TextInput
            placeholder="Search branches..."
            className="flex-1 ml-3 text-slate-700 font-medium"
            placeholderTextColor="#9ca3af"
            value={filters.search_key}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Branches List */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlashList
          data={branches}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <BranchCard
              branch={{
                ...item,
                geo_enabled:
                  item.geo_enabled === 1 || item.geo_enabled === true,
              }}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pt-10">
              <Text className="text-slate-400 font-medium">
                No branches found
              </Text>
            </View>
          }
        />
      )}

      <BottomNav activeTab="branches" />
    </SafeAreaView>
  );
}
