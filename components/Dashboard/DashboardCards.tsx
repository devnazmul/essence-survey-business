import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { useBusinessStore } from "@/store/useBusinessStore";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  Octicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import ReviewTrendChart from "../ReviewTrendChart";
import StatCard from "../StatCard";

interface IDashboardCardsProps {
  activeTab: string;
  activeTypeTab: string;
  isLoading: boolean;
}

const COLOR_MAP: Record<string, { bg: string; icon: string }> = {
  blue: { bg: "#cde8fb", icon: COLORS["blue-500"] },
  yellow: { bg: "#fbf5dd", icon: COLORS["orange-500"] },
  cyan: { bg: "#ccfbf1", icon: COLORS["cyan-500"] },
  green: { bg: "#e0fee9", icon: COLORS["green-500"] },
  purple: { bg: "#F2E7F8", icon: COLORS["purple-500"] },
  indigo: { bg: "#e0e7ff", icon: COLORS["blue-600"] },
  teal: { bg: "#ccfbf1", icon: COLORS["cyan-600"] },
  brown: { bg: "#f5ebe0", icon: COLORS["orange-700"] },
  red: { bg: "#fee2e2", icon: COLORS["red-600"] },
  orange: { bg: "#ffedd5", icon: COLORS["orange-500"] },
  gold: { bg: "#fef9c3", icon: COLORS["orange-600"] },
};

const EmojiIcon = ({
  name,
  size,
  className,
  color,
}: {
  name: string;
  size: number;
  className?: string;
  color?: string;
}) => {
  switch (name) {
    case "📝":
      return null;
    case "📈":
      return null;
    case "⭐":
      return (
        <AntDesign
          name="star"
          size={size}
          className={className}
          color={color}
        />
      );
    case "😊":
      return (
        <FontAwesome5
          name="brain"
          size={size}
          className={className}
          color={color}
        />
      );
    case "🔥":
      return (
        <SimpleLineIcons
          name="graph"
          size={size}
          className={className}
          color={color}
        />
      );
    case "🔄":
      return (
        <Feather
          name="refresh-ccw"
          size={size}
          className={className}
          color={color}
        />
      );
    case "🏷️":
      return (
        <FontAwesome
          name="folder-open-o"
          size={size}
          className={className}
          color={color}
        />
      );
    case "🏢":
      return (
        <Octicons
          name="stack"
          size={size}
          className={className}
          color={color}
        />
      );
    case "🗺️":
      return (
        <Octicons
          name="location"
          size={size}
          className={className}
          color={color}
        />
      );
    case "👥":
      return (
        <Feather name="users" size={size} className={className} color={color} />
      );
    case "📉":
      return (
        <Ionicons
          name="warning-outline"
          size={size}
          className={className}
          color={color}
        />
      );
    case "🚩":
      return (
        <Feather name="flag" size={size} className={className} color={color} />
      );
    case "🏆":
      return (
        <Octicons
          name="trophy"
          size={size}
          className={className}
          color={color}
        />
      );
    case "🚀":
      return (
        <Feather
          name="trending-up"
          size={size}
          className={className}
          color={color}
        />
      );

    default:
      return null;
  }
};

const DashboardCards: React.FC<IDashboardCardsProps> = ({
  activeTab,
  activeTypeTab,
  isLoading,
}) => {
  const stats = useBusinessStore((state) => state.stats);

  const { getResponsiveFontSize } = useDimension();

  const parseChange = (val: any): number | undefined => {
    if (val === null || val === undefined) return undefined;
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const parsed = parseFloat(val.replace(/[^0-9.-]/g, ""));
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  };

  const getColors = (colorStr: string) =>
    COLOR_MAP[colorStr?.toLowerCase()] || { bg: "#f3f4f6", icon: "#6b7280" };

  const handleCardClick = (box: any) => {
    if (!box.key) return; // For skeleton state

    const params: any = {
      period: activeTab,
      ...(activeTypeTab !== "all_type" && {
        is_overall: activeTab === "all_time" ? 1 : 0,
      }),
    };

    if (box.is_default_rule && box.rule_id) {
      params.rule_id = box.rule_id;
    } else {
      switch (box.key) {
        case "CSAT_SCORE":
        case "FLAG_AND_ALERT":
          params.meets_threshold = box.key === "CSAT_SCORE" ? 1 : 0;
          break;
        case "STAFF_MENTION_DETECTION":
        case "TOP_PERFORMER":
          params.has_staff = 1;
          break;
        case "REPEAT_ISSUE":
          params.is_repeat_issue = 1;
          break;
      }
    }
    router.push({
      pathname: "/reviews",
      params,
    });
  };

  const displayBoxes =
    stats.boxes && stats.boxes.length > 0
      ? stats.boxes
      : isLoading
        ? Array(8).fill({})
        : [];
  const getPosition = (key: string) => {
    if (key === "AVG_RATING") {
      return "right";
    } else {
      return "left";
    }
  };
  return (
    <View className="flex-row flex-wrap justify-between gap-x-1">
      {displayBoxes.map((box, index) => {
        const colors = getColors(box.color);

        let breakdown: any = undefined;
        if (box.key === "TOTAL_REVIEWS") {
          breakdown = [
            (stats.ratingBreakdown?.breakdown?.exact_ratings?.[5] ?? 0) > 0 && {
              emoji: "😊",
              count: stats.ratingBreakdown?.breakdown?.exact_ratings?.[5] || 0,
            },
            (stats.ratingBreakdown?.breakdown?.exact_ratings?.[4] ?? 0) > 0 && {
              emoji: "🙂",
              count: stats.ratingBreakdown?.breakdown?.exact_ratings?.[4] || 0,
            },
            (stats.ratingBreakdown?.breakdown?.exact_ratings?.[3] ?? 0) > 0 && {
              emoji: "😐",
              count: stats.ratingBreakdown?.breakdown?.exact_ratings?.[3] || 0,
            },
            (stats.ratingBreakdown?.breakdown?.exact_ratings?.[2] ?? 0) > 0 && {
              emoji: "🙁",
              count: stats.ratingBreakdown?.breakdown?.exact_ratings?.[2] || 0,
            },
            (stats.ratingBreakdown?.breakdown?.exact_ratings?.[1] ?? 0) > 0 && {
              emoji: "😞",
              count: stats.ratingBreakdown?.breakdown?.exact_ratings?.[1] || 0,
            },
          ].filter(Boolean);
        }

        let parsedValue: any = box.value;
        if (typeof parsedValue === "string" && parsedValue.includes("%")) {
          parsedValue = parseFloat(parsedValue.replace("%", ""));
        } else if (
          typeof parsedValue === "string" &&
          !isNaN(Number(parsedValue))
        ) {
          parsedValue = Number(parsedValue);
        }

        return (
          <StatCard
            cardKey={box.key}
            key={box.key || index.toString()}
            onTitleClick={() => handleCardClick(box)}
            isLoading={isLoading}
            title={box.label || "Loading..."}
            value={parsedValue}
            subTitle={box.sub_value}
            change={parseChange(box.trend)}
            color={colors.bg}
            iconName={box.icon}
            iconColor={colors.icon}
            iconSize={getResponsiveFontSize("xl")}
            Icon={EmojiIcon}
            iconPosition={getPosition}
            description={
              box.label === "Total Reviews"
                ? "The total number of customer feedback submissions received during the selected time period. This includes ratings, written comments, voice feedback, and surveys."
                : undefined
            }
            valueFontSize={getResponsiveFontSize("2xl")}
            showProgress={
              box.key === "TOTAL_REVIEWS" || box.key === "CSAT_SCORE"
            }
            max={box.key === "TOTAL_REVIEWS" ? stats.allReviews : 100}
            breakdown={breakdown}
            isShowPercentageOnValue={
              box.key === "CSAT_SCORE" ||
              (typeof box.value === "string" && box.value.includes("%"))
            }
            bottomRightSection={stats.totalReviews?.value}
          />
        );
      })}

      <ReviewTrendChart activeTypeTab={activeTypeTab} activeTab={activeTab} />
    </View>
  );
};

export default DashboardCards;
