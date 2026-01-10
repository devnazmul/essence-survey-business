import { axiosPrivate } from "@/utils/axiosInstance";

export const uploadProfileImage = async (imageUri: string) => {
  const formData = new FormData();

  // Extract file name and type from URI
  const filename = imageUri.split("/").pop() || "profile.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  // Append the image file to FormData
  formData.append("logo", {
    uri: imageUri,
    name: filename,
    type: type,
  } as any);

  try {
    const response = await axiosPrivate.post(
      `/v1.0/upload/profile-image`,
      formData,
      {
        params: { _method: "PATCH" },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Upload Error Response:", error.response.data);
      console.error("Upload Error Status:", error.response.status);
    }
    throw error;
  }
};

export const updateProfile = async (data: {
  id: number;
  first_Name: string;
  last_Name: string;
  phone: string;
  Address: string;
}) => {
  const response = await axiosPrivate.patch(`/v1.0/owner/update`, data);
  return response.data;
};

export const getProfile = async (id: number | string) => {
  const response = await axiosPrivate.get(`/owner/${id}`);
  return response.data;
};
