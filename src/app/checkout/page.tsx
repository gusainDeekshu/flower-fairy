"use client";

import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { addressService, Address } from "@/services/address.service";
import { shippingService } from "@/services/shipping.service";

export default function CheckoutPage() {
  const { items } = useCartStore();
  const router = useRouter();

  // State Management
  const [isProcessing, setIsProcessing] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  
  // Shipping State
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  // Form State for new address
  const [newAddress, setNewAddress] = useState({
    name: "", phone: "", addressLine: "", city: "", state: "", pincode: ""
  });

  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const grandTotal = cartTotal + shippingCost;
  const storeId = items[0]?.storeId || "default-store";

  // 1. Fetch Addresses on Mount
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await addressService.getUserAddresses();
      setAddresses(data);
      if (data.length > 0) {
        // Auto-select the default or first address
        const defaultAddr = data.find(a => a.isDefault) || data[0];
        setSelectedAddress(defaultAddr);
      } else {
        setShowAddAddressForm(true);
      }
    } catch (error) {
      console.error("Failed to fetch addresses");
    }
  };

  // 2. Trigger Shipping Calculation when Address changes
  useEffect(() => {
    if (selectedAddress && items.length > 0) {
      calculateShipping(selectedAddress.state);
    }
  }, [selectedAddress, items]);

  const calculateShipping = async (state: string) => {
    setIsCalculatingShipping(true);
    try {
      const payload = {
        storeId,
        address: { state },
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        paymentMethod: "PREPAID" as const, // Assume PREPAID for Stripe flow
        cartTotal
      };
      
      const res = await shippingService.calculateShipping(payload);
      setShippingCost(res.shippingCost);
    } catch (error) {
      console.error("Failed to calculate shipping", error);
      setShippingCost(100); // Fallback flat rate if API fails
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await addressService.addAddress(newAddress);
      setAddresses([...addresses, added]);
      setSelectedAddress(added);
      setShowAddAddressForm(false);
    } catch (error) {
      console.error("Failed to add address", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return alert("Please select a delivery address.");
    setIsProcessing(true);
    
    try {
      // ⚠️ UPDATE: Make sure your createOrder API accepts addressId and shippingCost!
      const order = await orderService.createOrder({
        storeId,
        addressId: selectedAddress.id,
        shippingCost: shippingCost
      });

      const payRes = await paymentService.initiatePayment(order.id, "STRIPE");
      const checkoutUrl = payRes?.data?.url || payRes?.data?.checkoutUrl || payRes?.checkoutUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        router.push(`/order-success/${order.id}`);
      }
    } catch (err) {
      console.error("Checkout failed", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return <div className="p-8 text-center">Your cart is empty.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* LEFT COLUMN: Delivery Information */}
      <div>
        <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
        
        {addresses.length > 0 && !showAddAddressForm ? (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div 
                key={addr.id} 
                onClick={() => setSelectedAddress(addr)}
                className={`p-4 border rounded cursor-pointer transition-colors ${
                  selectedAddress?.id === addr.id ? "border-green-600 bg-green-50" : "border-gray-200"
                }`}
              >
                <div className="font-semibold">{addr.name}</div>
                <div className="text-sm text-gray-600">{addr.addressLine}, {addr.city}</div>
                <div className="text-sm text-gray-600">{addr.state} - {addr.pincode}</div>
                <div className="text-sm text-gray-600">Phone: {addr.phone}</div>
              </div>
            ))}
            <Button variant="outline" onClick={() => setShowAddAddressForm(true)}>
              + Add New Address
            </Button>
          </div>
        ) : (
          <form onSubmit={handleAddAddress} className="space-y-3 bg-gray-50 p-4 rounded-lg border">
            <input required placeholder="Full Name" className="w-full p-2 border rounded" onChange={e => setNewAddress({...newAddress, name: e.target.value})} />
            <input required placeholder="Phone Number" className="w-full p-2 border rounded" onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
            <input required placeholder="Address Line" className="w-full p-2 border rounded" onChange={e => setNewAddress({...newAddress, addressLine: e.target.value})} />
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="City" className="w-full p-2 border rounded" onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
              <input required placeholder="State (e.g., Karnataka)" className="w-full p-2 border rounded" onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
            </div>
            <input required placeholder="Pincode" className="w-full p-2 border rounded" onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} />
            <div className="flex gap-2 pt-2">
              <Button type="submit">Save Address</Button>
              {addresses.length > 0 && (
                <Button type="button" variant="ghost" onClick={() => setShowAddAddressForm(false)}>Cancel</Button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* RIGHT COLUMN: Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg border h-fit">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        
        <div className="space-y-3 border-b pb-4 mb-4 text-sm">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between">
              <span className="text-gray-600">{item.name} x {item.quantity}</span>
              <span className="font-medium">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{cartTotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>
              {isCalculatingShipping ? (
                <span className="text-xs text-gray-400">Calculating...</span>
              ) : shippingCost === 0 ? (
                <span className="text-green-600 font-semibold">FREE</span>
              ) : (
                `₹${shippingCost}`
              )}
            </span>
          </div>
        </div>

        <div className="flex justify-between text-xl font-bold pt-4 border-t">
          <span>Total</span>
          <span>₹{grandTotal}</span>
        </div>

        <Button 
          onClick={handlePlaceOrder} 
          disabled={isProcessing || !selectedAddress || isCalculatingShipping}
          className="w-full mt-6 py-6 text-lg"
        >
          {isProcessing ? "Processing..." : `Pay ₹${grandTotal}`}
        </Button>
      </div>

    </div>
  );
}