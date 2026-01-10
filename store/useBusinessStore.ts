import {
  getBusinessSettings,
  IBusinessSettings,
  updateBusinessDetails,
} from "@/api/business";
import { getProfile } from "@/api/profile";
import { getSurveys, ISurvey } from "@/api/survey";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface IReview {
  id: string;
  customerName: string;
  date: string;
  rating: number;
  comment: string;
  tags: string[];
  additionalFeedback: string;
  status: "replied" | "pending";
  avatar?: string;
}

export interface INotification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: "review" | "update" | "summary";
  dateGroup: "Today" | "Yesterday";
}

interface IBusinessStore {
  user: {
    email: string;
    name: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string; // local standard
    Address?: string; // API standard
    businessId?: number;
    first_Name?: string;
    last_Name?: string;
    middle_Name?: string;
    image?: string;
  };
  stats: {
    sentimentScore: {
      value: number;
      max: number;
      change: number;
    };
    avgRating: {
      value: number;
      change: number;
      percentage?: number;
      total?: number;
    };
    totalReviews: {
      value: number;
      change: number;
      percentage?: number;
      total?: number;
    };
    staffLinkedReviews: {
      value: number;
      change: number;
      percentage?: number;
      total?: number;
    };
    aiSentiment: {
      value: string;
      change?: number;
      subTitle?: string;
    };
    topTopic: {
      value: string;
      count?: number;
      subTitle?: string;
    };
    flagged: {
      value: number;
      change?: number;
    };
    csatScore: {
      value: number;
      change?: number;
    };
    repeatIssue: {
      value: string;
      subTitle?: string;
    };
    ratingBreakdown?: any;
  };
  reviews: IReview[];
  notifications: INotification[];
  settings: IBusinessSettings; // Settings object
  surveys: ISurvey[]; // Surveys list
  isLoading: boolean;
  isFetchingSettings: boolean; // Separate state for fetching settings
  lastUpdated: string | null;
  login: (email: string) => void;
  getReviewById: (id: string) => IReview | undefined;
  setLoading: (loading: boolean) => void;
  updateUser: (userData: any) => void;
  fetchUser: () => Promise<void>;

  // Settings Actions
  setSettings: (settings: Partial<IBusinessSettings>) => void;
  fetchSurveys: () => Promise<void>;
  fetchBusinessSettings: () => Promise<void>;
  updateBusiness: () => Promise<boolean>;
  initializeSettings: (businessData: any) => void;
  setDashboardData: (data: any) => void;
}

export const useBusinessStore = create<IBusinessStore>()(
  persist(
    (set, get) => ({
      user: {
        email: "",
        name: "Feed Genius",
        businessId: undefined, // Will be set from login response
      },
      stats: {
        sentimentScore: {
          value: 0,
          max: 0,
          change: 0,
        },
        avgRating: {
          value: 0,
          change: 0,
          percentage: 0,
          total: 0,
        },
        totalReviews: {
          value: 0,
          change: 0,
          percentage: 0,
          total: 0,
        },
        staffLinkedReviews: {
          value: 0,
          change: 0,
          percentage: 0,
          total: 0,
        },
        aiSentiment: {
          value: "Neutral",
          change: 0,
        },
        topTopic: {
          value: "N/A",
          count: 0,
        },
        flagged: {
          value: 0,
          change: 0,
        },
        csatScore: {
          value: 0,
          change: 0,
        },
        repeatIssue: {
          value: "N/A",
          subTitle: "Recurring problems",
        },
        ratingBreakdown: {},
      },
      reviews: [],
      notifications: [],
      settings: {}, // Initial empty settings
      surveys: [], // Initial empty surveys
      isLoading: false,
      isFetchingSettings: false,
      lastUpdated: null,
      login: (email) => set((state) => ({ user: { ...state.user, email } })),
      getReviewById: (id) =>
        get().reviews.find((r) => r.id.toString() === id.toString()),
      setDashboardData: (data: any) =>
        set({
          stats: {
            sentimentScore: data?.stats?.sentimentScore || {
              value: 0,
              max: 0,
              change: 0,
            },
            avgRating: data?.stats?.avgRating || {
              value: 0,
              change: 0,
            },
            totalReviews: data?.stats?.totalReviews || {
              value: 0,
              change: 0,
            },
            staffLinkedReviews: data?.stats?.staffLinkedReviews || {
              value: 0,
              change: 0,
              percentage: 0,
              total: 0,
            },
            aiSentiment: data?.stats?.aiSentiment || {
              value: "Neutral",
              change: 0,
              subTitle: "",
            },
            topTopic: data?.stats?.topTopic || {
              value: "N/A",
              count: 0,
              subTitle: "",
            },
            flagged: data?.stats?.flagged || {
              value: 0,
              change: 0,
            },
            csatScore: data?.stats?.csatScore || {
              value: 0,
              change: 0,
            },
            repeatIssue: data?.stats?.repeatIssue || {
              value: "N/A",
              subTitle: "Recurring problems",
            },
            ratingBreakdown: data?.stats?.ratingBreakdown || {},
          },
          reviews: data?.reviews || [],
          lastUpdated: new Date().toISOString(),
        }),
      setLoading: (loading) => set({ isLoading: loading }),
      updateUser: (userData) =>
        set((state) => ({ user: { ...state.user, ...userData } })),

      fetchUser: async () => {
        const { user } = get();
        if (!user.businessId) return;
        try {
          // We are using businessId as ownerId based on common pattern in this app
          // If 'user.id' exists separately, we should use that, but usually they are linked in the response
          const userData = await getProfile(user.businessId);
          if (userData) {
            set((state) => ({ user: { ...state.user, ...userData } }));
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        }
      },

      // Settings Implementation
      setSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),

      fetchSurveys: async () => {
        const { user } = get();
        if (!user.businessId) return;
        try {
          const surveys = await getSurveys(user.businessId);
          set({ surveys });
        } catch (error) {
          console.error("Failed to fetch surveys", error);
        }
      },

      fetchBusinessSettings: async () => {
        const { user } = get();
        if (!user.businessId) {
          return;
        }
        set({ isFetchingSettings: true });
        try {
          const response = await getBusinessSettings(user.businessId);
          const businessData = response?.data || response;
          set({ settings: businessData, isFetchingSettings: false });
        } catch (error) {
          console.error("Failed to fetch business settings", error);
          set({ isFetchingSettings: false });
        }
      },

      updateBusiness: async () => {
        const { user, settings } = get();
        if (!user.businessId) return false;
        set({ isLoading: true });
        try {
          const result = await updateBusinessDetails(user.businessId, settings);
          set({ isLoading: false });

          return !!result?.status; // Return boolean
        } catch (err) {
          set({ isLoading: false });
          return false;
        }
      },

      initializeSettings: (businessData) => {
        if (businessData) {
          set((state) => ({
            settings: { ...businessData },
            user: {
              ...state.user,
              businessId: businessData.id || state.user.businessId,
            },
          }));
        }
      },
    }),
    {
      name: "business-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        settings: state.settings,
        stats: state.stats,
        reviews: state.reviews,
        notifications: state.notifications,
        surveys: state.surveys,
      }),
    }
  )
);
