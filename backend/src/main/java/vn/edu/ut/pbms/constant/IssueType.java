package vn.edu.ut.pbms.constant;

/**
 * Loại sự cố trong Feedback.
 * LOST_TICKET = mất thẻ, WRONG_PLATE = sai biển số,
 * OVERTIME = quá giờ, WRONG_PLACE = đỗ sai chỗ, UNPAID_EXIT = ra bãi không thanh toán.
 */
public enum IssueType {
    LOST_TICKET,
    WRONG_PLATE,
    OVERTIME,
    WRONG_PLACE,
    UNPAID_EXIT
}
