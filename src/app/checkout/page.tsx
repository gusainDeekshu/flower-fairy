// src/app/checkout/page.tsx
"use client";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { orderService } from "@/services/order.service";       // ADD THIS
import { paymentService } from "@/services/payment.service";   // ADD THIS

export default function CheckoutPage() {
  const { items } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const storeId = items[0]?.storeId || "default-store"; // Safely extract storeId

      // 1. Create Order using existing service
      const order = await orderService.createOrder(storeId);

      // 2. Initiate Payment
      const payRes = await paymentService.initiatePayment(order.id, "STRIPE");
      
      // Axios may nest response inside .data based on your interceptor setup
      const checkoutUrl = payRes?.data?.url || payRes?.data?.checkoutUrl || payRes?.checkoutUrl;

      // 3. Redirect
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        router.push(`/order-success/${order.id}`);
      }
      // ❌ Do NOT call clearCart() here. Wait for successful payment callback.
    } catch (err) {
      console.error("Checkout failed", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order Summary</h1>
      {items.map((item) => (
        <div key={item.productId} className="flex justify-between border-b py-2">
          <span>{item.name} x {item.quantity}</span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}
      <div className="text-xl font-bold mt-4 text-right">Total: ₹{total}</div>
      <Button 
        onClick={handlePlaceOrder} 
        disabled={isProcessing || items.length === 0}
        className="w-full mt-6"
      >
        {isProcessing ? "Processing..." : "Pay & Place Order"}
      </Button>
    </div>
  );
}