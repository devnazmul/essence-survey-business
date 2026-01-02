export const getAnalyticsData = async () => {
  // Mock data to match the design image
  return {
    positiveThemes: [
      { label: "Friendly Staff", percentage: 85 },
      { label: "Tasty Food", percentage: 72 },
      { label: "Cleanliness", percentage: 64 },
    ],
    negativeThemes: [
      { label: "Wait Time", percentage: 15 },
      { label: "Parking", percentage: 8 },
      { label: "Noise Level", percentage: 5 },
    ],
    areaPerformance: [
      { label: "Downtown", rating: 4.8 },
      { label: "Uptown", rating: 4.2 },
      { label: "Westside", rating: 3.9 },
    ],
    topStaff: [
      {
        name: "Sarah J.",
        role: "Server",
        location: "Downtown",
        rating: 5.0,
        reviews: 12,
        image: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        name: "Mike T.",
        role: "Manager",
        location: "Uptown",
        rating: 4.8,
        reviews: 8,
        image: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        name: "Emily R.",
        role: "Host",
        location: "Westside",
        rating: 4.7,
        reviews: 5,
        image: "https://randomuser.me/api/portraits/women/68.jpg",
      },
    ],
  };
};
