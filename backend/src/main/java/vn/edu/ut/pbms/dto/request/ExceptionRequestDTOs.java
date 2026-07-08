package vn.edu.ut.pbms.dto.request;

import lombok.Data;

public class ExceptionRequestDTOs {

    @Data
    public static class LostTicketRequest {
        private Long staffId;
        private String note;
    }

    @Data
    public static class CheckoutRequest {
        private String plateOut;
        private String plateOutImage;
    }

    @Data
    public static class OverrideCheckoutRequest {
        private Long staffId;
        private String overrideReason;
    }

    @Data
    public static class ViolationRequest {
        private Long sessionId;
        private Long expectedFloorId;
        private Long actualFloorId;
        private String evidenceImage;
    }
}