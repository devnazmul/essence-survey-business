import { axiosPrivate } from "@/utils/axiosInstance";

export const getNotification = async ({
  page,
  perPage,
  status,
}: {
  page: string | number;
  perPage: string | number;
  status?: string;
}) => {
  const url = `/v1.0/notification?page=${page}&perPage=${perPage}${status ? `&status=${status}` : ""}`;
  const response = await axiosPrivate.get(url);
  return response.data;
};

export const updateNotification = async (
  notificationId: string | number,
  data: { status?: string; message?: string }
) => {
  const response = await axiosPrivate.patch(
    `/v1.0/notification/${notificationId}`,
    data
  );
  return response.data;
};
