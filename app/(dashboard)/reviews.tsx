import { IMAGES } from "@/assets";
import { FilterBar } from "@/components/FilterBar";
import { FilterChips } from "@/components/FilterChips";
import Header from "@/components/Header";
import { UniversalFilterModal } from "@/components/modals/UniversalFilterModal";
import ReviewCard from "@/components/ReviewCard";
import ScreenTitle from "@/components/ScreenTitle";
import { COLORS } from "@/constants";
import { useReviews } from "@/hooks/useReviews";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReviewsScreen() {
  const params = useLocalSearchParams();
  const [search, setSearch] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<any>({});
  const [isFilterVisible, setIsFilterVisible] = React.useState(false);

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
  }, [paramsString, params]);

  const {
    reviews,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefreshing,
  } = useReviews(20, { search, ...activeFilters });

  const resetFilters = () => {
    setActiveFilters({});
    setIsFilterVisible(false);
  };

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
      <Header
        centerComponent={<Image source={IMAGES.logo} className={`w-16 h-16`} />}
      />

      <ScreenTitle title="All Reviews" />

      {/* Search and Filter Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        onFilterPress={() => setIsFilterVisible(true)}
        placeholder="Search reviews..."
      />

      {/* Active Filter Chips */}
      <FilterChips
        activeFilters={activeFilters}
        onRemove={(key) => {
          const newFilters = { ...activeFilters };
          delete newFilters[key];
          setActiveFilters(newFilters);
        }}
        getLabel={(key, value) => {
          if (key === "meets_threshold")
            return value.toString() === "1" ? "Satisfied" : "Flagged";
          if (key === "sentiment_score")
            return `Sentiment: ${value.toString().replace("_", " ")}`;
          if (key === "topics") return `Topic: ${value}`;
          if (key === "is_repeat_issue") return "Repeat Issue";
          if (key === "is_overall")
            return value.toString() === "1" ? "Overall View" : "Survey View";
          if (key === "status") return `Status: ${value}`;
          if (key === "sort_order")
            return `Sort: ${value.toString().replace("_", " ")}`;
          if (key === "has_staff")
            return value.toString() === "1" ? "Staff Related" : "No Staff";
          if (key === "rating") return `${value} Stars`;
          if (key === "start_date") return `Start: ${value}`;
          if (key === "end_date") return `To: ${value}`;
          return "";
        }}
      />

      {isLoading && !isRefreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlashList
          data={reviews}
          keyExtractor={(item: any) => item.id.toString()}
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
      <UniversalFilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        initialFilters={activeFilters}
        onApply={(newFilters) => {
          setActiveFilters(newFilters);
        }}
        onReset={resetFilters}
        configs={[
          {
            id: "status",
            label: "Status",
            type: "select",
            colorScheme: "blue",
            options: [
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
            ],
          },
          {
            id: "rating",
            label: "Rating",
            type: "rating",
          },
          {
            id: "sentiment_score",
            label: "Sentiment",
            type: "select",
            colorScheme: "purple",
            options: [
              { label: "Positive", value: "positive" },
              { label: "Neutral", value: "neutral" },
              { label: "Negative", value: "negative" },
            ],
          },
          {
            id: "meets_threshold",
            label: "Satisfaction",
            type: "select",
            colorScheme: "green",
            options: [
              { label: "Satisfied", value: "1" },
              { label: "Flagged", value: "0" },
            ],
          },
          {
            id: "has_staff",
            label: "Staff Related",
            type: "select",
            colorScheme: "indigo",
            options: [
              { label: "Staff Related", value: "1" },
              { label: "No Staff", value: "0" },
            ],
          },
          {
            id: "is_overall",
            label: "View Type",
            type: "select",
            colorScheme: "teal",
            options: [
              { label: "Overall", value: "1" },
              { label: "Survey", value: "0" },
            ],
          },
          {
            id: "topics",
            label: "Topic Search",
            type: "text",
            placeholder: "Search by topic...",
          },
          {
            id: "sort_order",
            label: "Sort Order",
            type: "select",
            colorScheme: "blue",
            options: [
              { label: "Newest First", value: "desc" },
              { label: "Oldest First", value: "asc" },
            ],
          },
          {
            id: "date_range",
            label: "Date Range",
            type: "date",
          },
        ]}
      />
    </SafeAreaView>
  );
}
