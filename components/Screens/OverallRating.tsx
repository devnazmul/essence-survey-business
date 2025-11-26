import { getOverallQuestion } from "@/api/rating";
import { getAllStuffsClient } from "@/api/stuffs";
import { useDimension } from "@/hooks/useDimension";
import { useCustomerSurveyStore } from "@/store/useCustomerSurveyStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import RatingComp from "./RatingComp";

const OverallRating = () => {
  const {
    selectedTagOverall,
    setSelectedTagOverall,
    selectedStaff,
    setSelectedStaff,
    comment,
    setComment,
    isSubmitting,
    handleSubmitRating,
  } = useCustomerSurveyStore();

  const { HP, getResponsiveFontSize } = useDimension();
  const { entityId, type } = useLocalSearchParams();

  const [isQuestionLoading, setIsQuestionLoading] = useState(true);
  const [isStuffLoading, setIsStuffLoading] = useState(true);
  const [questions, setQuestions] = useState<any>([]);
  const [staffs, setStaffs] = useState<any>([]);
  const [isUpdated, setIsUpdated] = useState<number>(0);

  useEffect(() => {
    setIsQuestionLoading(true);
    setIsStuffLoading(true);
    const controller = new AbortController();
    getAllStuffsClient({
      signal: controller.signal,
      params: { business_id: entityId },
    })
      .then((res) => {
        setStaffs(res);
      })
      .finally(() => setIsStuffLoading(false));

    getOverallQuestion({
      signal: controller.signal,
      params: {
        business_id: entityId,
        is_overall: 1,
      },
    })
      .then((res) => {
        console.log({ q: res ?? [] });

        setQuestions(res ?? []);
      })
      .finally(() => setIsQuestionLoading(false));
  }, [entityId, type, isUpdated]); // re-run if entityId changes

  if (!entityId) {
    return (
      <View className="flex justify-center items-center flex-1">
        <Text className="text-2xl text-center ">
          Invalid Survey Link. {entityId}
        </Text>
      </View>
    );
  }
  if (isQuestionLoading || isStuffLoading) {
    return (
      <View className="absolute inset-0 bg-base-300 justify-center items-center">
        <Text
          className="text-gray-400 font-medium"
          style={{ fontSize: getResponsiveFontSize("xl") }}
        >
          QR Scanned Successfully!
        </Text>
        <Text
          className="text-primary font-bold"
          style={{ fontSize: getResponsiveFontSize("3xl") }}
        >
          Processing...
        </Text>
      </View>
    );
  }
  return (
    <View className={`flex-1 bg-primary`}>
      {/* IF NO RATING FOUND  */}
      {questions?.length === 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isQuestionLoading || isStuffLoading}
              onRefresh={() => {
                setIsUpdated(Math.random());
              }}
              // Optional: Customize colors for Android
              colors={["#9Bd35A", "#689F38"]}
              // Optional: Customize tint color for iOS
              tintColor="#9Bd35A"
            />
          }
          className={`flex-1 bg-black flex `}
        >
          <Text className="text-2xl text-center">No Question Available</Text>
          {/* <GoBackButton /> */}
        </ScrollView>
      ) : (
        <View className={`w-full flex-1 flex justify-between`}>
          <RatingComp
            type={type}
            isQuestionLoading={isQuestionLoading}
            isStuffLoading={isStuffLoading}
            setIsUpdated={setIsUpdated}
            isOverall
            staffs={staffs}
            selectedStaff={selectedStaff}
            setSelectedStaff={setSelectedStaff}
            handleSubmitRating={handleSubmitRating}
            isSubmitting={isSubmitting}
            questions={questions?.filter((d: any) => d?.is_active)}
            setSelectedTag={setSelectedTagOverall}
            selectedTag={selectedTagOverall}
            comment={comment}
            setComment={setComment}
            // singleRating={singleRating}
          />
        </View>
      )}
    </View>
  );
};

export default OverallRating;
