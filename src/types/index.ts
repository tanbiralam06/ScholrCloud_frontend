// User types
export interface User {
  id: string;
  email: string;
  role:
    | "super_admin"
    | "school_admin"
    | "principal"
    | "teacher"
    | "accountant"
    | "librarian"
    | "parent"
    | "student";
  schoolId?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// Pagination
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
