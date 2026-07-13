export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    order?: "asc" | "desc";
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}