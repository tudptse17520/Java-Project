// ---------------------------------------------
// Issue Type Constants
// Phân loại sự cố phát sinh tại bãi xe
// ---------------------------------------------

export enum IssueType {
  LOST_TICKET = "LOST_TICKET",
  WRONG_PLATE = "WRONG_PLATE",
  OVERTIME = "OVERTIME",
  WRONG_PLACE = "WRONG_PLACE",
  UNPAID_EXIT = "UNPAID_EXIT",
}

export const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
  [IssueType.LOST_TICKET]: "Mất vé/thẻ xe",
  [IssueType.WRONG_PLATE]: "Sai biển số",
  [IssueType.OVERTIME]: "Quá giờ gửi",
  [IssueType.WRONG_PLACE]: "Gửi sai khu vực",
  [IssueType.UNPAID_EXIT]: "Ra bãi chưa thanh toán",
};
