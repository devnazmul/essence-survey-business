import IMAGES from "@/assets";
import { COLORS } from "@/constants";
import { useDimension } from "@/hooks/useDimension";
import { formatRole } from "@/utils/formatRole";
import { Rating } from "@kolking/react-native-rating";
import { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import SearchBar from "./SearchBar";

export default function RatingRow({
  isOverall,
  question,
  setSelectedTag,
  selectedTag,
  singleRating,
}: {
  isOverall: boolean;
  question: any;
  setSelectedTag: any;
  selectedTag: any;
  singleRating: any;
}) {
  const { getResponsiveFontSize, WP, HP } = useDimension();
  const [searchTag, setSearchTag] = useState("");
  const [ratingValue, setRatingValue] = useState(0);

  const [liveRating, setLiveRating] = useState(0);

  const handleChange = useCallback(
    (value: number) => {
      setRatingValue(value);
      setLiveRating(0);
    },
    [ratingValue]
  );
  useEffect(() => {
    if (singleRating?.feedbacks?.length > 0) {
      const singleRatingValue = singleRating?.feedbacks[0]?.value?.find(
        (val: any) => val?.question_id === question?.id
      );
      setRatingValue(singleRatingValue?.star_id);

      const singleTagValue = singleRating?.feedbacks[0]?.value?.map(
        (val: any) => ({
          question_id: val?.question_id,
          tag_id: val?.tag_id,
          star_id: val?.star_id,
        })
      );
      setSelectedTag([...selectedTag, ...singleTagValue]);
    }
  }, [singleRating, question]);

  // SELECT TAG
  const handleSelectTag = (question_id: any, tag_id: any, star_value: any) => {
    selectedTag?.filter(
      (i: any) => i?.tag_id === tag_id && i?.question_id === question_id
    ).length > 0
      ? setSelectedTag(
          selectedTag?.filter(
            (i: any) => i?.tag_id !== tag_id || i?.question_id !== question_id
          )
        )
      : setSelectedTag([
          ...selectedTag,
          {
            question_id: question_id,
            tag_id: tag_id,
            star_id: star_value,
          },
        ]);
  };
  // REMOVE TAG
  const removeSelectedItem = (rV: any, qId: any) => {
    setSelectedTag(selectedTag.filter((i: any) => i.question_id !== qId));
  };

  const handleInputChange = ({
    event,
    question,
    value,
  }: {
    event: any;
    question: any;
    value: any;
  }) => {
    setRatingValue(parseInt(event.target.value));
    removeSelectedItem(value, question?.id);
  };

  return (
    <View>
      {/* STAR TYPE  */}
      {question?.type === "star" && (
        <View className={`w-full flex items-center `}>
          <View className="flex-row w-full justify-center gap-2 mb-4">
            <Rating
              baseColor={COLORS["gray-200"]}
              touchColor={COLORS["orange-500"]}
              fillColor={COLORS["orange-400"]}
              size={getResponsiveFontSize("5xl")}
              rating={ratingValue}
              onChange={handleChange}
              onMove={setLiveRating}
            />
          </View>
        </View>
      )}

      {/* HEART TYPE  */}
      {question?.type === "heart" && (
        <View className={`w-full flex items-center`}>
          <View className="flex-row w-full justify-center gap-2 mb-4">
            <Rating
              baseColor={COLORS["gray-200"]}
              touchColor={COLORS["red-400"]}
              fillColor={COLORS["red-600"]}
              size={getResponsiveFontSize("5xl")}
              rating={ratingValue}
              onChange={handleChange}
              onMove={setLiveRating}
              variant="hearts"
            />
          </View>
        </View>
      )}

      {/* EMOJI  */}
      {question?.type === "emoji" && (
        <View className={`w-full flex items-center`}>
          <View className="flex-row w-full justify-center gap-2 mb-4">
            <View className="rating gap-1 rating-md md:rating-lg flex-row items-center">
              {new Array(5).fill(null).map((_, i) => {
                const emojiIndex: string = `emoji${i + 1}`;
                return (
                  <TouchableOpacity
                    disabled={singleRating?.feedbacks?.length > 0}
                    onPress={() => {
                      handleInputChange({
                        event: {
                          target: {
                            type: "radio",
                            checked: true,
                            value: i + 1,
                          },
                        },
                        question: question,
                        value: i + 1,
                      });
                    }}
                    key={i}
                  >
                    <Image
                      style={{
                        transform: [
                          { scale: ratingValue === i + 1 ? 1.2 : 0.9 },
                        ],
                        marginHorizontal: ratingValue === i + 1 ? 10 : 0,
                      }}
                      source={
                        IMAGES.rating[emojiIndex as keyof typeof IMAGES.rating]
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {/* NUMBER SLIDER  */}
      {question?.type === "number" && (
        <View className={`w-full flex items-center`}>
          <View className="flex-row w-full justify-center mb-4">
            <View className="ratingd gap-2 rating-md md:rating-lg flex-row items-center">
              {new Array(5).fill(null).map((_, i) => {
                const backgroundColor = (index: number) => {
                  switch (index) {
                    case 1:
                      return "#EE1315";
                    case 2:
                      return "#F87909";
                    case 3:
                      return "#F8DF09";
                    case 4:
                      return "#CEDF16";
                    case 5:
                      return "#46B835";
                    default:
                      return "#ffffff";
                  }
                };
                return (
                  <TouchableOpacity
                    disabled={singleRating?.feedbacks?.length > 0}
                    onPress={() => {
                      handleInputChange({
                        event: {
                          target: {
                            type: "radio",
                            checked: true,
                            value: i + 1,
                          },
                        },
                        question: question,
                        value: i + 1,
                      });
                    }}
                    key={i}
                    style={{
                      width: ratingValue === i + 1 ? WP("12%") : WP("10%"),
                      height: ratingValue === i + 1 ? WP("12%") : WP("10%"),
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: backgroundColor(i + 1),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: getResponsiveFontSize("3xl"),
                      }}
                      className={`text-base-300 font-bold`}
                    >
                      {i + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {/* TAG SELECTION  */}
      {ratingValue !== null && (
        <View className={``}>
          {question?.stars?.find((star: any) => star?.value === ratingValue)
            ?.tags?.length > 5 && (
            <SearchBar setSearchText={setSearchTag} placeholder="Search Tag" />
          )}

          <ScrollView
            style={{
              paddingRight: HP("1.1%"),
              paddingVertical: HP("1.1%"),
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            className={`w-full bg-base-300`}
          >
            {question?.stars
              ?.find((star: any) => star?.value === ratingValue)
              ?.tags?.filter((tag: any) =>
                tag.tag?.toLowerCase()?.includes(searchTag?.toLowerCase())
              )
              ?.map((tag: any, i: any) => (
                // ================ TAGS ==============
                <TouchableOpacity
                  key={i}
                  style={{
                    paddingHorizontal: WP(`3%`),
                    paddingVertical: WP(`2%`),
                    marginHorizontal: WP(`1%`),
                    borderRadius: WP("1.5%"),
                  }}
                  onPress={() => {
                    singleRating?.feedbacks?.length > 0 ||
                      handleSelectTag(question?.id, tag?.id, ratingValue);
                  }}
                  className={`${
                    selectedTag?.filter(
                      (i: any) =>
                        i?.tag_id === tag?.id &&
                        i?.question_id === question?.id &&
                        i?.star_id === ratingValue
                    ).length > 0
                      ? "bg-primary text-base-300"
                      : "bg-white text-primary"
                  } cursor-pointer border border-primary rounded-md`}
                >
                  <Text
                    style={{
                      fontSize: getResponsiveFontSize("lg"),
                    }}
                    className={`${
                      selectedTag?.filter(
                        (i: any) =>
                          i?.tag_id === tag?.id &&
                          i?.question_id === question?.id &&
                          i?.star_id === ratingValue
                      ).length > 0
                        ? "text-base-300"
                        : "text-primary"
                    } text-center`}
                  >
                    {formatRole(tag?.tag)}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
