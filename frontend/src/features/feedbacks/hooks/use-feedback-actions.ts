import { useMutation, useQueryClient } from "@tanstack/react-query";
import { feedbackService } from "@/services/feedback.service";
import { FeedbackRequest } from "../types/feedback.type";
import { FEEDBACK_QUERY_KEYS } from "./use-feedbacks";

export function useFeedbackActions() {
  const queryClient = useQueryClient();

  const createFeedbackMutation = useMutation({
    mutationFn: (request: FeedbackRequest) => feedbackService.createFeedback(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.all });
    },
  });

  const updateFeedbackMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: FeedbackRequest }) =>
      feedbackService.updateFeedback(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.all });
    },
  });

  return {
    createFeedbackMutation,
    updateFeedbackMutation,
  };
}
