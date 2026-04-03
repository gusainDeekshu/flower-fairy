"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
// 1. Import Confetti and Window Size Hook
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { apiClient } from "@/lib/api-client";

interface OrderItem {
  name: string;
  description?: string;
  image?: string;
  price: number;
}

interface OrderData {
  id: string;
  items: OrderItem[];
  totalAmount: number;
}

export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);

  // 2. Setup Window Size & Client Check for Confetti
  const { width, height } = useWindowSize();
  const [isClient, setIsClient] = useState(false);

  const [status, setStatus] = useState<"loading" | "pending" | "success" | "failed">("loading");
  const [order, setOrder] = useState<OrderData | null>(null);

  // Mark when component is safely mounted on the client browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Polling Logic
  useEffect(() => {
    if (!orderId) return;

    let isMounted = true;
    let timerId: NodeJS.Timeout;


  const checkPaymentStatus = async () => {
  try {
    // 1. Verify Payment Status using Axios (apiClient)
    const verifyRes = await apiClient.get(`/payments/verify?orderId=${orderId}`);
    
    // AXIOS FIX: The response body is automatically parsed and attached to the .data property
    const verifyData = verifyRes.data;

    if (verifyData.status === "SUCCESS" || verifyData.status === "PAID") {
      // 2. Fetch order details using Axios
      const orderRes = await apiClient.get(`/orders/${orderId}`);
      
      // AXIOS FIX: Get the data property directly
      const orderData = orderRes.data;

      if (isMounted) {
        setOrder(orderData);
        setStatus("success");
      }
      return; 
    }

    if (verifyData.status === "FAILED") {
      if (isMounted) setStatus("failed");
      return; 
    }

    if (isMounted) {
      setStatus("pending");
      timerId = setTimeout(checkPaymentStatus, 3000);
    }
  } catch (error) {
    console.error("Payment verification polling error:", error);
    if (isMounted) {
      timerId = setTimeout(checkPaymentStatus, 3000);
    }
  }
};

    checkPaymentStatus();

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [orderId]);

  // ------------------------------------
  // UI: LOADING / PENDING STATE
  // ------------------------------------
  if (status === "loading" || status === "pending") {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <div className="bg-white max-w-[500px] w-full rounded-2xl shadow-sm p-10 flex flex-col items-center text-center">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
          <h1 className="text-xl font-semibold text-gray-900">Confirming your payment...</h1>
          <p className="text-gray-500 mt-2 text-sm">Please do not close or refresh this page.</p>
        </div>
      </div>
    );
  }

  // ------------------------------------
  // UI: FAILED STATE
  // ------------------------------------
  if (status === "failed") {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <div className="bg-white max-w-[500px] w-full rounded-2xl shadow-sm p-10 flex flex-col items-center text-center">
          <XCircle className="w-16 h-16 text-red-500 mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-500 mb-8">We couldn't process your payment. If money was deducted, it will be refunded shortly.</p>
          <Link 
            href="/checkout"
            className="w-full py-3.5 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  // ------------------------------------
  // UI: SUCCESS STATE (With Confetti)
  // ------------------------------------
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* 3. Render Confetti ONLY on the Client and ONLY on Success */}
      {isClient && status === "success" && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          <Confetti 
            width={width} 
            height={height} 
            recycle={false} // Stops dropping after a few seconds so it doesn't get annoying
            numberOfPieces={400} 
            gravity={0.15}
          />
        </div>
      )}

      <div className="bg-white max-w-[500px] w-full rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 relative z-10">
        
        {/* Top Section */}
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="w-16 h-16 text-[#22c55e] mb-2" strokeWidth={2} />
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 tracking-tight">
            Thank you for your purchase
          </h1>
          
          <p className="text-gray-500 mt-3 text-sm md:text-base leading-relaxed">
            We've received your order and will ship in 5-7 business days. <br />
            Your order number is <span className="font-semibold text-gray-900">#{orderId}</span>
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="mt-8 border border-gray-100 rounded-2xl p-5 md:p-6 bg-[#fafafa]">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">
            Order Summary
          </h2>

          <div className="space-y-4">
            {order?.items?.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  {/* Product Image Square */}
                  <div className="w-14 h-14 bg-white rounded-xl border border-gray-200 flex-shrink-0 relative overflow-hidden">
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                        sizes="56px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-gray-900 text-sm">{item.name}</span>
                    {item.description && (
                      <span className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <span className="font-semibold text-gray-900 text-sm">
                  ₹{item.price.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Total Section */}
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-200">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-xl text-gray-900">
              ₹{(order?.totalAmount || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link 
          href="/" 
          className="mt-8 flex items-center justify-center w-full py-4 px-4 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all duration-200"
        >
          Back to Home
        </Link>

      </div>
    </div>
  );
}