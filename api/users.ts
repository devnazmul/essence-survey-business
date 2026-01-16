import { UserParams, UserResponse } from "@/types/user";
import { axiosPrivate } from "@/utils/axiosInstance";
import { getFilterOptimizedObject } from "@/utils/getFilterOptimizedObject";

export const getAllUsers = async (params: UserParams = {}) => {
  const filters = getFilterOptimizedObject(params || {});
  const queryParams = new URLSearchParams(filters as any).toString();
  const response = await axiosPrivate.get<UserResponse>(
    `/v1.0/users?${queryParams}`
  );
  if (response.data?.success) {
    return response.data.data;
  }
  return [];
};
