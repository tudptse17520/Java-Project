export const CONFIG_QUERY_KEYS = {
  all: ["configs"] as const,
  list: (params?: { keyword?: string }) =>
    [...CONFIG_QUERY_KEYS.all, "list", params] as const,
};
