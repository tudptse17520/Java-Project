export const BROWSE_BUILDING_KEYS = {
  all: ["browse-buildings"] as const,
  lists: () => [...BROWSE_BUILDING_KEYS.all, "list"] as const,
  detail: (id: number) => [...BROWSE_BUILDING_KEYS.all, "detail", id] as const,
};

export const SLOT_AVAILABILITY_EVENT_NAME = "slot-availability";
