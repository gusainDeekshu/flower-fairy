// src/types/payment.ts

export type PaymentFlowType = 'REDIRECT' | 'FORM' | 'NONE';

export interface PaymentInitiateResponse {
  provider: string;           // 'PAYU', 'STRIPE', 'RAZORPAY', 'COD'
  flow: PaymentFlowType;      // The instruction for the frontend
  url?: string;               // Target URL for redirect or form POST
  method?: 'GET' | 'POST';    // Form method
  params?: Record<string, any>; // The hidden inputs for PayU
  message?: string;
  formPayload?: any;          // Catch the raw backend payload if needed
}