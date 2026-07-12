import axiosClient from "@/lib/axios-client";
import { Feedback, FeedbackRequest, IssueType, FeedbackStatus } from "../features/feedbacks/types/feedback.type";

// Let's redefine PaginatedResponse here to avoid circular dependency or incorrect imports
export interface PaginatedFeedbackResponse {
  data: Feedback[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const feedbackService = {
  getFeedbacks: async (
    page: number = 1,
    size: number = 10,
    issueType?: IssueType,
    status?: FeedbackStatus
  ): Promise<PaginatedFeedbackResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (issueType && issueType !== "ALL" as any) params.append("issue_type", issueType);
    if (status && status !== "ALL" as any) params.append("status", status);

    const response = await axiosClient.get(`/feedbacks?${params.toString()}`);
    return response.data;
  },

  getFeedbackById: async (id: number): Promise<Feedback> => {
    const response = await axiosClient.get(`/feedbacks/${id}`);
    return response.data;
  },

  createFeedback: async (request: FeedbackRequest): Promise<Feedback> => {
    const response = await axiosClient.post("/feedbacks", request);
    return response.data;
  },

  updateFeedback: async (id: number, request: FeedbackRequest): Promise<Feedback> => {
    const response = await axiosClient.put(`/feedbacks/${id}`, request);
    return response.data;
  },
};
