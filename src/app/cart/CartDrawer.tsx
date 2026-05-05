// src/components/cart/CartDrawer.tsx
"use client";

import React from "react";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQuantity } = useCartStore();

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      {/* Background Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeCart}
      />

      {/* Right Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-[420px] bg-white shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <ShoppingBag size={20} /> Your Cart
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingBag size={48} className="mb-4 text-gray-300" />
              <p className="font-semibold text-gray-900">Your cart is empty</p>
              <p className="text-sm mt-1">Looks like you haven't added anything yet.</p>
              <Button onClick={closeCart} className="mt-6" variant="outline">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 border-b border-gray-50 pb-4">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <Image src={item.image || "/placeholder.png"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{item.name}</h3>
                      <p className="text-[#009688] font-bold mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={() => item.quantity > 1 ? updateQuantity(item.productId, item.quantity - 1, item.variantId) : removeItem(item.productId, item.variantId)}
                          className="px-2.5 py-1 text-gray-500 hover:bg-gray-50"
                        >-</button>
                        <span className="text-sm font-bold px-2">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="px-2.5 py-1 text-gray-500 hover:bg-gray-50"
                        >+</button>
                      </div>
                      <button onClick={() => removeItem(item.productId, item.variantId)} className="text-xs text-red-500 font-semibold hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-gray-100 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-xl font-black text-gray-900">₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>
            <Link href="/checkout" onClick={closeCart}>
              <Button className="w-full bg-[#009688] hover:bg-[#007A6E] h-14 text-lg font-bold rounded-xl shadow-lg shadow-[#009688]/20 text-white transition-all flex items-center justify-center gap-2">
                PROCEED TO CHECKOUT <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}