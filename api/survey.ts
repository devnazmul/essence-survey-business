import { axiosPrivate } from "@/utils/axiosInstance";

export interface ISurvey {
  id: number;
  business_id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const getSurveys = async (businessId: number | string) => {
  const response = await axiosPrivate.get(`/v1.0/surveys/${businessId}`);
  if (response.data?.success) {
    return response.data.data as ISurvey[];
  }
  return [];
};
