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
  };
  stats: {
    avgRating: number;
    totalReviews: number;
    newReviews: number;
    ratingChange: number;
    reviewsChange: number;
    newReviewsChange: number;
  };
  reviews: IReview[];
  notifications: INotification[];
  login: (email: string) => void;
  getReviewById: (id: string) => IReview | undefined;
}

export const useBusinessStore = create<IBusinessStore>((set, get) => ({
  user: {
    email: "",
    name: "The Corner Cafe",
  },
  stats: {
    avgRating: 4.8,
    totalReviews: 1250,
    newReviews: 15,
    ratingChange: 0.1,
    reviewsChange: 2.5,
    newReviewsChange: 15,
  },
  reviews: [
    {
      id: "1",
      customerName: "Jane Doe",
      date: "2 days ago",
      rating: 5,
      comment:
        "The best coffee I've had in a long time! The ambiance is cozy and the staff are incredibly friendly.",
      tags: ["Good Service", "Cleanliness"],
      additionalFeedback: "No comment was left.",
      status: "replied",
      avatar: "https://i.pravatar.cc/150?u=jane",
    },
    {
      id: "2",
      customerName: "John Smith",
      date: "5 days ago",
      rating: 4,
      comment:
        "Great place to work and enjoy a good cup of coffee. The WiFi is fast, and there are plenty of outlets.",
      tags: ["Good Atmosphere"],
      additionalFeedback: "Music was a bit loud.",
      status: "pending",
      avatar: "https://i.pravatar.cc/150?u=john",
    },
    {
      id: "3",
      customerName: "Emily White",
      date: "1 week ago",
      rating: 2,
      comment:
        "The coffee was a bit burnt for my taste, and it was very crowded. I might give it another try on a quieter day.",
      tags: ["Wait Time"],
      additionalFeedback: "Tables were dirty.",
      status: "pending",
      avatar: "https://i.pravatar.cc/150?u=emily",
    },
    {
      id: "4",
      customerName: "Sarah W.",
      date: "June 5, 2024",
      rating: 4.0,
      comment:
        "The service was excellent and the staff were very friendly and attentive. The restaurant was also very clean and well-maintained. My only small issue was the wait time for a table, which was a bit longer than expected on a Tuesday night. Overall, a great experience and I will be back!",
      tags: ["Good Service", "Cleanliness"],
      additionalFeedback: "No comment was left.",
      status: "pending",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    {
      id: "5",
      customerName: "Sarah W.",
      date: "June 5, 2024",
      rating: 4.0,
      comment:
        "The service was excellent and the staff were very friendly and attentive. The restaurant was also very clean and well-maintained. My only small issue was the wait time for a table, which was a bit longer than expected on a Tuesday night. Overall, a great experience and I will be back!",
      tags: ["Good Service", "Cleanliness"],
      additionalFeedback: "No comment was left.",
      status: "pending",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
  ],
  notifications: [
    {
      id: "1",
      title: "New 5-star review",
      description: "For 'Pro Plumbing Service'",
      time: "2h ago",
      isRead: false,
      type: "review",
      dateGroup: "Today",
    },
    {
      id: "2",
      title: "Important update",
      description: "New features added to your dashboard",
      time: "5h ago",
      isRead: true,
      type: "update",
      dateGroup: "Today",
    },
    {
      id: "3",
      title: "Weekly summary is ready",
      description: "Your review performance from last week",
      time: "1d ago",
      isRead: false,
      type: "summary",
      dateGroup: "Yesterday",
    },
    {
      id: "4",
      title: "New 4-star review",
      description: "For 'Kitchen Remodeling Experts'",
      time: "1d ago",
      isRead: true,
      type: "review",
      dateGroup: "Yesterday",
    },
  ],
  login: (email) => set((state) => ({ user: { ...state.user, email } })),
  getReviewById: (id) => get().reviews.find((r) => r.id === id),
}));
