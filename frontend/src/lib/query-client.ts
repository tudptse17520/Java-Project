// ---------------------------------------------
// Query Client
// Cấu hình bộ nhớ đệm (Cache) mặc định của TanStack Query
// ---------------------------------------------

import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Dữ liệu được coi là "tươi" trong 60 giây
        staleTime: 60 * 1000,
        // Cache tồn tại trong 5 phút
        gcTime: 5 * 60 * 1000,
        // Retry 1 lần khi thất bại
        retry: 1,
        // Không refetch khi focus lại tab (giảm tải server)
        refetchOnWindowFocus: false,
      },
      mutations: {
        // Retry 0 lần cho mutations
        retry: 0,
      },
    },
  });
}

// Singleton cho client-side
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: reuse the same query client
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
