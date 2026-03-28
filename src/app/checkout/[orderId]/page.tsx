// src/app/checkout/[orderId]/page.tsx
"use client";
import { paymentService } from "@/services/payment.service";
import { useEffect, useState } from "react";

export default function CheckoutProcess({ params }: { params: { orderId: string } }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        // Call backend to get payment session (e.g., Stripe Checkout URL)
        const response = await paymentService.initiatePayment(params.orderId, 'STRIPE');
        
        if (response.url) {
          window.location.href = response.url; // Redirect to payment gateway
        }
      } catch (err) {
        console.error("Payment initiation failed", err);
      }
    };

    initiatePayment();
  }, [params.orderId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006044]"></div>
      <p className="mt-4 text-gray-600">Redirecting to secure payment...</p>
    </div>
  );
}