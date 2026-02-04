import { DimensionValue, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface SkeletonItemProps {
  height?: number;
  width?: DimensionValue;
  borderRadius?: number;
  marginBottom?: number;
}

const SkeletonItem = ({
  height = 20,
  width = "100%",
  borderRadius = 8,
  marginBottom = 10,
}: SkeletonItemProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0.4, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
      ),
      -1,
      true,
    ),
  }));

  return (
    <Animated.View
      style={[
        {
          height,
          width,
          borderRadius,
          marginBottom,
          backgroundColor: "#E1E9EE",
        },
        animatedStyle,
      ]}
    />
  );
};

const AIPanelSkeleton = () => {
  return (
    <View className="space-y-4">
      <SkeletonItem height={100} borderRadius={16} />
      <SkeletonItem height={150} borderRadius={16} />
      <SkeletonItem height={150} borderRadius={16} />
      <SkeletonItem height={120} borderRadius={16} />
    </View>
  );
};

export default AIPanelSkeleton;
