import { useDimension } from "@/hooks/useDimension";
import { Text, View } from "react-native";

const StatCard = ({
  isLoading = false,
  title,
  value,
  percentage,
  total,
  change,
  fullWidth = false,
  isPercentage = false,
}: {
  isLoading?: boolean;
  title: string;
  value: number;
  percentage?: number;
  total?: number;
  change: number;
  fullWidth?: boolean;
  isPercentage?: boolean;
}) => {
  const { getResponsiveFontSize } = useDimension();
  return (
    <View
      className={`bg-base-300 p-4 rounded-xl shadow-sm mb-4 ${
        fullWidth ? "w-full" : "w-[48%]"
      }`}
    >
      {isLoading ? (
        <View className="h-4 w-24 mb-1 bg-gray-200 rounded" />
      ) : (
        <Text
          style={{ fontSize: getResponsiveFontSize("md") }}
          className="text-gray-400 font-medium mb-1"
        >
          {title}
        </Text>
      )}
      <View className={`flex flex-row items-end`}>
        {isLoading ? (
          <View className="h-10 mb-1 w-14 bg-gray-200 rounded" />
        ) : (
          <Text
            style={{ fontSize: getResponsiveFontSize("3xl") }}
            className="font-bold text-gray-900"
          >
            {value}
          </Text>
        )}
        {isPercentage && (
          <View className="flex flex-row items-center mb-1 text-gray-400">
            <Text
              style={{ fontSize: getResponsiveFontSize("md") }}
              className="font-bold text-gray-400"
            >
              {" "}
              /{" "}
            </Text>
            {isLoading ? (
              <View className="h-5 mb-1 w-10 bg-gray-200 rounded" />
            ) : (
              <Text
                style={{ fontSize: getResponsiveFontSize("md") }}
                className="font-bold text-gray-400"
              >
                {total}
              </Text>
            )}
          </View>
        )}
      </View>
      {isPercentage ? (
        <>
          {isLoading ? (
            <View className="h-4 w-10 mb-1 bg-gray-200 rounded" />
          ) : (
            <Text
              style={{ fontSize: getResponsiveFontSize("md") }}
              className="text-green-600 font-medium mt-1"
            >
              {percentage}%
            </Text>
          )}
        </>
      ) : (
        <>
          {change >= 0 ? (
            <>
              {isLoading ? (
                <View className="h-4 w-10 mb-1 bg-gray-200 rounded" />
              ) : (
                <Text
                  style={{ fontSize: getResponsiveFontSize("md") }}
                  className="text-green-600 font-medium mt-1"
                >
                  +{change}%
                </Text>
              )}
            </>
          ) : (
            <>
              {isLoading ? (
                <View className="h-4 w-10 mb-1 bg-gray-200 rounded" />
              ) : (
                <Text
                  style={{ fontSize: getResponsiveFontSize("md") }}
                  className="text-red-600 text-lg font-medium mt-1"
                >
                  {change}%
                </Text>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
};
export default StatCard;
