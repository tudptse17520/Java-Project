import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionService } from "@/services/session.service";
import { SESSION_QUERY_KEYS } from "../constants/session.constants";
import {
  CheckOutRequest,
  LostTicketRequest,
  OverrideCheckoutRequest,
  PlateValidationRequest,
} from "../types/session.type";

export const useCheckoutActions = () => {
  const queryClient = useQueryClient();

  const validatePlateMutation = useMutation({
    mutationFn: ({
      sessionId,
      request,
    }: {
      sessionId: number;
      request: PlateValidationRequest;
    }) => sessionService.validatePlate(sessionId, request),
  });

  const overrideCheckoutMutation = useMutation({
    mutationFn: ({
      sessionId,
      request,
    }: {
      sessionId: number;
      request: OverrideCheckoutRequest;
    }) => sessionService.overrideCheckout(sessionId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.all });
    },
  });

  const lostTicketMutation = useMutation({
    mutationFn: ({
      sessionId,
      request,
    }: {
      sessionId: number;
      request: LostTicketRequest;
    }) => sessionService.lostTicket(sessionId, request),
  });

  const calculateFeeMutation = useMutation({
    mutationFn: (sessionId: number) => sessionService.calculateFee(sessionId),
  });

  const checkExitGateMutation = useMutation({
    mutationFn: (sessionId: number) => sessionService.checkExitGate(sessionId),
  });

  const checkOutMutation = useMutation({
    mutationFn: ({
      sessionId,
      request,
    }: {
      sessionId: number;
      request: CheckOutRequest;
    }) => sessionService.checkOut(sessionId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.all });
    },
  });

  return {
    validatePlateMutation,
    overrideCheckoutMutation,
    lostTicketMutation,
    calculateFeeMutation,
    checkExitGateMutation,
    checkOutMutation,
  };
};
