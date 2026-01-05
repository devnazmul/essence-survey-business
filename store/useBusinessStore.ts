import {
  getBusinessSettings,
  IBusinessSettings,
  updateBusinessDetails,
} from "@/api/business";
import { getSurveys, ISurvey } from "@/api/survey";
import { create } from "zustand";

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
    address?: string;
    businessId?: number; // Added businessId
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
  setDashboardData: (data: any) => void;
  setLoading: (loading: boolean) => void;

  // Settings Actions
  setSettings: (settings: Partial<IBusinessSettings>) => void;
  fetchSurveys: () => Promise<void>;
  fetchBusinessSettings: () => Promise<void>;
  updateBusiness: () => Promise<boolean>;
  initializeSettings: (businessData: any) => void;
}

export const useBusinessStore = create<IBusinessStore>((set, get) => ({
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
  setDashboardData: (data) =>
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
      },
      reviews: data?.reviews || [],
      lastUpdated: new Date().toISOString(),
    }),
  setLoading: (loading) => set({ isLoading: loading }),

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
    console.log("fetchBusinessSettings called, user:", user);
    if (!user.businessId) {
      console.log("No businessId, skipping fetch");
      return;
    }
    console.log("Fetching settings for businessId:", user.businessId);
    set({ isFetchingSettings: true });
    try {
      const response = await getBusinessSettings(user.businessId);
      console.log("Settings response:", response);
      const businessData = response?.data || response;
      console.log("Setting business data:", businessData);
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
      return result?.success || result?.status === 200; // Check success condition based on API
    } catch (error) {
      console.error("Failed to update settings", error);
      set({ isLoading: false });
      return false;
    }
  },

  initializeSettings: (businessData) => {
    console.log("initializeSettings called with:", businessData);
    if (businessData) {
      set((state) => ({
        settings: { ...businessData },
        user: {
          ...state.user,
          businessId: businessData.id || state.user.businessId,
        },
      }));
      console.log("Settings initialized, businessId:", businessData.id);
    }
  },
}));
