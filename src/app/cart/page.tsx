// src/app/cart/page.tsx
"use client";

import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { OtpModal } from "@/components/auth/OtpModal";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/order.service";

export default function CartPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isLoginOpen, setLoginOpen] = useState(false);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const deliveryCharge = subtotal > 999 ? 0 : 99; // Example logic
  const total = subtotal + deliveryCharge;

  // src/app/cart/page.tsx

  const handleCheckout = async () => {
    // 1. If not logged in, open modal
    if (!user) {
      setLoginOpen(true);
      return;
    }

    // 2. 🔥 The Fix: Get the FRESH items directly from the store state
    // This ensures that if syncCart just finished, we see the new items.
    const currentItems = useCartStore.getState().items;

    console.log("Fresh Cart Items for Checkout:", currentItems);

    if (!currentItems || currentItems.length === 0) {
      console.error("Cart is empty. Cannot proceed to checkout.");
      return;
    }

    const storeId = currentItems[0]?.storeId;

    if (!storeId) {
      console.error("No store information found in cart items");
      return;
    }

    try {
      setIsProcessing(true);
      const order = await orderService.createOrder(storeId);

      // Clear local cart ONLY after backend order is confirmed
      clearCart();
      router.push(`/checkout/${order.id}`);
    } catch (error) {
      console.error("Order creation failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingBag size={80} className="text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">
          Add some beautiful flowers to get started!
        </p>
        <Link href="/">
          <Button className="bg-[#006044] hover:bg-[#004d3d]">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-black text-gray-800 mb-6">
          Shopping Cart ({items.length})
        </h1>

        {items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-black text-[#006044]">₹{item.price}</span>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-1">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        Math.max(1, item.quantity - 1),
                      )
                    }
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md sticky top-28">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm border-b pb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charges</span>
              <span>
                {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
              </span>
            </div>
          </div>
          <div className="flex justify-between font-black text-lg py-4">
            <span>Total Amount</span>
            <span className="text-[#006044]">₹{total}</span>
          </div>

          <Button
            onClick={handleCheckout}
            className="w-full bg-[#006044] hover:bg-[#004d3d] h-12 text-lg font-bold rounded-xl"
          >
            {user ? "Place Order" : "Login to Checkout"}
          </Button>

          <p className="text-[10px] text-gray-400 text-center mt-4">
            Safe and Secure Payments. Easy returns. 100% Authentic products.
          </p>
        </div>
      </div>

      <OtpModal
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => {
          setLoginOpen(false);
          // 🔥 Re-trigger checkout now that we are logged in and synced
          handleCheckout();
        }}
      />
    </div>
  );
}
