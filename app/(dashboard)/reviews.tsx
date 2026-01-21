import IMAGES from "@/assets";

import Header from "@/components/Header";
import ReviewCard from "@/components/ReviewCard";
import ScreenTitle from "@/components/ScreenTitle";
import { COLORS } from "@/constants";
import { useReviews } from "@/hooks/useReviews";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
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
  const params = useLocalSearchParams();
  const [search, setSearch] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<any>({});
  const [isFilterVisible, setIsFilterVisible] = React.useState(false);
  const [tempFilters, setTempFilters] = React.useState<any>({
    status: "",
    rating: "",
    sort_order: "desc",
    start_date: "",
    end_date: "",
    meets_threshold: "",
    topics: "",
    sentiment_score: "",
    has_staff: "",
    is_overall: "",
  });

  const paramsString = JSON.stringify(params);
  const lastParamsRef = React.useRef("");

  React.useEffect(() => {
    if (
      Object.keys(params).length > 0 &&
      paramsString !== lastParamsRef.current
    ) {
      setActiveFilters({ ...params });
      lastParamsRef.current = paramsString;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsString]);

  const {
    reviews,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefreshing,
  } = useReviews(20, { search, ...activeFilters });

  useEffect(() => {
    console.log({ reviews });
  }, [reviews]);

  const applyFilters = () => {
    setActiveFilters(tempFilters);
    setIsFilterVisible(false);
  };

  const resetFilters = () => {
    setTempFilters({
      status: "",
      rating: "",
      sort_order: "desc",
      start_date: "",
      end_date: "",
      meets_threshold: "",
      topics: "",
      sentiment_score: "",
      has_staff: "",
      is_overall: "",
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
        <View className="flex-1 flex-row items-center bg-base-300 border border-gray-200 rounded-xl px-3 h-12">
          <Feather name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search by customer name or keyword"
            className="flex-1 ml-2 text-gray-700 placeholder:text-gray-400"
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

      {Object.keys(activeFilters).some(
        (key) => activeFilters[key] !== "" && activeFilters[key] !== undefined,
      ) && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4 flex-row max-h-12"
          contentContainerStyle={{ alignItems: "center" }}
        >
          {Object.keys(activeFilters).map((key) => {
            const value = activeFilters[key];
            if (value === "" || value === undefined) return null;

            // Map keys to human readable labels
            let label = key;
            if (key === "meets_threshold")
              label = value.toString() === "1" ? "Satisfied" : "Flagged";
            if (key === "sentiment_score")
              label = `Sentiment: ${value.toString().replace("_", " ")}`;
            if (key === "topics") label = `Topic: ${value}`;
            if (key === "is_repeat_issue") label = "Repeat Issue";
            if (key === "is_overall")
              label = value.toString() === "1" ? "Overall View" : "Survey View";
            if (key === "status") label = `Status: ${value}`;
            if (key === "sort_order")
              label = `Sort: ${value.toString().replace("_", " ")}`;
            if (key === "has_staff")
              label = value.toString() === "1" ? "Staff Related" : "No Staff";
            if (key === "rating") label = `${value} Stars`;
            if (key === "start_date") label = `Start: ${value}`;
            if (key === "end_date") label = `End: ${value}`;
            if (key === "period")
              label = value
                .toString()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l: string) => l.toUpperCase());

            return (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  const newFilters = { ...activeFilters };
                  delete newFilters[key];
                  setActiveFilters(newFilters);
                }}
                className="rounded-full flex-row items-center bg-base-300 px-4 py-2 mr-2 border border-primary h-9"
              >
                <Text className="text-primary font-medium mr-1 text-xs">
                  {label}
                </Text>
                <Feather name="x" size={12} color={COLORS.primary} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {isLoading && !isRefreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlashList
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
          style={{ flex: 1 }}
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
          <View className="bg-base-300 rounded-t-3xl p-6 h-[80%]">
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
                {["pending", "approved", "rejected"].map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() =>
                      setTempFilters({
                        ...tempFilters,
                        status: tempFilters.status === status ? "" : status,
                      })
                    }
                    className={`px-4 py-2 rounded-full border ${
                      tempFilters.status === status
                        ? "bg-blue-50 border-blue-500"
                        : "bg-base-300 border-gray-200"
                    }`}
                  >
                    <Text
                      className={`${
                        tempFilters.status === status
                          ? "text-blue-600 font-bold"
                          : "text-gray-600"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Rating Filter */}
              <Text className="font-semibold text-gray-700 mb-3">Rating</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    onPress={() =>
                      setTempFilters({
                        ...tempFilters,
                        rating: tempFilters.rating === rating ? "" : rating,
                      })
                    }
                    className={`px-4 py-2 rounded-full border flex-row items-center ${
                      tempFilters.rating === rating
                        ? "bg-yellow-50 border-yellow-500"
                        : "bg-base-300 border-gray-200"
                    }`}
                  >
                    <Text
                      className={`mr-1 ${
                        tempFilters.rating === rating
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
                        tempFilters.rating === rating ? "#d97706" : "#9ca3af"
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Sentiment Filter */}
              <Text className="font-semibold text-gray-700 mb-3">
                Sentiment
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {["positive", "neutral", "negative"].map((sentiment) => (
                  <TouchableOpacity
                    key={sentiment}
                    onPress={() =>
                      setTempFilters({
                        ...tempFilters,
                        sentiment_score:
                          tempFilters.sentiment_score === sentiment
                            ? ""
                            : sentiment,
                      })
                    }
                    className={`px-4 py-2 rounded-full border ${
                      tempFilters.sentiment_score === sentiment
                        ? "bg-purple-50 border-purple-500"
                        : "bg-base-300 border-gray-200"
                    }`}
                  >
                    <Text
                      className={`${
                        tempFilters.sentiment_score === sentiment
                          ? "text-purple-600 font-bold"
                          : "text-gray-600"
                      }`}
                    >
                      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Threshold & Staff & Type */}
              <Text className="font-semibold text-gray-700 mb-3">Other</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {/* Threshold */}
                <TouchableOpacity
                  onPress={() =>
                    setTempFilters({
                      ...tempFilters,
                      meets_threshold:
                        tempFilters.meets_threshold === "1" ? "" : "1",
                    })
                  }
                  className={`px-4 py-2 rounded-full border ${
                    tempFilters.meets_threshold === "1"
                      ? "bg-green-50 border-green-500"
                      : "bg-base-300 border-gray-200"
                  }`}
                >
                  <Text
                    className={`${
                      tempFilters.meets_threshold === "1"
                        ? "text-green-600 font-bold"
                        : "text-gray-600"
                    }`}
                  >
                    Satisfied
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    setTempFilters({
                      ...tempFilters,
                      meets_threshold:
                        tempFilters.meets_threshold === "0" ? "" : "0",
                    })
                  }
                  className={`px-4 py-2 rounded-full border ${
                    tempFilters.meets_threshold === "0"
                      ? "bg-red-50 border-red-500"
                      : "bg-base-300 border-gray-200"
                  }`}
                >
                  <Text
                    className={`${
                      tempFilters.meets_threshold === "0"
                        ? "text-red-600 font-bold"
                        : "text-gray-600"
                    }`}
                  >
                    Flagged
                  </Text>
                </TouchableOpacity>

                {/* Staff */}
                <TouchableOpacity
                  onPress={() =>
                    setTempFilters({
                      ...tempFilters,
                      has_staff: tempFilters.has_staff === "1" ? "" : "1",
                    })
                  }
                  className={`px-4 py-2 rounded-full border ${
                    tempFilters.has_staff === "1"
                      ? "bg-indigo-50 border-indigo-500"
                      : "bg-base-300 border-gray-200"
                  }`}
                >
                  <Text
                    className={`${
                      tempFilters.has_staff === "1"
                        ? "text-indigo-600 font-bold"
                        : "text-gray-600"
                    }`}
                  >
                    Staff Related
                  </Text>
                </TouchableOpacity>

                {/* Overall */}
                <TouchableOpacity
                  onPress={() =>
                    setTempFilters({
                      ...tempFilters,
                      is_overall: tempFilters.is_overall === "1" ? "0" : "1",
                    })
                  }
                  className={`px-4 py-2 rounded-full border ${
                    tempFilters.is_overall !== ""
                      ? "bg-teal-50 border-teal-500"
                      : "bg-base-300 border-gray-200"
                  }`}
                >
                  <Text
                    className={`${
                      tempFilters.is_overall !== ""
                        ? "text-teal-600 font-bold"
                        : "text-gray-600"
                    }`}
                  >
                    {tempFilters.is_overall === "1" ? "Overall" : "Survey"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Topic Search */}
              <Text className="font-semibold text-gray-700 mb-3">Topic</Text>
              <View className="mb-6">
                <View className="flex-row items-center bg-base-200 border border-gray-200 rounded-xl px-3 h-12">
                  <Feather name="hash" size={20} color="gray" />
                  <TextInput
                    placeholder="Search by topic..."
                    className="flex-1 ml-2 text-base text-gray-700 placeholder:text-gray-400"
                    value={tempFilters.topics}
                    onChangeText={(text) =>
                      setTempFilters({ ...tempFilters, topics: text })
                    }
                  />
                </View>
              </View>

              {/* Sort By */}
              <Text className="font-semibold text-gray-700 mb-3">Sort By</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {[
                  { label: "Newest First", value: "desc" },
                  { label: "Oldest First", value: "asc" },
                ].map((sort) => (
                  <TouchableOpacity
                    key={sort.value}
                    onPress={() =>
                      setTempFilters({
                        ...tempFilters,
                        sort_order:
                          tempFilters.sort_order === sort.value
                            ? ""
                            : sort.value,
                      })
                    }
                    className={`px-4 py-2 rounded-full border ${
                      tempFilters.sort_order === sort.value
                        ? "bg-blue-50 border-blue-500"
                        : "bg-base-300 border-gray-200"
                    }`}
                  >
                    <Text
                      className={`${
                        tempFilters.sort_order === sort.value
                          ? "text-blue-600 font-bold"
                          : "text-gray-600"
                      }`}
                    >
                      {sort.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Date Range */}
              <Text className="font-semibold text-gray-700 mb-3">
                DATE RANGE
              </Text>
              <View className="flex-row gap-4 mb-10">
                <View className="flex-1">
                  <Text className="text-gray-500 mb-1 text-xs">Start Date</Text>
                  <View className="flex-row items-center bg-base-200 border border-gray-200 rounded-xl px-3 h-12">
                    <TextInput
                      placeholder="YYYY-MM-DD"
                      className="flex-1 text-base text-gray-700 placeholder:text-gray-400"
                      value={tempFilters.start_date}
                      onChangeText={(text) =>
                        setTempFilters({ ...tempFilters, start_date: text })
                      }
                    />
                  </View>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 mb-1 text-xs">End Date</Text>
                  <View className="flex-row items-center bg-base-200 border border-gray-200 rounded-xl px-3 h-12">
                    <TextInput
                      placeholder="YYYY-MM-DD"
                      className="flex-1 text-base text-gray-700 placeholder:text-gray-400"
                      value={tempFilters.end_date}
                      onChangeText={(text) =>
                        setTempFilters({ ...tempFilters, end_date: text })
                      }
                    />
                  </View>
                </View>
              </View>
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
    </SafeAreaView>
  );
}
