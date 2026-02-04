import { IMAGES } from "@/assets";

import BranchCard from "@/components/BranchCard";
import { FilterBar } from "@/components/FilterBar";
import { FilterChips } from "@/components/FilterChips";
import Header from "@/components/Header";
import { UniversalFilterModal } from "@/components/modals/UniversalFilterModal";
import ScreenTitle from "@/components/ScreenTitle";
import StatCard from "@/components/StatCard";
import { COLORS } from "@/constants";
import useAllBranchesService from "@/services/AllBranches.service";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  Text,
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

  const [isFilterVisible, setIsFilterVisible] = useState(false);

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
        {/* <TouchableOpacity
          onPress={handleAddStuff}
          className="bg-primary px-4 py-2 rounded-xl flex-row items-center"
        >
          <Feather name="plus" size={20} color="white" />
          <Text className="text-white font-bold ml-2">Add Branch</Text>
        </TouchableOpacity> */}
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
          value={`${summary.avg_rating || 0} out of 5`}
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

      {/* Search and Filter Bar */}
      <FilterBar
        search={filters.search_key}
        onSearchChange={handleSearch}
        onFilterPress={() => setIsFilterVisible(true)}
        placeholder="Search branches..."
      />

      {/* Active Filter Chips */}
      <FilterChips
        activeFilters={filters}
        onRemove={(key: string) => {
          const newFilters: any = { ...filters };
          if (key === "search_key") newFilters[key] = "";
          else if (key === "is_active") newFilters[key] = "";
          else if (key === "sort_order") newFilters[key] = "desc";
          else delete newFilters[key];
          setFilters(newFilters);
        }}
        getLabel={(key: string, value: any) => {
          if (key === "search_key" && value) return `Search: ${value}`;
          if (key === "is_active") {
            if (value === 1 || value === "1") return "Status: Active";
            if (value === 0 || value === "0") return "Status: Inactive";
            return "";
          }
          if (key === "sort_order")
            return value === "asc" ? "Order: Ascending" : "Order: Descending";
          return "";
        }}
      />

      {/* Filter Modal */}
      <UniversalFilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        initialFilters={filters}
        onApply={(newFilters) => {
          setFilters({ ...filters, ...newFilters });
        }}
        onReset={() => {
          setFilters({
            page: 1,
            per_page: 10,
            is_active: "",
            sort_order: "desc",
            sort_by: "created_at",
            search_key: "",
          });
        }}
        configs={[
          {
            id: "is_active",
            label: "Status",
            type: "select",
            colorScheme: "primary",
            options: [
              { label: "Active", value: 1 },
              { label: "Inactive", value: 0 },
            ],
          },
          {
            id: "sort_order",
            label: "Sort Order",
            type: "select",
            colorScheme: "primary",
            options: [
              { label: "Ascending", value: "asc" },
              { label: "Descending", value: "desc" },
            ],
          },
        ]}
      />

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
    </SafeAreaView>
  );
}
