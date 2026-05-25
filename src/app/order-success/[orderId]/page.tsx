"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Loader2,
  XCircle,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";

import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

import { apiClient } from "@/lib/api-client";
import { useCartStore } from "@/store/useCartStore";

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

type PaymentState = "loading" | "pending" | "success" | "failed" | "error";

export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);

  // =========================================================
  // WINDOW SIZE FOR CONFETTI
  // =========================================================
  const { width, height } = useWindowSize();

  const [isClient, setIsClient] = useState(false);

  // =========================================================
  // STATES
  // =========================================================
  const [status, setStatus] = useState<PaymentState>("loading");

  const [order, setOrder] = useState<OrderData | null>(null);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [retryCount, setRetryCount] = useState(0);

  // =========================================================
  // CLIENT CHECK
  // =========================================================
  useEffect(() => {
    setIsClient(true);
  }, []);

  // =========================================================
  // PAYMENT POLLING
  // =========================================================
  useEffect(() => {
    if (!orderId) return;

    let isMounted = true;
    let timerId: NodeJS.Timeout;

    const MAX_RETRIES = 5;

    const checkPaymentStatus = async () => {
      try {
        console.log(`[Payment Polling] Checking payment status for ${orderId}`);

        const verifyRes = await apiClient.get(
          `/payments/verify?orderId=${orderId}`,
        );

        const verifyData = verifyRes.data;

        console.log("[Payment Verify Response]", verifyData);

        // =========================================================
        // SUCCESS
        // =========================================================
        if (verifyData.status === "SUCCESS" || verifyData.status === "PAID") {
          const orderRes = await apiClient.get(`/orders/${orderId}`);

          if (isMounted) {
            setOrder(orderRes.data);

            setStatus("success");

            // Clear frontend cart
            useCartStore.getState().clearCart();
          }

          return;
        }

        // =========================================================
        // FAILED
        // =========================================================
        if (
          verifyData.status === "FAILED" ||
          verifyData.status === "CANCELLED"
        ) {
          if (isMounted) {
            setStatus("failed");

            setErrorMessage(
              verifyData.message || "Payment failed or cancelled.",
            );
          }

          return;
        }

        // =========================================================
        // PENDING
        // =========================================================
        if (isMounted) {
          setStatus("pending");

          // Retry protection
          if (retryCount >= MAX_RETRIES) {
            setStatus("error");

            setErrorMessage(
              "Payment confirmation is taking longer than expected. Please check your orders page.",
            );

            return;
          }

          timerId = setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            checkPaymentStatus();
          }, 3000);
        }
      } catch (error: any) {
        console.error("Payment verification polling error:", error);

        // =========================================================
        // NETWORK/API FAILURE
        // =========================================================
        if (isMounted) {
          if (retryCount >= MAX_RETRIES) {
            setStatus("error");

            setErrorMessage(
              error?.response?.data?.message ||
                "Unable to verify payment right now. Please check your order history.",
            );

            return;
          }

          timerId = setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            checkPaymentStatus();
          }, 3000);
        }
      }
    };

    checkPaymentStatus();

    return () => {
      isMounted = false;

      clearTimeout(timerId);
    };
  }, [orderId, retryCount]);

  // =========================================================
  // LOADING / PENDING
  // =========================================================
  if (status === "loading" || status === "pending") {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <div className="bg-white max-w-[500px] w-full rounded-2xl shadow-sm p-10 flex flex-col items-center text-center">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />

          <h1 className="text-xl font-semibold text-gray-900">
            Confirming your order...
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Please do not close or refresh this page.
          </p>

          <div className="mt-6 text-xs text-gray-400">
            Attempt {retryCount + 1} of 15
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // FAILED STATE
  // =========================================================
  if (status === "failed") {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <div className="bg-white max-w-[500px] w-full rounded-2xl shadow-sm p-10 flex flex-col items-center text-center">
          <XCircle className="w-16 h-16 text-red-500 mb-6" />

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>

          <p className="text-gray-500 mb-3">
            We couldn't process your payment.
          </p>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6 w-full">
              {errorMessage}
            </div>
          )}

          <p className="text-gray-500 text-sm mb-8">
            If money was deducted, it will usually be refunded automatically
            within 5-7 business days.
          </p>

          <div className="w-full flex flex-col gap-3">
            <Link
              href="/checkout"
              className="w-full py-3.5 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Try Again
            </Link>

            <Link
              href="/orders"
              className="w-full py-3.5 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================
  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <div className="bg-white max-w-[520px] w-full rounded-2xl shadow-sm p-10 flex flex-col items-center text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mb-6" />

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Verification Delayed
          </h1>

          <p className="text-gray-600 mb-4 leading-relaxed">
            Your payment may still be processing. We could not confirm the final
            payment status right now.
          </p>

          {errorMessage && (
            <div className="w-full bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-sm mb-6">
              {errorMessage}
            </div>
          )}

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-left text-sm text-gray-600 w-full mb-8">
            <div className="font-semibold text-gray-900 mb-2">
              What you can do:
            </div>

            <ul className="space-y-2 list-disc pl-5">
              <li>Check your Orders page</li>
              <li>Wait 1-2 minutes and refresh</li>
              <li>Avoid making duplicate payments</li>
              <li>Contact support if payment was deducted</li>
            </ul>
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3.5 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Retry Verification
            </button>

            <Link
              href="/orders"
              className="w-full py-3.5 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Go to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // SUCCESS STATE
  // =========================================================
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* =========================================================
          CONFETTI
      ========================================================= */}
      {isClient && status === "success" && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={400}
            gravity={0.15}
          />
        </div>
      )}

      <div className="bg-white max-w-[500px] w-full rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 relative z-10">
        {/* =========================================================
            SUCCESS HEADER
        ========================================================= */}
        <div className="flex flex-col items-center text-center">
          <CheckCircle2
            className="w-16 h-16 text-[#22c55e] mb-2"
            strokeWidth={2}
          />

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 tracking-tight">
            Thank you for your purchase
          </h1>

          <p className="text-gray-500 mt-3 text-sm md:text-base leading-relaxed">
            We've received your order and will ship in 5-7 business days.
            <br />
            Your order number is{" "}
            <span className="font-semibold text-gray-900">#{orderId}</span>
          </p>
        </div>

        {/* =========================================================
            ORDER SUMMARY
        ========================================================= */}
        <div className="mt-8 border border-gray-100 rounded-2xl p-5 md:p-6 bg-[#fafafa]">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">
            Order Summary
          </h2>

          <div className="space-y-4">
            {order?.items?.map((item, index) => {
              console.log("Order Item Image:", item.image);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
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

                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-gray-900 text-sm">
                        {item.name}
                      </span>

                      {item.description && (
                        <span className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="font-semibold text-gray-900 text-sm">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* =========================================================
              TOTAL
          ========================================================= */}
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-200">
            <span className="font-bold text-gray-900">Total</span>

            <span className="font-bold text-xl text-gray-900">
              ₹{(order?.totalAmount || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* =========================================================
            ACTIONS
        ========================================================= */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/orders"
            className="flex items-center justify-center w-full py-4 px-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200"
          >
            View My Orders
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center w-full py-4 px-4 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
