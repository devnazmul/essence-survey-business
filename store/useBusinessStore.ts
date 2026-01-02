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
  };
  stats: {
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
  isLoading: boolean;
  lastUpdated: string | null;
  login: (email: string) => void;
  getReviewById: (id: string) => IReview | undefined;
  setDashboardData: (data: any) => void;
  setLoading: (loading: boolean) => void;
}

export const useBusinessStore = create<IBusinessStore>((set, get) => ({
  user: {
    email: "",
    name: "Feed Genius",
  },
  stats: {
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
  notifications: [
    // {
    //   id: "4",
    //   title: "New 4-star review",
    //   description: "For 'Kitchen Remodeling Experts'",
    //   time: "1d ago",
    //   isRead: true,
    //   type: "review",
    //   dateGroup: "Yesterday",
    // },
  ],
  isLoading: false,
  lastUpdated: null,
  login: (email) => set((state) => ({ user: { ...state.user, email } })),
  getReviewById: (id) =>
    get().reviews.find((r) => r.id.toString() === id.toString()),
  setDashboardData: (data) =>
    set({
      stats: {
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
}));
