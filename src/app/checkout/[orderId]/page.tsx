// src/app/checkout/[orderId]/page.tsx
"use client";
import { paymentService } from "@/services/payment.service";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutProcess({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = React.use(params);
  const orderId = resolvedParams.orderId;
  const router = useRouter();
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    let isMounted = true; 

    const initiate = async () => {
      try {
        console.log(`Initiating payment for Order: ${orderId}`); 
        
        const responseData = await paymentService.initiatePayment(orderId);
        
        if (!isMounted) return;

        console.log("Raw API Response:", responseData); 

        // ✅ CRITICAL FIX: Safely unwrap the payload if NestJS/Axios nested it inside '.data'
        const payload = responseData?.data || responseData?.result || responseData;

        console.log("Unwrapped Payment Payload:", payload);

        // 1. Handle PayU Explicitly (Form Auto-Submit)
        if (payload?.provider === "PAYU" && payload?.formPayload) {
          const formPayload = payload.formPayload;
          const form = document.createElement("form");
          form.method = "POST";
          form.action = formPayload.actionUrl;

          Object.keys(formPayload).forEach((key) => {
            if (key !== "actionUrl") {
              const hiddenField = document.createElement("input");
              hiddenField.type = "hidden";
              hiddenField.name = key;
              hiddenField.value = formPayload[key];
              form.appendChild(hiddenField);
            }
          });

          document.body.appendChild(form);
          form.submit(); // Automatically redirects user to PayU
          return;
        }

        // 2. Handle Stripe / Razorpay / PhonePe (URL Redirect)
        const checkoutUrl = payload?.url || payload?.checkoutUrl;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }

        // If we reach here, the backend returned success but the structure is completely unrecognized
        throw new Error("Invalid payment gateway response: Missing redirect URL.");

      } catch (err: any) {
        console.error("Payment initiation failed:", err);
        if (isMounted) {
          setError(
            err.response?.data?.message || 
            err.message || 
            "Failed to securely connect to the payment gateway."
          );
        }
      }
    };

    initiate();
    
    return () => { isMounted = false; };
  }, [orderId]);

  // Safe Fallback UI if payment fails
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h2>
        <p className="text-gray-600 mb-8 max-w-md">{error}</p>
        <button 
          onClick={() => router.push('/checkout')} 
          className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
        >
          Return to Checkout
        </button>
      </div>
    );
  }

  // Original Loader
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006044]"></div>
      <p className="mt-4 text-gray-600 font-medium">Redirecting to secure payment...</p>
    </div>
  );
}