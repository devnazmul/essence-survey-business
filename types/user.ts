export interface User {
  id: number;
  first_Name: string;
  last_Name: string;
  email: string;
  phone: string;
  role: "branch_manager" | "business_staff";
  post_code: string;
  Address: string;
  door_no: string;
  business_id: number;
  date_of_birth: string;
  image: string;
  job_title: string;
  join_date: string;
  skills: string;
  created_at: string;
  updated_at: string;
}

export interface UserParams {
  page?: number;
  per_page?: number;
  role?: "branch_manager" | "business_staff";
  search_key?: string;
  without_branch?: boolean | number;
  ignore_id?: number | string;
  order_by?: string;
  sort_order?: "asc" | "desc";
}

export interface UserResponse {
  success: boolean;
  message: string;
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  data: User[];
}
