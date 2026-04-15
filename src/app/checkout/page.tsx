// src\app\checkout\page.tsx
"use client";

import { useCartStore } from "@/store/useCartStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { orderService } from "@/services/order.service";
import { paymentService } from "@/services/payment.service";
import { addressService, Address } from "@/services/address.service";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2, TruckIcon, Truck } from "lucide-react";
import { PaymentInitiateResponse } from "@/types/payment";
import { executePaymentFlow } from "@/lib/payment-handler";

interface CourierOption {
  courier_id: string;
  courier_name: string;
  rate: number;
  etd: string;
}

export default function CheckoutPage() {
  const { items } = useCartStore();
  const router = useRouter();
  const searchParams = useSearchParams(); // 🔥 Add this
  // --- 🔥 NEW: Listen for Payment Redirect Errors ---
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const reasonParam = searchParams.get("reason");

    if (errorParam) {
      // 1. Show the appropriate error message
      if (errorParam === "payment_failed") {
        toast.error("Payment failed or was cancelled. Please try again.");
      } else if (errorParam === "hash_mismatch") {
        toast.error(
          `Security validation failed: ${reasonParam || "Contact support"}`,
        );
      } else {
        toast.error("An error occurred during checkout.");
      }

      // 2. Clean up the URL so the error doesn't keep showing on refresh
      // This removes the ?error=... from the browser address bar silently
      router.replace("/checkout", { scroll: false });
    }
  }, [searchParams, router]);
  // --- State Management ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  // --- Shipping State (Updated for Courier Selection) ---
  const [courierOptions, setCourierOptions] = useState<CourierOption[]>([]);
  const [selectedCourierId, setSelectedCourierId] = useState<string | null>(
    null,
  );
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  // --- Form State ---
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    label: "Home",
    isDefault: false,
  });

  // Ref for debouncing shipping API calls
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const cartTotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  // Calculate weight for Shiprocket (fallback to 0.5kg per item if missing)
  const totalWeight = items.reduce(
    (acc, item) =>
      acc + ((item as any).shippingWeightKg || 0.5) * item.quantity,
    0,
  );
  const grandTotal = cartTotal + shippingCost;
  const storeId = items[0]?.storeId || "default-store";

  // --- Load Addresses ---
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await addressService.getUserAddresses();
      setAddresses(data);

      if (data.length > 0) {
        const defaultAddr = data.find((a) => a.isDefault) || data[0];
        setSelectedAddress(defaultAddr);
      } else {
        setShowAddAddressForm(true);
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
      toast.error("Failed to load addresses");
    }
  };

  // --- Shipping Calculation (Debounced) ---
  useEffect(() => {
    if (selectedAddress && items.length > 0) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        fetchShippingEstimates(selectedAddress.pincode);
      }, 500);
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [selectedAddress, items]);

  const fetchShippingEstimates = async (deliveryPincode: string) => {
    // ✅ VALIDATION GUARD: Stop if Pincode is not exactly 6 digits
    if (!/^[1-9][0-9]{5}$/.test(deliveryPincode)) {
      console.warn("Invalid Pincode detected. Skipping shipping calculation.");
      setShippingError("Invalid Pincode. Please update your address.");
      return;
    }
    setIsCalculatingShipping(true);
    setShippingError(null);
    setCourierOptions([]);
    setShippingCost(0);
    setSelectedCourierId(null);

    try {
      // Call the new estimation endpoint
      const { data } = await apiClient.post("/shipping/estimate", {
        pickup_pincode: "560001", // Replace with your actual warehouse pincode
        delivery_pincode: deliveryPincode,
        weight: totalWeight,
        cod: 0,
      });

      if (data.options && data.options.length > 0) {
        // Sort options by cheapest rate
        const sortedOptions = [...data.options].sort((a, b) => a.rate - b.rate);
        setCourierOptions(sortedOptions);

        // Auto-select the cheapest option
        handleCourierSelect(sortedOptions[0]);
        // toast.success("Delivery options updated");
      } else {
        setShippingError("Delivery is not available for this pincode.");
      }
    } catch (error: any) {
      console.error("Shipping error", error);
      const msg =
        error.response?.data?.message ||
        `Failed to fetch delivery options for ${deliveryPincode}`;
      setShippingError(msg);
      toast.error(msg);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleCourierSelect = (option: CourierOption) => {
    setSelectedCourierId(option.courier_id);
    setShippingCost(option.rate);
  };

  // --- Add Address ---
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Strict Validation Checks
    const isPhoneValid = /^[6-9]\d{9}$/.test(newAddress.phone);
    const isPincodeValid = /^[1-9][0-9]{5}$/.test(newAddress.pincode);

    if (!isPhoneValid) {
      toast.error("Invalid mobile number (must start with 6-9)");
      return;
    }

    if (!isPincodeValid) {
      toast.error("Please enter a valid 6-digit Pincode");
      return;
    }

    try {
      const added = await addressService.addAddress({
        ...newAddress,
        // Map firstName/lastName to 'name' as expected by backend DTO
        name: `${newAddress.firstName} ${newAddress.lastName}`.trim(),
        label: newAddress.label.toUpperCase() as "HOME" | "WORK" | "OTHER",
      });

      setAddresses([...addresses, added]);
      setSelectedAddress(added);
      setShowAddAddressForm(false);
      toast.success("Address saved!");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message?.[0] ||
        error?.response?.data?.message ||
        "Failed to add address";

      toast.error(msg);
    }
  };

  // --- Place Order & Trigger Payment ---
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!selectedCourierId) {
      toast.error("Please select a delivery method");
      return;
    }

    if (isCalculatingShipping) {
      toast.error("Please wait while shipping is calculated");
      return;
    }

    if (shippingError) {
      toast.error("Please resolve shipping errors before proceeding");
      return;
    }

    const currentItems = useCartStore.getState().items;

    if (!currentItems || currentItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const currentStoreId = currentItems[0]?.storeId;

    if (!currentStoreId) {
      toast.error("Store info missing");
      return;
    }

    setIsProcessing(true);

    try {
     const toastId = toast.loading("Initializing secure payment...");

      // 1. Create CheckoutSession (NOT an Order)
      // This locks in the intent to pay but does not finalize anything in the DB
      const sessionRes = await apiClient.post("/checkout/session", {
        storeId: currentStoreId,
        addressId: selectedAddress.id,
        shippingCost: shippingCost.toString(),
        courierId: selectedCourierId,
      });

      const session = sessionRes.data;

      // ❌ FATAL BUG REMOVED: Do NOT call clearCart() here anymore!
      // The cart remains intact until the webhook confirms success.

      // 2. Fetch the payment initiation data using the SESSION ID
      const payRes = await paymentService.initiatePayment(session.id);
      const responseData: PaymentInitiateResponse = payRes?.data || payRes;

      console.log("BACKEND PAYLOAD:", responseData);
// ✅ Dismiss loader BEFORE redirecting
  toast.dismiss(toastId);

      // 3. Delegate routing (passing the session.id so the frontend tracks it)
      executePaymentFlow(responseData, session.id, router);
    } catch (err: any) {
      console.error(err);
      // ❌ ALWAYS dismiss loader on error
      toast.dismiss();

      const msg =
        err?.response?.data?.message || err?.message || "Checkout failed";
      toast.error(msg);
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 font-medium mt-10">
        Your cart is empty. Please add items to proceed.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* LEFT: Address Selection */}
      <div>
        <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

        {addresses.length > 0 && !showAddAddressForm ? (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddress(addr)}
                className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                  selectedAddress?.id === addr.id
                    ? "border-[#006044] bg-[#006044]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold">{addr.name}</div>
                <div className="text-sm text-gray-600">
                  {addr.addressLine}, {addr.city}
                </div>
                <div className="text-sm text-gray-600">
                  {addr.state} - {addr.pincode}
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full mt-4 border-dashed"
              onClick={() => setShowAddAddressForm(true)}
            >
              + Add New Address
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleAddAddress}
            className="space-y-3 bg-white p-6 rounded-xl border border-gray-100"
          >
            <div className="grid grid-cols-2 gap-3">
              <input
                className="p-2 border rounded-md w-full"
                placeholder="First Name"
                required
                onChange={(e) =>
                  setNewAddress({ ...newAddress, firstName: e.target.value })
                }
              />
              <input
                className="p-2 border rounded-md w-full"
                placeholder="Last Name"
                required
                onChange={(e) =>
                  setNewAddress({ ...newAddress, lastName: e.target.value })
                }
              />
            </div>
            <input
              className="p-2 border rounded-md w-full"
              placeholder="Email"
              type="email"
              required
              onChange={(e) =>
                setNewAddress({ ...newAddress, email: e.target.value })
              }
            />
            {/* Phone Number Input */}
            <div className="relative">
              <input
                className={`p-2 border rounded-md w-full focus:ring-2 focus:ring-[#006044] transition-all ${
                  newAddress.phone && !/^[6-9]\d{9}$/.test(newAddress.phone)
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="10-digit Phone Number"
                type="tel"
                maxLength={10}
                required
                value={newAddress.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, ""); // Remove non-digits
                  setNewAddress({ ...newAddress, phone: val });
                }}
              />
              {newAddress.phone && !/^[6-9]\d{9}$/.test(newAddress.phone) && (
                <p className="text-[10px] text-red-500 mt-1">
                  Must be 10 digits starting with 6-9
                </p>
              )}
            </div>

            <input
              className="p-2 border rounded-md w-full"
              placeholder="Address Line"
              required
              onChange={(e) =>
                setNewAddress({ ...newAddress, addressLine: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="p-2 border rounded-md w-full"
                placeholder="City"
                required
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
              />
              <input
                className="p-2 border rounded-md w-full"
                placeholder="State"
                required
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
              />
            </div>
            {/* Pincode Input */}
            <div className="relative">
              <input
                type="text"
                className="p-2 border rounded-md w-full focus:ring-2 focus:ring-[#006044]"
                placeholder="6-digit Pincode"
                maxLength={6}
                required
                value={newAddress.pincode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, ""); // Allow only digits
                  setNewAddress({ ...newAddress, pincode: val });
                }}
              />
              {newAddress.pincode &&
                !/^[1-9][0-9]{5}$/.test(newAddress.pincode) && (
                  <p className="text-[10px] text-red-500 mt-1">
                    Enter valid 6-digit Pincode
                  </p>
                )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowAddAddressForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full bg-[#006044] hover:bg-[#004d36] text-white"
              >
                Save Address
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* RIGHT: Order Summary & Delivery Options */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 h-fit sticky top-24 shadow-sm">
        <h2 className="text-xl font-bold mb-4 border-b pb-4">Order Summary</h2>

        <div className="space-y-3 max-h-40 overflow-y-auto pr-2 mb-6">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-gray-700 truncate pr-4">
                {item.name}{" "}
                <span className="text-gray-400">x{item.quantity}</span>
              </span>
              <span className="font-medium whitespace-nowrap">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* 🔥 NEW: Courier Selection UI */}
        <div className="border-t pt-4 mb-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Truck size={18} className="text-[#006044]" /> Delivery Options
          </h3>

          {isCalculatingShipping ? (
            <div className="flex items-center gap-2 text-sm text-[#006044] bg-[#006044]/5 p-3 rounded-lg border border-[#006044]/10">
              <Loader2 className="animate-spin w-4 h-4" /> Fetching best
              rates...
            </div>
          ) : courierOptions.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                Select Preferred Courier
              </p>
              {courierOptions.map((option) => (
                <label
                  key={option.courier_id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedCourierId === option.courier_id
                      ? "border-[#006044] bg-[#006044]/5 ring-1 ring-[#006044]"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="courier"
                      checked={selectedCourierId === option.courier_id}
                      onChange={() => handleCourierSelect(option)}
                      className="accent-[#006044] w-4 h-4"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {option.courier_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Est. Delivery: {option.etd}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold">₹{option.rate}</span>
                </label>
              ))}
            </div>
          ) : (
            /* ✅ If options are empty (Toggle is OFF), show a simple confirmation message instead of selection UI */
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-white rounded-full shadow-sm">
                <span className="text-lg">🚚</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Standard Delivery
                </p>
                <p className="text-xs text-gray-500">
                  Shipping charges will be updated at final checkout.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-gray-600">
            <span>Shipping</span>
            <span
              className={
                shippingCost === 0 && selectedCourierId
                  ? "text-green-600 font-medium"
                  : ""
              }
            >
              {shippingCost === 0
                ? selectedCourierId
                  ? "FREE"
                  : "₹0.00"
                : `₹${shippingCost.toFixed(2)}`}
            </span>
          </div>

          <div className="font-bold text-lg flex justify-between mt-4 border-t pt-4">
            <span>Total</span>
            <span className="text-[#006044]">₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <Button
          onClick={handlePlaceOrder}
          disabled={
            isProcessing ||
            !!shippingError ||
            isCalculatingShipping ||
            addresses.length === 0 ||
            !selectedCourierId
          }
          className="w-full mt-6 bg-[#006044] hover:bg-[#004d36] text-white py-6 text-lg rounded-xl shadow-md transition-all active:scale-[0.98]"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Processing...
            </span>
          ) : (
            `Proceed to Pay ₹${grandTotal.toFixed(2)}`
          )}
        </Button>
      </div>
    </div>
  );
}
