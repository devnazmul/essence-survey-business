import { useDimension } from "@/hooks/useDimension";
import { useAuthStore } from "@/store/useAuthStore";
import { useCustomerSurveyStore } from "@/store/useCustomerSurveyStore";
import getFullImageLink from "@/utils/getFullImageLink";
import { getFullName } from "@/utils/getFullName";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GuestDetailsComp from "../GuestDetailsComp";
import { TextAreaInputField } from "../InputField";
import RatingRow from "../RattingRow";
import Button from "../ui/Button";
import Login from "./Login";

export default function RatingComp({
  isOverall = false,
  staffs,
  selectedStaff,
  setSelectedStaff,
  questions,
  selectedTag,
  setSelectedTag,
  comment,
  setComment,
  handleSubmitRating,
  isSubmitting,
  singleRating,
  setIsUpdated,
  isQuestionLoading,
  isStuffLoading,
  type,
}: {
  type: any;
  isOverall?: boolean;
  staffs?: any;
  selectedStaff?: any;
  setSelectedStaff?: any;
  questions?: any;
  selectedTag?: any;
  setSelectedTag?: any;
  comment?: any;
  setComment?: any;
  handleSubmitRating?: any;
  isSubmitting?: any;
  singleRating?: any;
  setIsUpdated?: any;
  isQuestionLoading: boolean;
  isStuffLoading: boolean;
}) {
  const {
    errors,
    setErrors,
    setGuestData,
    guestData,
    setPopupOption,
    handleSubmitRatting,
    validateGuest,
    saveOverallRatting,
    businessSettings,
  } = useCustomerSurveyStore();

  const { HP, getResponsiveFontSize, WP } = useDimension();
  const [isAnythingElse, setIsAnythingElse] = useState(false);
  const { user: customer } = useAuthStore();

  const router = useRouter();

  const submitOnlyOverall = () => {
    if (type === "guest") {
      if (validateGuest()) {
        console.log("Hi");
        saveOverallRatting("overall", () => router.push("/thank-you"));
      }
    } else {
      saveOverallRatting("overall", () => router.push("/thank-you"));
    }
  };

  const submitOverall = () => {
    setPopupOption({
      open: true,
      type: "survey",
      title: "",
      variant: "rightSlide",
      disabledButtonWarning: true,
      closeOnDocumentClick: false,
      onClose: () => {
        setPopupOption((prev: any) => ({ ...prev, open: false }));
      },
      refetch: questions?.refetch,
    });
  };

  const submitBtn = () => (
    <Button
      onPress={() => {
        handleSubmitRatting(
          submitOnlyOverall,
          questions,
          "overall",
          !!(singleRating?.feedbacks?.length > 0)
        );
      }}
      size="2xl"
      textClassName="text-center"
      color="outline"
      label={
        isSubmitting?.ratingType === "overall" && isSubmitting?.isLoading
          ? "Loading..."
          : "Submit"
      }
    />
  );

  const [isInLoginState, setIsInLoginState] = useState<boolean>(false);
  if (isInLoginState) {
    return <Login />;
  }
  return (
    <KeyboardAvoidingView className={`flex-1`} behavior="padding">
      {/* HEADER  */}
      <View
        style={{
          height: HP("9%"),
        }}
        className={`bg-base-300 w-full`}
      >
        {isOverall ? (
          <Text
            style={{
              marginTop: HP("5%"),
              fontSize: getResponsiveFontSize("lg"),
            }}
            className="text-center font-medium text-primary"
          >
            Your Overall Experience
          </Text>
        ) : singleRating?.feedbacks?.length > 0 ? (
          <Text
            style={{
              marginTop: HP("5%"),
              fontSize: getResponsiveFontSize("lg"),
            }}
            className="text-center font-medium text-base-300"
          >
            My Ratings
          </Text>
        ) : (
          <Text
            style={{
              marginTop: HP("5%"),
              fontSize: getResponsiveFontSize("lg"),
            }}
            className="text-center font-medium text-base-300"
          >
            How would you rate us for the following:
          </Text>
        )}
      </View>

      {/* MAIN CONTENT  */}
      <ScrollView
        style={{
          padding: WP("4%"),
        }}
        className="flex-1"
      >
        {/* QUESTIONS  */}
        <View className={`gap-5`}>
          {questions
            ?.filter((qus: any) => qus?.type)
            ?.map((question: any, i: any) => (
              <View
                key={i}
                style={{
                  padding: WP("4%"),
                }}
                className={`bg-base-300 border border-gray-300 rounded-2xl`}
              >
                <Text
                  style={{
                    fontSize: getResponsiveFontSize("2xl"),
                  }}
                  className="text-left font-medium mb-5"
                >
                  {!isOverall && `${i + 1}. `}
                  {question?.question}
                </Text>
                <View className="py-2">
                  <RatingRow
                    key={i}
                    isOverall={isOverall}
                    setSelectedTag={setSelectedTag}
                    question={question}
                    selectedTag={selectedTag}
                    singleRating={singleRating}
                  />
                </View>
              </View>
            ))}
        </View>

        {!isOverall && singleRating?.feedbacks?.length > 0 && (
          // <div className={`space-y-5`}>
          //   <div className={`flex flex-col`}>
          //     <label className={`label text-sm`} htmlFor="remarks">
          //       Remarks (optional)
          //     </label>
          //     <textarea
          //       disabled={singleRating?.feedbacks?.length > 0}
          //       value={
          //         (singleRating?.feedbacks?.length > 0 &&
          //           singleRating?.feedbacks[0]?.comment) ||
          //         comment
          //       }
          //       onChange={(e) => setComment(e.target.value)}
          //       className={`input h-40 pt-5 border-primary border focus:border-primary`}
          //       id="remarks"
          //       type="text"
          //       placeholder="remarks"
          //       rows={30}
          //     />
          //   </div>
          // </div>
          //
          // REACT NATIVE APP
          <TextAreaInputField
            label="Remarks (optional)"
            value={
              (singleRating?.feedbacks?.length > 0 &&
                singleRating?.feedbacks[0]?.comment) ||
              comment
            }
            onChangeText={(e: any) => setComment(e.target.value)}
            rows={10}
          />
        )}

        {!isOverall &&
          (singleRating?.feedbacks?.length > 0 || (
            <View className="w-full">
              {/* REMARK ACTIVE BUTTON  */}
              {!isAnythingElse && (
                <TouchableOpacity
                  onPress={() => {
                    setIsAnythingElse(!isAnythingElse);
                  }}
                  className={`text-primary text-center w-full`}
                >
                  <Text>Anything to add?</Text>
                </TouchableOpacity>
              )}

              {/* REMARK  */}
              {isAnythingElse && (
                <TextAreaInputField
                  label="Remarks (optional)"
                  value={
                    (singleRating?.feedbacks?.length > 0 &&
                      singleRating?.feedbacks[0]?.comment) ||
                    comment
                  }
                  onChangeText={(e: any) => setComment(e.target.value)}
                  rows={10}
                />
              )}

              {/* SUBMIT BUTTON  */}
              {localStorage.getItem("customer_details") ? (
                <View
                  className={` mt-5 flex justify-center items-center gap-5`}
                >
                  <TouchableOpacity
                    onPress={handleSubmitRating}
                    className={`btn w-40 btn-primary`}
                  >
                    <Text>{isSubmitting ? "Loading" : "Submit"}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className={`flex justify-between w-full gap-x-5`}>
                  <View
                    className={` mt-5 flex justify-center items-center gap-5`}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        // navigate("/auth");
                      }}
                      className={`btn w-40 btn-primary btn-outline`}
                    >
                      Login
                    </TouchableOpacity>
                  </View>

                  <View
                    className={` mt-5 flex justify-center items-center gap-5`}
                  >
                    <TouchableOpacity
                      onPress={handleSubmitRating}
                      className={`btn w-40 btn-primary`}
                    >
                      {isSubmitting ? "Loading" : "Submit as Guest"}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}

        {/* STAFF  */}
        {isOverall && staffs?.length > 0 && (
          <View
            style={{
              marginTop: HP("2%"),
              padding: WP("4%"),
            }}
            className={`bg-base-300 rounded-2xl border border-gray-300`}
            // className={`rounded-2xl border-2 border-green-500`}
          >
            <Text
              style={{
                fontSize: getResponsiveFontSize("lg"),
              }}
              className="text-left font-medium "
            >
              Who served you today?
            </Text>

            <ScrollView
              style={{
                paddingRight: HP("1.1%"),
                paddingVertical: HP("1.1%"),
              }}
              className={`w-full `}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {staffs?.map((d: any) => (
                // STUFFS
                <TouchableOpacity
                  key={d?.id}
                  className={`flex flex-col justify-center items-center border-2 ${
                    selectedStaff === d?.id
                      ? "border-primary bg-primary/10"
                      : "border-base-100"
                  } cursor-pointer mx-2 overflow-hidden`}
                  onPress={() => setSelectedStaff(d?.id)}
                  style={{
                    width: WP("30%"),
                    height: WP("35%"),
                    borderRadius: WP("3%"),
                  }}
                >
                  {d?.image ? (
                    <Image
                      source={{ uri: getFullImageLink(d?.image) }}
                      alt={getFullName(d)}
                      className="items-center rounded-full"
                      style={{
                        height: WP("20%"),
                        width: WP("20%"),
                        marginBottom: WP("10%"),
                      }}
                    />
                  ) : (
                    <Image
                      source={require("../../assets/images/icon.png")}
                      alt={getFullName(d)}
                      style={{
                        height: WP("20%"),
                        width: WP("20%"),
                        marginBottom: WP("10%"),
                      }}
                      className="items-center rounded-full"
                    />
                  )}

                  <View
                    style={{
                      padding: WP("2%"),
                    }}
                    className={`absolute w-full  bottom-0 left-0`}
                  >
                    <Text
                      style={{
                        fontSize: getResponsiveFontSize("sm"),
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      className={`${selectedStaff === d?.id ? "text-primary" : "text-gray-600"} font-semibold`}
                    >
                      {getFullName(d)}
                    </Text>
                    <Text
                      style={{
                        fontSize: getResponsiveFontSize("xs"),
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      className={`${selectedStaff === d?.id ? "text-primary" : "text-gray-600"}`}
                    >
                      {d?.email}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* REMARKS  */}
        {isOverall && (
          <View
            style={{
              padding: WP("4%"),
              marginTop: HP("2%"),
            }}
            className={`bg-base-300 rounded-2xl border border-gray-300`}
          >
            {/* REMARKS WITHOUT BUTTON */}
            {singleRating?.feedbacks?.length > 0 && (
              <View className={`space-y-5`}>
                <View className={`flex flex-col`}>
                  <TextAreaInputField
                    label="Remarks (optional)"
                    rows={10}
                    required
                    placeholder={"Enter Remarks"}
                    value={
                      (singleRating?.feedbacks?.length > 0 &&
                        singleRating?.feedbacks[0]?.comment) ||
                      comment
                    }
                    onChangeText={(e: any) => setComment(e.target.value)}
                    name={"remarks"}
                    disable={singleRating?.feedbacks?.length > 0}
                  />
                </View>
              </View>
            )}

            {/* REMARKS WITH ANYTHING TO ADD BUTTON */}
            {singleRating?.feedbacks?.length > 0 || (
              <View className="w-full">
                {/* REMARK ACTIVE BUTTON  */}
                {!isAnythingElse && (
                  <TouchableOpacity
                    onPress={() => {
                      setIsAnythingElse(!isAnythingElse);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: getResponsiveFontSize("lg"),
                      }}
                      className={`text-primary text-center w-full`}
                    >
                      Anything to add?
                    </Text>
                  </TouchableOpacity>
                )}

                {/* REMARK  */}
                {isAnythingElse && (
                  <View className={`flex flex-col`}>
                    <TextAreaInputField
                      label="Remarks (optional)"
                      rows={10}
                      required
                      placeholder={"Enter Remarks"}
                      value={
                        (singleRating?.feedbacks?.length > 0 &&
                          singleRating?.feedbacks[0]?.comment) ||
                        comment
                      }
                      onChangeText={(e: any) => setComment(e.target.value)}
                      name={"remarks"}
                      disable={singleRating?.feedbacks?.length > 0}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* GUEST DETAILS  */}
        {type === "guest" && (
          <View
            style={{
              marginTop: HP("2%"),
              padding: WP("4%"),
            }}
            className={`bg-base-300 rounded-2xl border border-gray-300 `}
          >
            <GuestDetailsComp
              errors={errors}
              setGuestData={setGuestData}
              guestData={guestData}
              setErrors={setErrors}
            />
          </View>
        )}

        <View
          style={{
            marginTop: HP("2%"),
            padding: WP("4%"),
            marginBottom: HP("5%"),
          }}
          className={`bg-base-300 rounded-2xl border border-gray-300 gap-4`}
        >
          {type === "user" && !(customer as any)?.id ? (
            <Button
              onPress={() => {
                setIsInLoginState(true);
              }}
              size="2xl"
              textClassName="text-center"
              color="outline"
              label="Login"
            />
          ) : (
            <>
              {(
                type === "guest"
                  ? !(businessSettings as any)?.is_guest_user_survey
                  : !(businessSettings as any)?.is_registered_user_survey
              )
                ? submitBtn()
                : (type === "guest"
                    ? !(businessSettings as any)?.is_guest_user_survey_required
                    : !(businessSettings as any)
                        ?.is_registered_user_survey_required) && submitBtn()}

              {(type === "guest"
                ? (businessSettings as any)?.is_guest_user_survey
                : (businessSettings as any)?.is_registered_user_survey) && (
                <Button
                  onPress={() =>
                    handleSubmitRatting(
                      submitOnlyOverall,
                      questions,
                      "overall",
                      !!(singleRating?.feedbacks?.length > 0)
                    )
                  }
                  size="2xl"
                  textClassName="text-center"
                  color="primary"
                  label={isSubmitting ? "Loading..." : "Continue to Survey"}
                />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
