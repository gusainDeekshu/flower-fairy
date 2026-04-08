"use client";

import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { OtpModal } from "@/components/auth/OtpModal";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AddressDrawer } from "@/components/checkout/AddressDrawer";
import { addressService, Address } from "@/services/address.service";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem } = useCartStore();
  const { user } = useAuthStore();
  
  // States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Preliminary calculation for cart view
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const estimatedDelivery = subtotal > 999 ? 0 : 99; 
  const total = subtotal + estimatedDelivery;

  // Intercepting the "Place Order" click
  const initiateCheckoutProcess = async () => {
    // 1. Check Auth
    if (!user) {
      setLoginOpen(true);
      return;
    }

    const currentItems = useCartStore.getState().items;
    if (!currentItems || currentItems.length === 0) return;
    
    try {
      setIsProcessing(true);
      
      // 2. Check if user already has an address
      const addresses = await addressService.getUserAddresses();
      
      if (addresses.length === 0) {
        // 3. If no address, open the right-side sliding drawer
        setDrawerOpen(true);
      } else {
        // 4. If address exists, proceed directly to the checkout summary page
        router.push('/checkout');
      }
      
    } catch (error) {
      console.error("Failed to check addresses:", error);
      // Fallback: route to checkout where they can add it via the form
      router.push('/checkout'); 
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddressSavedFromDrawer = (newAddress: Address) => {
    // Once the user successfully saves an address in the drawer,
    // close it and push them to the final checkout page.
    setDrawerOpen(false);
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingBag size={80} className="text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some beautiful flowers to get started!</p>
        <Link href="/">
          <Button className="bg-[#006044] hover:bg-[#004d3d]">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-black text-gray-800 mb-6">
          Shopping Cart ({items.length})
        </h1>

        {items.map((item) => (
          <div key={item.productId} className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <button onClick={() => removeItem(item.productId)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-black text-[#006044]">₹{item.price}</span>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-1">
                  <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}>
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
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
              <span>Est. Delivery Charges</span>
              <span>{estimatedDelivery === 0 ? "FREE" : `₹${estimatedDelivery}`}</span>
            </div>
          </div>
          <div className="flex justify-between font-black text-lg py-4">
            <span>Total Amount</span>
            <span className="text-[#006044]">₹{total}</span>
          </div>

          <Button
            onClick={initiateCheckoutProcess}
            disabled={isProcessing}
            className="w-full bg-[#006044] hover:bg-[#004d3d] h-12 text-lg font-bold rounded-xl disabled:opacity-70"
          >
            {isProcessing ? "Loading..." : (user ? "Place Order" : "Login to Checkout")}
          </Button>

          <p className="text-[10px] text-gray-400 text-center mt-4">
            Safe and Secure Payments. Easy returns. 100% Authentic products.
          </p>
        </div>
      </div>

      {/* Modals & Drawers */}
      <OtpModal
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => {
          setLoginOpen(false);
          initiateCheckoutProcess(); // Re-trigger flow after successful login
        }}
      />

      <AddressDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        onAddressSelect={handleAddressSavedFromDrawer} 
      />
    </div>
  );
}