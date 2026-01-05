import { axiosPrivate } from "@/utils/axiosInstance";

// Define the interface based on the provided JSON
export interface IBusinessSettings {
  Name?: string;
  Address?: string;
  PostCode?: string;
  OwnerID?: number;
  Status?: string;
  Logo?: string;
  Key_ID?: string;
  expiry_date?: string;
  About?: string;
  Webpage?: string;
  PhoneNumber?: string;
  EmailAddress?: string;
  homeText?: string;
  AdditionalInformation?: string;
  GoogleMapApi?: string;
  review_type?: string;
  show_image?: boolean;
  google_map_iframe?: string;
  Is_guest_user?: boolean;
  is_review_slider?: boolean;
  review_only?: boolean;
  is_branch?: boolean;
  header_image?: string;
  rating_page_image?: string;
  placeholder_image?: string;
  primary_color?: string;
  secondary_color?: string;
  client_primary_color?: string;
  client_secondary_color?: string;
  client_tertiary_color?: string;
  user_review_report?: boolean;
  guest_user_review_report?: boolean;
  pin?: string;
  time_zone?: string;
  is_guest_user_overall_review?: boolean;
  is_guest_user_survey?: boolean;
  is_guest_user_survey_required?: boolean;
  is_guest_user_show_stuffs?: boolean;
  is_guest_user_show_stuff_image?: boolean;
  is_guest_user_show_stuff_name?: boolean;
  is_registered_user_overall_review?: boolean;
  is_registered_user_survey?: boolean;
  is_registered_user_survey_required?: boolean;
  is_registered_user_show_stuffs?: boolean;
  is_registered_user_show_stuff_image?: boolean;
  is_registered_user_show_stuff_name?: boolean;
  enable_ip_check?: boolean;
  enable_location_check?: boolean;
  latitude?: number;
  longitude?: number;
  review_distance_limit?: number;
  threshold_rating?: number;
  review_labels?: string[];
  guest_survey_id?: number | null;
  registered_user_survey_id?: number | null;
}

export const getBusinessSettings = async (businessId: number | string) => {
  // Using POST with _method=PATCH as per API hint/convention often seen in some frameworks
  const response = await axiosPrivate.get(`/v1.0/business/${businessId}`);
  return response.data;
};

export const uploadBusinessLogo = async (
  businessId: number | string,
  imageUri: string
) => {
  const formData = new FormData();

  // Extract file name and type from URI
  const filename = imageUri.split("/").pop() || "logo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  // Append the image file to FormData
  formData.append("logo", {
    uri: imageUri,
    name: filename,
    type: type,
  } as any);

  const response = await axiosPrivate.post(
    `/v1.0/business/upload-image/${businessId}`,
    formData,
    {
      params: { _method: "PATCH" },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateBusinessDetails = async (
  businessId: number | string,
  data: IBusinessSettings
) => {
  // Using POST with _method=PATCH as per API hint/convention often seen in some frameworks
  const response = await axiosPrivate.post(
    `/v1.0/business/${businessId}?_method=PATCH`,
    data
  );
  return response.data;
};

// Use this version if the server accepts standard PATCH
export const updateBusinessDetailsStandard = async (
  businessId: number | string,
  data: IBusinessSettings
) => {
  const response = await axiosPrivate.patch(
    `/v1.0/business/${businessId}`,
    data
  );
  return response.data;
};
