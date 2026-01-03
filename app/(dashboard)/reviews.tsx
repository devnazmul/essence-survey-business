import IMAGES from "@/assets";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import ReviewCard from "@/components/ReviewCard";
import ScreenTitle from "@/components/ScreenTitle";
import { COLORS } from "@/constants";
import { useReviews } from "@/hooks/useReviews";
import { useAuthStore } from "@/store/useAuthStore";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReviewsScreen() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<any>({});
  const [isFilterVisible, setIsFilterVisible] = React.useState(false);
  const [tempFilters, setTempFilters] = React.useState<any>({
    status: "",
    sort_by: "",
    start_date: "",
    end_date: "",
  });

  const {
    reviews,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefreshing,
  } = useReviews(20, { search, ...activeFilters });

  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.replace("/signin");
  };

  const applyFilters = () => {
    setActiveFilters(tempFilters);
    setIsFilterVisible(false);
  };

  const resetFilters = () => {
    setTempFilters({
      status: "",
      sort_by: "",
      start_date: "",
      end_date: "",
    });
    setActiveFilters({});
    setIsFilterVisible(false);
  };

  // Debounce search
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Search is directly passed to hook, assume hook handles or we trigger here
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return <View className="h-20" />;
    return (
      <View className="py-4 items-center justify-center mb-20">
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-base-100 px-4 pt-2">
      {/* Header */}
      <Header
        centerComponent={<Image source={IMAGES.logo} className={`w-16 h-16`} />}
      />

      <ScreenTitle title="All Reviews" />

      {/* Search and Filter Bar */}
      <View className="flex-row items-center mb-4 space-x-2">
        <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-3 h-12">
          <Feather name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search by customer name or keyword"
            className="flex-1 ml-2 text-base text-gray-700 placeholder:text-gray-400"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            setTempFilters({ ...activeFilters }); // Sync temp with active
            setIsFilterVisible(true);
          }}
          className="w-12 h-12 ml-2 bg-primary rounded-xl justify-center items-center"
        >
          <Feather name="filter" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Active Filter Chips */}
      {(activeFilters.status ||
        activeFilters.sort_by ||
        activeFilters.start_date) && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4 flex-row max-h-10"
        >
          {activeFilters.status && (
            <TouchableOpacity
              onPress={() => setActiveFilters({ ...activeFilters, status: "" })}
              className="rounded-full flex-row items-center space-x-1 bg-base-300 pl-5 pr-3 mr-2 border border-primary"
            >
              <Text className="text-primary font-medium mr-1">
                Status: {activeFilters.status}
              </Text>
              <Feather name="x" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          {activeFilters.sort_by && (
            <TouchableOpacity
              onPress={() =>
                setActiveFilters({ ...activeFilters, sort_by: "" })
              }
              className="rounded-full flex-row items-center space-x-1 bg-base-300 pl-5 pr-3 mr-2 border border-primary"
            >
              <Text className="text-primary font-medium mr-1">
                Sort: {activeFilters.sort_by}
              </Text>
              <Feather name="x" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          {/* Add more chips as needed */}
        </ScrollView>
      )}

      {isLoading && !isRefreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ReviewCard review={item} />}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pt-10">
              <Text className="text-gray-400">No Reviews Found</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refetch}
              tintColor={COLORS.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          className="flex-1"
        />
      )}

      {/* Filter Modal */}
      <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-[80%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">Filters</Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                <Feather name="x" size={24} color="gray" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Status Filter */}
              <Text className="font-semibold text-gray-700 mb-3">Status</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {["pending", "published", "archived"].map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() =>
                      setTempFilters({
                        ...tempFilters,
                        status: tempFilters.status === status ? "" : status,
                      })
                    }
                    className={`px-4 py-2 rounded-full border ${tempFilters.status === status ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200"}`}
                  >
                    <Text
                      className={`${tempFilters.status === status ? "text-blue-600 font-bold" : "text-gray-600"}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Sort By */}
              <Text className="font-semibold text-gray-700 mb-3">Sort By</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {[
                  { label: "Newest", value: "newest" },
                  { label: "Oldest", value: "oldest" },
                  { label: "Highest Rating", value: "highest_rating" },
                  { label: "Lowest Rating", value: "lowest_rating" },
                ].map((sort) => (
                  <TouchableOpacity
                    key={sort.value}
                    onPress={() =>
                      setTempFilters({
                        ...tempFilters,
                        sort_by:
                          tempFilters.sort_by === sort.value ? "" : sort.value,
                      })
                    }
                    className={`px-4 py-2 rounded-full border ${tempFilters.sort_by === sort.value ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200"}`}
                  >
                    <Text
                      className={`${tempFilters.sort_by === sort.value ? "text-blue-600 font-bold" : "text-gray-600"}`}
                    >
                      {sort.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Date Range (Simplified as Input for now, recommend DateTimePicker later) */}
              {/* Placeholder for Date Range */}
            </ScrollView>

            <View className="flex-row gap-4 mt-4 pt-4 border-t border-gray-100">
              <TouchableOpacity
                onPress={resetFilters}
                className="flex-1 py-3 items-center rounded-xl bg-gray-100"
              >
                <Text className="text-gray-700 font-bold">Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyFilters}
                className="flex-1 py-3 items-center rounded-xl bg-primary"
              >
                <Text className="text-white font-bold">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNav activeTab="reviews" />
    </SafeAreaView>
  );
}
