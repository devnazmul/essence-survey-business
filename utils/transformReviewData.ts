import { getFullName } from "./getFullName";

export interface TransformedReviewQuestion {
  id: number;
  questionId: number;
  questionText: string;
  answerType: "emoji" | "star" | "text" | "heart" | "numbers";
  value: number;
  maxValue: number; // For star/heart/numbers ratings (e.g., 5)
  tagLabel: string | null; // Tag label like "Decent", "Average", etc.
  sentiment: string | null;
}

export interface TransformedReviewData {
  id: number;
  orderNo: number;
  replyContent: string | null;
  submittedAt: string;
  status: "Replied" | "Reply needed";
  overallRating: number;
  sentimentScore: number;

  // Customer Information
  customer: {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    avatar?: string | null;
    isGuest: boolean;
  };
  // Questions and Answers
  questions: TransformedReviewQuestion[];
  // Additional metadata
  comment: string | null;
  isPrivate: boolean | null;
  verified: boolean;
  isAiProcessed: boolean;
  // AI/Moderation data
  moderationResults: {
    issuesFound: string[];
    severityScore: number;
    actionTaken: string;
    shouldBlock: boolean;
    actionMessage: string;
  };
  aiSuggestions: any[];
  staffSuggestions: any[];
  keyPhrases: string[];
  topics: string[];
  // Voice review data (if applicable)
  isVoiceReview: boolean;
  voiceUrl: string | null;
  voiceDuration: number | null;
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Transforms raw API review data into a structured format suitable for the UI
 * Automatically extracts question data from nested structure when available
 * @param apiResponse - The raw API response containing review data (can be full response or just data object)
 * @returns Transformed review data optimized for UI rendering
 */
export const transformReviewData = (
  apiResponse: any,
): TransformedReviewData | null => {
  // Handle both cases: full response with success flag, or just the data object
  const data = apiResponse?.success ? apiResponse.data : apiResponse;
  console.log({ data });

  if (!data) {
    return null;
  }

  // Determine customer information (user or guest)
  const isGuest = !!data.guest_user && !data.user;
  const customer = isGuest
    ? {
        id: data.guest_user.id,
        name: data.guest_user.full_name || "Anonymous",
        email: data.guest_user.email || null,
        phone: data.guest_user.phone || null,
        avatar: null,
        isGuest: true,
      }
    : data.user
      ? {
          id: data.user.id,
          name: getFullName(data?.user) || "User",
          email: data.user.email || null,
          phone: data.user.phone || null,
          avatar: data.user.avatar || null,
          isGuest: false,
        }
      : {
          id: 0,
          name: "Anonymous",
          email: null,
          phone: null,
          avatar: null,
          isGuest: true,
        };

  // Transform review values into questions
  // Automatically extract question data if available in the nested structure
  const questions: TransformedReviewQuestion[] = (data.value || []).map(
    (item: any) => {
      // Extract question data if available
      const questionData = item.question;
      const tagData = item.tag;
      return {
        id: item.id,
        questionId: item.question_id,
        questionText: questionData?.question || `Question ${item.question_id}`,
        answerType: questionData?.type || "star", // Use actual type from question data
        value: item.star_id,
        maxValue: 5, // Standard max value for ratings
        tagLabel: tagData?.tag || null, // Tag label like "Decent", "Average"
        sentiment: item.sentiment,
      };
    },
  );
  return {
    id: data.id,
    replyContent: data.reply_content,
    orderNo: data.order_no,
    submittedAt: data.created_at,
    status: data.status,
    overallRating: parseFloat(data.calculated_rating),
    sentimentScore: parseFloat(data.sentiment_score) || 0,

    customer,
    questions,

    comment: data.comment,
    isPrivate: data.is_private,
    verified: data.verified === 1,
    isAiProcessed: data.is_ai_processed === true || data.is_ai_processed === 1,

    moderationResults: data.moderation_results || {
      issuesFound: [],
      severityScore: 0,
      actionTaken: "allow",
      shouldBlock: false,
      actionMessage: "Content approved",
    },

    aiSuggestions: Array.isArray(data.ai_suggestions)
      ? data.ai_suggestions
      : [],
    staffSuggestions: Array.isArray(data.staff_suggestions)
      ? data.staff_suggestions
      : [],
    keyPhrases: Array.isArray(data.key_phrases)
      ? data.key_phrases
      : typeof data.key_phrases === "string"
        ? data.key_phrases.split(",").map((s: string) => s.trim())
        : [],
    topics: Array.isArray(data.topics)
      ? data.topics
      : typeof data.topics === "string"
        ? data.topics.split(",").map((s: string) => s.trim())
        : [],

    isVoiceReview: data.is_voice_review || false,
    voiceUrl: data.voice_url,
    voiceDuration: data.voice_duration,

    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};
