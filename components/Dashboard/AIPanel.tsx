import { useAIInsights } from "@/hooks/useAIInsights";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { LayoutAnimation, Platform, Text, UIManager, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Typewriter from "../Typewriter";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const checkType = (data: any) => {
  try {
    if (typeof data === "string") {
      const parsed = JSON.parse(data);
      return parsed;
    }
    return data;
  } catch {
    return data;
  }
};

const DotTransition = () => {
  const style = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      ),
      -1,
      true,
    ),
  }));
  return (
    <Animated.View
      style={style}
      className="w-2 h-2 bg-[#10b981] rounded-full"
    />
  );
};

const GeneratingView = () => {
  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withRepeat(withTiming(1.2, { duration: 1000 }), -1, true) },
      {
        rotate: withRepeat(
          withSequence(
            withTiming("10deg", { duration: 500 }),
            withTiming("-10deg", { duration: 500 }),
          ),
          -1,
          true,
        ),
      },
    ],
  }));

  return (
    <View className=" border border-[#10b981]/10 shadow-sm mb-6 bg-[#f0fdf9] rounded-2xl p-6 flex flex-col items-center justify-center h-64 space-y-4">
      <Animated.View style={iconStyle}>
        <Ionicons name="sparkles" size={48} color="#10b981" />
      </Animated.View>

      <View className="items-center mt-5">
        <Text className="font-bold text-[#064e3b] text-lg">
          AI is analyzing reviews...
        </Text>
        <Text className="text-xs text-gray-500">
          Synthesizing insights and opportunities
        </Text>
      </View>
      <View className="flex-row gap-1">
        {[0, 1, 2].map((i) => (
          <DotTransition key={i} />
        ))}
      </View>
    </View>
  );
};

interface AIPanelProps {
  period: string;
  type: string;
}

const AIPanel: React.FC<AIPanelProps> = ({ period, type }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const { data: aiResponse, isLoading } = useAIInsights(period, type);
  const aiData = aiResponse?.data;

  const aggregatedDetectedIssues = useMemo(() => {
    if (!aiData?.detected_issues) return [];

    const grouped = aiData.detected_issues.reduce((acc: any, item: any) => {
      const issueObj = checkType(item.issue);
      const rawTitle =
        typeof issueObj === "string" ? issueObj : issueObj?.title || "";
      const title = rawTitle.trim();
      const key = title.toLowerCase();

      if (!acc[key]) {
        acc[key] = {
          title,
          business_actions: issueObj?.business_actions || [],
          staff_actions: issueObj?.staff_actions || [],
          immediate_actions: issueObj?.immediate_actions || [],
        };
      } else {
        // Merge actions
        acc[key].business_actions = [
          ...new Set([
            ...acc[key].business_actions,
            ...(issueObj?.business_actions || []),
          ]),
        ];
        acc[key].staff_actions = [
          ...new Set([
            ...acc[key].staff_actions,
            ...(issueObj?.staff_actions || []),
          ]),
        ];
        acc[key].immediate_actions = [
          ...new Set([
            ...acc[key].immediate_actions,
            ...(issueObj?.immediate_actions || []),
          ]),
        ];
      }
      return acc;
    }, {});

    return Object.values(grouped);
  }, [aiData?.detected_issues]);

  useEffect(() => {
    if (!isLoading && aiData) {
      setIsGenerating(true);
      setShowContent(false);
      const timer = setTimeout(() => {
        setIsGenerating(false);
        setShowContent(true);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }, 1500);
      return () => clearTimeout(timer);
    }
    if (isLoading) {
      setIsGenerating(false);
      setShowContent(false);
    }
  }, [isLoading, aiData]);

  if (isLoading || isGenerating) return <GeneratingView />;
  if (!showContent || !aiData) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      className="bg-[#f0fdf9] rounded-2xl p-6 border border-[#10b981]/10 shadow-sm mb-6"
    >
      <View className="flex-row justify-between mb-6">
        <View className="flex-row items-center gap-2">
          <Ionicons name="sparkles" size={24} color="#10b981" />
          <Text className="text-[#064e3b] font-bold text-xl">
            AI Insights Panel
          </Text>
        </View>
      </View>

      <View className="gap-y-5">
        {/* AI Summary */}
        {aiData.summary && (
          <View className="bg-white/50 p-4 rounded-2xl border border-green-100 shadow-sm">
            <View className="flex-row gap-3 p-5">
              <View className="bg-base-300 p-2 h-12 w-12 justify-center items-center rounded-xl border border-green-200 shadow-sm">
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#059669"
                />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-green-900 text-xs mb-2 uppercase tracking-wider">
                  AI Summary
                </Text>
                <Typewriter
                  text={aiData.summary}
                  delay={10}
                  className="text-xs text-gray-700 leading-5 font-medium"
                />
              </View>
            </View>
          </View>
        )}

        {/* AI Detected Issues */}
        {aggregatedDetectedIssues && aggregatedDetectedIssues.length > 0 && (
          <View className="bg-red-50/50 p-4 rounded-2xl border border-red-100 shadow-sm">
            <View className="flex-row gap-3 p-5">
              <View className="bg-base-300 p-2 h-12 w-12 justify-center items-center rounded-xl border border-red-200 shadow-sm">
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#dc2626"
                />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-red-900 text-xs mb-3 uppercase tracking-wider">
                  AI Detected Issues
                </Text>
                {aggregatedDetectedIssues.map((issue: any, index: number) => {
                  return (
                    <View key={index} className="mb-4 last:mb-0">
                      <View className="flex-row items-center gap-2 mb-1">
                        <View className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        <Text className="text-red-700 font-bold text-xs">
                          Issue {index + 1}
                        </Text>
                      </View>
                      <Text className="text-gray-700 text-xs mb-2 font-medium">
                        {issue.title}
                      </Text>
                      <View className="pl-3 border-l-2 border-red-100 space-y-1">
                        {issue.business_actions?.length > 0 && (
                          <Text className="text-[10px] text-gray-600">
                            <Text className="font-bold text-gray-800">
                              Business:{" "}
                            </Text>
                            {issue.business_actions.join(", ")}
                          </Text>
                        )}
                        {issue.staff_actions?.length > 0 && (
                          <Text className="text-[10px] text-gray-600">
                            <Text className="font-bold text-gray-800">
                              Staff:{" "}
                            </Text>
                            {issue.staff_actions.join(", ")}
                          </Text>
                        )}
                        {issue.immediate_actions?.length > 0 && (
                          <Text className="text-[10px] text-gray-600">
                            <Text className="font-bold text-red-600">
                              Immediate:{" "}
                            </Text>
                            {issue.immediate_actions.join(", ")}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* AI Opportunities */}
        {aiData.opportunities && aiData.opportunities.length > 0 && (
          <View className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 shadow-sm">
            <View className="flex-row gap-3 p-5">
              <View className="bg-base-300 p-2 h-12 w-12 justify-center items-center rounded-xl border border-amber-200 shadow-sm">
                <Ionicons name="bulb-outline" size={20} color="#d97706" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-amber-900 text-xs mb-3 uppercase tracking-wider">
                  AI Opportunities
                </Text>
                {aiData.opportunities.map((item: any, index: number) => {
                  const opp = checkType(item);
                  return (
                    <View key={index} className="mb-4 last:mb-0">
                      <View className="flex-row items-center gap-2 mb-1">
                        <View className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        <Text className="text-green-700 font-bold text-xs">
                          Opportunity {index + 1}
                        </Text>
                      </View>
                      {typeof opp === "string" && (
                        <Text className="text-gray-700 text-xs mb-2 font-medium">
                          {opp}
                        </Text>
                      )}
                      <View className="pl-3 border-l-2 border-green-100 space-y-1">
                        {opp?.business_actions?.length > 0 && (
                          <Text className="text-[10px] text-gray-600">
                            <Text className="font-bold text-gray-800">
                              Business:{" "}
                            </Text>
                            {opp.business_actions.join(", ")}
                          </Text>
                        )}
                        {opp?.staff_actions?.length > 0 && (
                          <Text className="text-[10px] text-gray-600">
                            <Text className="font-bold text-gray-800">
                              Staff:{" "}
                            </Text>
                            {opp.staff_actions.join(", ")}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* AI Predictions */}
        {aiData.predictions && aiData.predictions.length > 0 && (
          <View className="bg-blue-100/50 p-4 rounded-2xl border border-blue-100 shadow-sm">
            <View className="flex-row gap-3 p-5">
              <View className="bg-base-300 p-2 h-12 w-12 justify-center items-center rounded-xl border border-blue-200 shadow-sm">
                <Ionicons
                  name="trending-up-outline"
                  size={20}
                  color="#2563eb"
                />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-blue-900 text-xs mb-3 uppercase tracking-wider">
                  AI Predictions
                </Text>
                {aiData.predictions.map((prediction: any, index: number) => (
                  <View key={index} className="mb-4 last:mb-0">
                    <View className="flex-row items-center gap-2 mb-2">
                      <View className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <Text className="text-blue-700 font-bold text-xs">
                        Prediction {index + 1}
                      </Text>
                    </View>
                    <Text className="text-gray-700 text-xs mb-2 leading-relaxed font-medium">
                      {prediction.prediction}
                    </Text>
                    <View className="bg-white/60 p-2 rounded-lg flex-row justify-between items-center mb-2">
                      <Text className="text-gray-500 text-[10px]">
                        Estimated Impact:
                      </Text>
                      <Text className="font-bold text-blue-600 text-[10px] uppercase">
                        {prediction.estimated_impact}
                      </Text>
                    </View>
                    <View className="flex-row gap-2">
                      <View className="flex-1 items-center p-1 rounded bg-gray-100">
                        <Text className="text-gray-400 text-[9px]">
                          Current
                        </Text>
                        <Text className="font-bold text-[10px]">
                          {prediction.current_avg_rating}
                        </Text>
                      </View>
                      <View className="flex-1 items-center p-1 rounded bg-blue-100">
                        <Text className="text-blue-400 font-medium text-[9px]">
                          Potential
                        </Text>
                        <Text className="font-bold text-blue-700 text-[10px]">
                          {prediction.potential_new_rating}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export default AIPanel;
