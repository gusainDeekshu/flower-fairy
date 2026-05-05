// src/app/checkout/page.tsx

"use client";

import { useCartStore } from "@/store/useCartStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { addressService, Address } from "@/services/address.service";
import { paymentService } from "@/services/payment.service";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2, ShoppingBag, Truck } from "lucide-react";
import { PaymentInitiateResponse } from "@/types/payment";
import { executePaymentFlow } from "@/lib/payment-handler";
import { load } from "@cashfreepayments/cashfree-js"; // 🔥 Cashfree SDK
import Link from "next/link";

interface CourierOption {
  courierPartnerId?: string; // Mapped from backend DTO
  courier_id?: string;       // Legacy support
  courierName?: string;
  courier_name?: string;
  rate: number;
  etd: string;
  isRecommended?: boolean;
}

export default function CheckoutPage() {
  const { items } = useCartStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Listen for Payment Redirect Errors ---
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const reasonParam = searchParams.get("reason");

    if (errorParam) {
      if (errorParam === "payment_failed") {
        toast.error("Payment failed or was cancelled. Please try again.");
      } else if (errorParam === "hash_mismatch") {
        toast.error(`Security validation failed: ${reasonParam || "Contact support"}`);
      } else {
        toast.error("An error occurred during checkout.");
      }
      router.replace("/checkout", { scroll: false });
    }
  }, [searchParams, router]);

  // --- State Management ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  // --- Shipping State ---
  const [courierOptions, setCourierOptions] = useState<CourierOption[]>([]);
  const [selectedCourierId, setSelectedCourierId] = useState<string | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  // 🔥 State for Backend Config Flags
  const [showEstimation, setShowEstimation] = useState<boolean>(true);
  const [topCourierName, setTopCourierName] = useState<string>("Standard Delivery");
  const [topCourierEtd, setTopCourierEtd] = useState<string>("");

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

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
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
        fetchSecureShippingRates(selectedAddress);
      }, 500);
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [selectedAddress, items, cartTotal, storeId]);

  const fetchSecureShippingRates = async (address: Address) => {
    const traceId = `ship_calc_${Date.now()}`;

    if (!/^[1-9][0-9]{5}$/.test(address.pincode)) {
      setShippingError("Invalid Pincode. Please update your address.");
      return;
    }

    setIsCalculatingShipping(true);
    setShippingError(null);
    setCourierOptions([]);

    const payload = {
      storeId: storeId,
      address: {
        state: address.state || "",
        pincode: address.pincode,
      },
      items: items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      cartTotal: cartTotal,
      paymentMethod: "PREPAID",
    };

    try {
      const response = await apiClient.post("/shipping/calculate", payload);
      const { data } = response;

      setShowEstimation(data?.showEstimation ?? true);

      if (data?.options && data.options.length > 0) {
        const sortedOptions = [...data.options].sort((a, b) => Number(a.rate) - Number(b.rate));
        setCourierOptions(sortedOptions);
        
        const recommended = sortedOptions.find((o) => o.isRecommended) || sortedOptions[0];
        handleCourierSelect(recommended);
      } else {
        setCourierOptions([]);
        setSelectedCourierId(data?.courierPartnerId || "default");
        setShippingCost(data?.shippingCost || 0);

        setTopCourierName(data?.courierName || "Standard Delivery");
        setTopCourierEtd(data?.estimatedDays || "3-5");
      }
    } catch (error: any) {
      console.error(`[${traceId}] Shipping Calculation Failed`, error);
      
      const msg = error.response?.data?.message || "Could not fetch shipping rates. Please try again.";
      setShippingError(msg);
      toast.error(msg);
      
      setSelectedCourierId(null);
      setShippingCost(0);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleCourierSelect = (option: CourierOption) => {
    const id = option.courierPartnerId || option.courier_id;
    if (id) {
      setSelectedCourierId(id);
      setShippingCost(option.rate);
    }
  };

  // --- Add Address ---
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();

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
        name: `${newAddress.firstName} ${newAddress.lastName}`.trim(),
        label: newAddress.label.toUpperCase() as "HOME" | "WORK" | "OTHER",
      });

      setAddresses([...addresses, added]);
      setSelectedAddress(added);
      setShowAddAddressForm(false);
      toast.success("Address saved!");
    } catch (error: any) {
      const msg = error?.response?.data?.message?.[0] || error?.response?.data?.message || "Failed to add address";
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

    if (!items || items.length === 0 || !storeId) {
      toast.error("Your cart is empty or missing store info");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Initializing secure payment...");

    try {
      const sessionRes = await apiClient.post("/checkout/session", {
        storeId: storeId,
        addressId: selectedAddress.id,
        courierId: selectedCourierId,
        paymentMethod: "PREPAID",
      });

      const session = sessionRes.data;
      const payRes = await paymentService.initiatePayment(session.id);
      
      const responseData: PaymentInitiateResponse & { paymentSessionId?: string } = payRes?.data || payRes;

      toast.dismiss(toastId);

      // 🔥 CASHFREE SDK INTERCEPTION 🔥
      if (responseData.provider === "CASHFREE" && responseData.paymentSessionId) {
        try {
          const cashfree = await load({
            mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === "production" ? "production" : "sandbox",
          });

          if (cashfree) {
            cashfree.checkout({
              paymentSessionId: responseData.paymentSessionId,
            });
          } else {
            throw new Error("Failed to load Cashfree SDK");
          }
        } catch (cfError) {
          console.error("Cashfree initialization failed:", cfError);
          toast.error("Failed to load the payment gateway. Please try again.");
          setIsProcessing(false);
        }
        return; // Prevent execution of executePaymentFlow
      }

      // 🔁 Fallback for other providers (PayU, PhonePe, Stripe, Razorpay)
      executePaymentFlow(responseData, session.id, router);
    } catch (err: any) {
      toast.dismiss(toastId);
      const msg = err?.response?.data?.message || err?.message || "Checkout failed";
      toast.error(msg);
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
        <div className="bg-gray-50 p-6 rounded-full mb-6">
          <ShoppingBag size={64} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Please add some items to proceed to checkout.</p>
        <Link href="/">
          <Button className="bg-[#217A6E] hover:bg-[#004d36] text-white px-8 py-6 text-lg rounded-xl shadow-md transition-all active:scale-95">
            Continue Shopping
          </Button>
        </Link>
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
                    ? "border-[#217A6E] bg-[#217A6E]/5"
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
                onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
              />
              <input
                className="p-2 border rounded-md w-full"
                placeholder="Last Name"
                required
                onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
              />
            </div>
            <input
              className="p-2 border rounded-md w-full"
              placeholder="Email"
              type="email"
              required
              onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
            />
            <div className="relative">
              <input
                className={`p-2 border rounded-md w-full focus:ring-2 focus:ring-[#217A6E] transition-all ${
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
                  const val = e.target.value.replace(/\D/g, "");
                  setNewAddress({ ...newAddress, phone: val });
                }}
              />
              {newAddress.phone && !/^[6-9]\d{9}$/.test(newAddress.phone) && (
                <p className="text-[10px] text-red-500 mt-1">Must be 10 digits starting with 6-9</p>
              )}
            </div>

            <input
              className="p-2 border rounded-md w-full"
              placeholder="Address Line"
              required
              onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="p-2 border rounded-md w-full"
                placeholder="City"
                required
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
              <input
                className="p-2 border rounded-md w-full"
                placeholder="State"
                required
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              />
            </div>
            
            <div className="relative">
              <input
                type="text"
                className="p-2 border rounded-md w-full focus:ring-2 focus:ring-[#217A6E]"
                placeholder="6-digit Pincode"
                maxLength={6}
                required
                value={newAddress.pincode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setNewAddress({ ...newAddress, pincode: val });
                }}
              />
              {newAddress.pincode && !/^[1-9][0-9]{5}$/.test(newAddress.pincode) && (
                <p className="text-[10px] text-red-500 mt-1">Enter valid 6-digit Pincode</p>
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
              <Button type="submit" className="w-full bg-[#217A6E] hover:bg-[#004d36] text-white">
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
            <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
              <span className="text-gray-700 truncate pr-4">
                {item.name} <span className="text-gray-400">x{item.quantity}</span>
              </span>
              <span className="font-medium whitespace-nowrap">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Courier Selection UI */}
        <div className="border-t pt-4 mb-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Truck size={18} className="text-[#217A6E]" /> Delivery Options
          </h3>

          {isCalculatingShipping ? (
            <div className="flex items-center gap-2 text-sm text-[#217A6E] bg-[#217A6E]/5 p-3 rounded-lg border border-[#217A6E]/10">
              <Loader2 className="animate-spin w-4 h-4" /> Fetching best rates...
            </div>
          ) : courierOptions.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                Select Preferred Courier
              </p>
              {courierOptions.map((option) => {
                const optId = option.courierPartnerId || option.courier_id;
                const optName = option.courierName || option.courier_name;

                return (
                  <label
                    key={optId}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedCourierId === optId
                        ? "border-[#217A6E] bg-[#217A6E]/5 ring-1 ring-[#217A6E]"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="courier"
                        checked={selectedCourierId === optId}
                        onChange={() => handleCourierSelect(option)}
                        className="accent-[#217A6E] w-4 h-4"
                      />
                      <div>
                        <p className="font-medium text-sm flex items-center gap-2">
                          {optName}
                          {option.isRecommended && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                              Best
                            </span>
                          )}
                        </p>
                        {showEstimation && option.etd && (
                          <p className="text-xs text-gray-500">Est. Delivery: {option.etd} days</p>
                        )}
                      </div>
                    </div>
                    <span className="font-bold">₹{option.rate}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                Selected Delivery Partner
              </p>
              <label className="flex items-center justify-between p-3 border rounded-lg cursor-default transition-all border-[#217A6E] bg-[#217A6E]/5 ring-1 ring-[#217A6E]">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="courier_fallback"
                    checked={true}
                    readOnly
                    className="accent-[#217A6E] w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-sm flex items-center gap-2">
                      {topCourierName || "Standard Delivery"}
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                        Best
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {shippingError ? (
                        <span className="text-red-500">{shippingError}</span>
                      ) : showEstimation && topCourierEtd ? (
                        `Est. Delivery: ${topCourierEtd} days`
                      ) : (
                        "Shipping timeline confirmed at dispatch."
                      )}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-gray-900">
                  {shippingCost === 0 ? "FREE" : `₹${shippingCost.toFixed(2)}`}
                </span>
              </label>
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
            <span className={shippingCost === 0 && selectedCourierId ? "text-green-600 font-medium" : ""}>
              {shippingCost === 0
                ? selectedCourierId
                  ? "FREE"
                  : "₹0.00"
                : `₹${shippingCost.toFixed(2)}`}
            </span>
          </div>

          <div className="font-bold text-lg flex justify-between mt-4 border-t pt-4">
            <span>Total</span>
            <span className="text-[#217A6E]">₹{grandTotal.toFixed(2)}</span>
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
          className="w-full mt-6 bg-[#217A6E] hover:bg-[#004d36] text-white py-6 text-lg rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-60"
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