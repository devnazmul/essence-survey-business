import { axiosPrivate } from "@/utils/axiosInstance";

// ========================
//                        GET APIS
// ========================

export const getAllBranches = async (params: any = {}) => {
  const { signal } = params;

  // Extract only swagger-supported parameters
  const query: any = {};
  if (params.page) query.page = params.page;
  if (params.per_page) query.per_page = params.per_page;
  if (params.search_key) query.search_key = params.search_key;
  if (params.sort_by) query.sort_by = params.sort_by;
  if (params.sort_order) query.sort_order = params.sort_order;

  const response = await axiosPrivate.get("/v1.0/branches", {
    params: query,
    signal,
  });
  return response.data;
};

export const getBranchMetrics = async (
  branchId: number | string,
  params: any = {},
) => {
  const response = await axiosPrivate.get(
    `/v1.0/branches/${branchId}/metrics`,
    { params },
  );
  return response.data;
};

export const getBranchInsights = async (
  branchId: number | string,
  params: any = {},
) => {
  const response = await axiosPrivate.get(
    `/v1.0/branches/${branchId}/ai-insights`,
    { params },
  );
  return response.data;
};

export const getBranchRecommendations = async (
  branchId: number | string,
  params: any = {},
) => {
  const response = await axiosPrivate.get(
    `/v1.0/branches/${branchId}/recommendations`,
    { params },
  );
  return response.data;
};

export const getBranchRecentReviews = async (
  branchId: number | string,
  params: any = {},
) => {
  const response = await axiosPrivate.get(
    `/v1.0/branches/${branchId}/recent-reviews`,
    { params },
  );
  return response.data;
};

export const getBranchStaffPerformance = async (
  branchId: number | string,
  params: any = {},
) => {
  const response = await axiosPrivate.get(
    `/v1.0/branches/${branchId}/staff-performance`,
    { params },
  );
  return response.data;
};

export const getBranchComparison = async (params: any = {}) => {
  const response = await axiosPrivate.get("/v1.0/reports/branch-comparison", {
    params,
  });
  return response.data;
};

export const getSingleBranch = async (id: number | string) => {
  const response = await axiosPrivate.get(`/v1.0/branches/${id}`);
  return response.data;
};

// =========================
//                        POST APIS
// ==========================

export const createBranch = async (data: any) => {
  const response = await axiosPrivate.post("/v1.0/branches", data);
  return response.data;
};

// ==========================
//                        PUT APIS
// ==========================

export const updateBranch = async (id: number | string, data: any) => {
  const response = await axiosPrivate.patch(`/v1.0/branches/${id}`, data);
  return response.data;
};

export const toggleBranch = async (id: number | string) => {
  const response = await axiosPrivate.patch(
    `/v1.0/branches/toggle-status/${id}`,
  );
  return response.data;
};

// =============================
//                        DELETE APIS
// ==============================

export const deleteBranch = async (id: number | string) => {
  const response = await axiosPrivate.delete(`/v1.0/branches/${id}`);
  return response.data;
};
