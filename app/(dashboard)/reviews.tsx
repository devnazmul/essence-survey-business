import { getAllBranches } from "@/api/branch";
import { getSurveys } from "@/api/survey";
import { getAllUsers } from "@/api/users";
import { IMAGES } from "@/assets";
import { FilterBar } from "@/components/FilterBar";
import { FilterChips } from "@/components/FilterChips";
import Header from "@/components/Header";
import ReviewCard from "@/components/ReviewCard";
import ScreenTitle from "@/components/ScreenTitle";
import { UniversalFilterModal } from "@/components/modals/UniversalFilterModal";
import { COLORS } from "@/constants";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useReviews } from "@/hooks/useReviews";
import { useAuthStore } from "@/store/useAuthStore";
import { getFullName } from "@/utils/getFullName";
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

const periodOptions = [
  {
    id: "all_time",
    name: "All Time",
    setToTheFilter: {
      period: "all_time",
    },
  },
  {
    id: "last_7_days",
    name: "Last 7 Days",
    setToTheFilter: {
      period: "last_7_days",
    },
  },
  {
    id: "last_30_days",
    name: "Last 30 Days",
    setToTheFilter: {
      period: "last_30_days",
    },
  },
];

const sortOptions = [
  { id: "desc", name: "Newest First" },
  { id: "asc", name: "Oldest First" },
];

const reviewType = [
  { id: "", name: "All" },
  { id: 1, name: "Overall" },
  { id: 0, name: "Survey" },
];

const reviewCommentType = [
  { id: "", name: "All" },
  { id: 1, name: "Voice" },
  { id: 0, name: "Text" },
];

export default function ReviewsScreen() {
  const { user } = useAuthStore();
  const params = useLocalSearchParams();
  const [search, setSearch] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<any>({});
  const [isFilterVisible, setIsFilterVisible] = React.useState(false);

  const { data: allBranches } = useCustomQuery({
    queryKey: ["allBranches", user?.business?.id],
    queryFunc: async ({ signal }) =>
      await getAllBranches({
        signal,
        sort_by: "name",
      }),
    enabled: !!user?.business?.id,
  });

  const { data: allStaffs } = useCustomQuery({
    queryKey: ["staffs"],
    queryFunc: async ({ signal }) =>
      await getAllUsers({
        sort_order: "asc",
        role: "business_staff",
      }),
  });

  const { data: allSurveys } = useCustomQuery({
    queryKey: ["allSurveys", user?.business?.id],
    queryFunc: async ({ signal }) => await getSurveys(user?.business?.id || ""),
    enabled: !!user?.business?.id,
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
          if (key === "branch_ids") delete newFilters.branch_name;
          if (key === "staff_id") delete newFilters.staff_name;
          if (key === "survey_id") delete newFilters.survey_name;
          setActiveFilters(newFilters);
        }}
        getLabel={(key, value) => {
          if (["branch_ids", "staff_id", "survey_id"].includes(key)) return "";

          if (key === "period") {
            const name =
              periodOptions.find((o) => o.id === value)?.name || value;
            return `Period: ${name}`;
          }
          if (key === "rating") return `Rating: ${value}`;
          if (key === "flagged_reviews")
            return `Threshold: ${value.toString() === "1" ? "Flagged" : "Satisfied"}`;
          if (key === "sort_order") {
            const name = sortOptions.find((o) => o.id === value)?.name || value;
            return `Sort: ${name}`;
          }
          if (key === "is_overall")
            return `Type: ${value.toString() === "1" ? "Overall View" : "Survey View"}`;
          if (key === "is_voice_review")
            return `Comment Type: ${value.toString() === "1" ? "Voice Review" : "Text Review"}`;
          if (key === "branch_name") return `Branch: ${value}`;
          if (key === "staff_name") return `Staff: ${value}`;
          if (key === "survey_name") return `Survey: ${value}`;

          if (key === "is_repeat_issue") return "Repeat Issue";
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
            id: "period",
            label: "Period",
            type: "select",
            colorScheme: "blue",
            options: periodOptions,
          },
          {
            id: "rating",
            label: "Rating",
            type: "rating",
          },
          {
            id: "flagged_reviews",
            label: "Threshold",
            type: "select",
            colorScheme: "red",
            options: [
              { id: 1, name: "Flagged" },
              { id: 0, name: "Satisfied" },
            ],
          },
          {
            id: "sort_order",
            label: "Sort Order",
            type: "select",
            colorScheme: "indigo",
            options: sortOptions,
          },
          {
            id: "is_overall",
            label: "Type",
            type: "select",
            colorScheme: "teal",
            options: reviewType,
          },
          {
            id: "is_voice_review",
            label: "Comment Type",
            type: "select",
            colorScheme: "purple",
            options: reviewCommentType,
          },
          {
            id: "branch_ids",
            label: "Branch",
            type: "searchable-select",
            colorScheme: "blue",
            options: allBranches?.data?.map((d: any) => ({
              id: d?.id,
              name: d?.name,
              setToTheFilter: {
                branch_ids: d?.id,
                branch_name: d?.name,
              },
            })),
          },
          {
            id: "staff_id",
            label: "Staff",
            type: "searchable-select",
            colorScheme: "green",
            options: allStaffs?.map((staff: any) => ({
              id: staff?.id,
              name: getFullName(staff),
              setToTheFilter: {
                staff_id: staff?.id,
                staff_name: getFullName(staff),
              },
            })),
          },
          {
            id: "survey_id",
            label: "Survey",
            type: "searchable-select",
            colorScheme: "yellow",
            options: allSurveys?.map((survey: any) => ({
              id: survey?.id,
              name: survey?.name,
              setToTheFilter: {
                survey_id: survey?.id,
                survey_name: survey?.name,
              },
            })),
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
