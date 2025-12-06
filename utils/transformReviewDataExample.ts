/**
 * Example usage of transformReviewData utility
 * This file demonstrates how to use the simplified single utility function
 */

import { transformReviewData } from "./transformReviewData";

// Example 1: With full API response (includes question data)
export const exampleWithQuestionData = () => {
  const apiResponse = {
    success: true,
    message: "Reviews retrieved successfully",
    data: {
      id: 186,
      order_no: 81,
      created_at: "05-12-2025 16:35:37",
      rate: "3.3",
      sentiment_score: "0.50",
      status: "pending",
      comment: null,
      guest_user: {
        id: 131,
        full_name: "anonymous",
        phone: null,
        email: null,
      },
      value: [
        {
          id: 418,
          question_id: 22,
          star_id: 4,
          tag_id: 4,
          review_id: 186,
          sentiment: null,
          question: {
            id: 22,
            question: "How satisfied were you with the taste of the food?",
            type: "emoji",
          },
          tag: {
            id: 4,
            tag: "Decent",
          },
        },
        {
          id: 420,
          question_id: 23,
          star_id: 3,
          tag_id: 3,
          review_id: 186,
          sentiment: null,
          question: {
            id: 23,
            question: "How was the portion size?",
            type: "numbers",
          },
          tag: {
            id: 3,
            tag: "Average",
          },
        },
      ],
    },
  };

  const transformedData = transformReviewData(apiResponse);

  if (transformedData) {
    console.log("Customer:", transformedData.customer.name);
    console.log("Is Guest:", transformedData.customer.isGuest);
    console.log("Overall Rating:", transformedData.overallRating);

    // Questions are automatically populated with question text and type
    transformedData.questions.forEach((q, index) => {
      console.log(`${index + 1}. ${q.questionText}`);
      console.log(`   Type: ${q.answerType}`);
      console.log(`   Answer: ${q.value}/${q.maxValue}`);
      console.log(`   Tag: ${q.tagLabel}`);
    });
  }
};

// Example 2: Without question data (fallback)
export const exampleWithoutQuestionData = () => {
  const apiResponse = {
    success: true,
    data: {
      id: 186,
      order_no: 81,
      created_at: "05-12-2025 16:35:37",
      rate: "3.3",
      guest_user: {
        id: 131,
        full_name: "anonymous",
      },
      value: [
        {
          id: 418,
          question_id: 22,
          star_id: 4,
          sentiment: null,
          // No question or tag data
        },
      ],
    },
  };

  const transformedData = transformReviewData(apiResponse);

  if (transformedData) {
    // Still works! Falls back to default values
    console.log("Questions:", transformedData.questions);
    // Output: questionText will be "Question 22", answerType will be "star"
  }
};

// Example 3: Usage in a React Native component
export const exampleInComponent = `
import { singleReview } from "@/api/review";
import { transformReviewData, formatSubmissionDate } from "@/utils/transformReviewData";
import { useCustomQuery } from "@/hooks/useCustomQuery";

export default function ReviewDetailsScreen() {
  const { id } = useLocalSearchParams();

  const { data: rawReview, isLoading } = useCustomQuery({
    queryFunc: () => singleReview(id as string),
  });

  // Single function call - automatically extracts question data if available
  const review = transformReviewData(rawReview);

  if (isLoading || !review) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView>
      {/* Header */}
      <View>
        <Text>Survey Response</Text>
        <Text>{formatSubmissionDate(review.submittedAt)}</Text>
      </View>

      {/* Customer Information */}
      <View>
        <Text>Customer Information</Text>
        <Image source={{ uri: review.customer.avatar || defaultAvatar }} />
        <Text>{review.customer.name}</Text>
        <Text>{review.customer.email || 'No email provided'}</Text>
      </View>

      {/* Questions - automatically includes question text and type */}
      {review.questions.map((question, index) => (
        <View key={question.id}>
          <Text>{index + 1}. {question.questionText}</Text>

          {question.answerType === 'emoji' && (
            <View>
              <Text>😊 {question.tagLabel}</Text>
            </View>
          )}

          {question.answerType === 'star' && (
            <View>
              {/* Render stars */}
              <Text>⭐ ({question.value}/{question.maxValue})</Text>
              {question.tagLabel && <Text>{question.tagLabel}</Text>}
            </View>
          )}

          {question.answerType === 'heart' && (
            <View>
              {/* Render hearts */}
              <Text>❤️ ({question.value}/{question.maxValue})</Text>
              {question.tagLabel && <Text>{question.tagLabel}</Text>}
            </View>
          )}

          {question.answerType === 'numbers' && (
            <View>
              <Text>{question.value}/{question.maxValue}</Text>
              {question.tagLabel && <Text>{question.tagLabel}</Text>}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
`;
