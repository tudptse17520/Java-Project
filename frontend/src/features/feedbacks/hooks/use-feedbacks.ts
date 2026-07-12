import { useQuery } from "@tanstack/react-query";
import { feedbackService } from "@/services/feedback.service";
import { IssueType, FeedbackStatus } from "../types/feedback.type";

export const FEEDBACK_QUERY_KEYS = {
  all: ["feedbacks"] as const,
  list: (page: number, size: number, issueType?: IssueType, status?: FeedbackStatus) => 
    [...FEEDBACK_QUERY_KEYS.all, "list", page, size, issueType, status] as const,
  detail: (id: number) => [...FEEDBACK_QUERY_KEYS.all, "detail", id] as const,
};

export function useFeedbacks(page: number, size: number, issueType?: IssueType, status?: FeedbackStatus) {
  return useQuery({
    queryKey: FEEDBACK_QUERY_KEYS.list(page, size, issueType, status),
    queryFn: () => feedbackService.getFeedbacks(page, size, issueType, status),
  });
}
