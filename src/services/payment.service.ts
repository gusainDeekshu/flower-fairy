// src/services/payment.service.ts
import { apiClient } from "@/lib/api-client";

export const paymentService = {
  /**
   * Initialize a payment session/intent with the backend
   */
  async initiatePayment(sessionId: string, preferredProvider?: string) {
    try {
      // 🔥 Changed orderId to sessionId to match the backend controller
      const payload: { sessionId: string; provider?: string } = { sessionId };

      if (preferredProvider) {
        payload.provider = preferredProvider;
      }

      const response = await apiClient.post("/payments/initiate", payload);
      return response;
    } catch (error) {
      console.error("Payment Initiation Error:", error);
      throw error;
    }
  },

  /**
   * Verify a payment signature after successful gateway transaction
   */
  async verifyPayment(verificationData: any) {
    try {
      const response = await apiClient.post(
        "/payments/verify",
        verificationData,
      );
      return response;
    } catch (error) {
      console.error("Payment Verification Error:", error);
      throw error;
    }
  },

  /**
   * Get payment status for a specific order
   */
  async getPaymentStatus(orderId: string) {
    try {
      const response = await apiClient.get(`/payments/status/${orderId}`);
      return response;
    } catch (error) {
      console.error("Fetch Payment Status Error:", error);
      throw error;
    }
  },
};
