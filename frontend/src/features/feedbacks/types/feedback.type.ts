export type IssueType = "LOST_TICKET" | "WRONG_PLATE" | "OVERTIME" | "WRONG_PLACE" | "UNPAID_EXIT";

export type FeedbackStatus = "REPORTED" | "PROCESSING" | "RESOLVED";

export interface Feedback {
  id: number;
  parkingSessionId: number;
  issueType: IssueType;
  description: string;
  status: FeedbackStatus;
}

export interface FeedbackRequest {
  parkingSessionId: number;
  issueType: IssueType;
  description: string;
  status: FeedbackStatus;
}
