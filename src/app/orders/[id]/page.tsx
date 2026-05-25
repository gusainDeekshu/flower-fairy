"use client";

import { use, useEffect } from "react";
import useSWR from "swr";
import { apiClient } from "@/lib/api-client";
import {
  Package,
  XCircle,
  MapPin,
  Loader2,
  Calendar,
  CreditCard,
  Truck,
} from "lucide-react";
import { resolveFirstProductImage } from "@/utils/media-normalization";

const fetcher = async (url: string) => {
  try {
    const res = await apiClient.get(url);
    console.log(`[DEBUG] SWR Fetch Success for ${url}:`, res);
    return res?.data?.data || res?.data || res;
  } catch (error) {
    console.error(`SWR Fetch Error for ${url}:`, error);
    throw error;
  }
};

const STATUS_BADGES: Record<string, { label: string; container: string; text: string }> = {
  PENDING: { label: "Awaiting Payment", container: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  PAID: { label: "Payment Confirmed", container: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
  PROCESSING: { label: "Processing Item(s)", container: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  SHIPPED: { label: "Out For Delivery", container: "bg-indigo-50 border-indigo-200", text: "text-indigo-700" },
  DELIVERED: { label: "Delivered", container: "bg-gray-100 border-gray-300", text: "text-gray-800" },
  CANCELLED: { label: "Cancelled", container: "bg-red-50 border-red-200", text: "text-red-700" },
  RETURNED: { label: "Returned", container: "bg-purple-50 border-purple-200", text: "text-purple-700" },
};

export default function UserOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams?.id;

  const { data: order, error, isLoading } = useSWR(orderId ? `/orders/${orderId}/summary` : null, fetcher);

  useEffect(() => {
    if (order) {
      console.log("[DEBUG] User Order Data Fetched:", order);
    }
  }, [order]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <XCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold text-gray-900">Failed to load order</h2>
        <p className="text-sm text-gray-500">Please check your network connection or try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Loading your order details...</p>
      </div>
    );
  }

  if (!order || !order.id) {
    return (
      <div className="p-10 text-center max-w-md mx-auto mt-12 border border-dashed rounded-2xl">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
        <p className="text-gray-500 mt-2 text-sm">We couldn't locate this order history configuration in your account.</p>
      </div>
    );
  }

  const currentStatus = order?.status ? String(order.status).toUpperCase() : "PENDING";
  const badgeConfig = STATUS_BADGES[currentStatus] || {
    label: currentStatus,
    container: "bg-gray-50 border-gray-200",
    text: "text-gray-700",
  };
  
  const hasAddress = order.addressSnapshot && order.addressSnapshot.name;
  const formattedDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })
    : null;

  // Safe numerical calculations for breakdown card
  const totalAmount = Number(order.totalAmount) || 0;
  const shippingCost = Number(order.shippingCost) || 0;
  const subtotal = Math.max(0, totalAmount - shippingCost);

  return (
    <div className="max-w-[1100px] mx-auto py-8 px-4 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Order Details
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span>ID: <span className="font-mono text-gray-700 font-semibold">{order.id.toUpperCase()}</span></span>
            {formattedDate && (
              <>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formattedDate}</span>
              </>
            )}
          </p>
        </div>

        <span className={`px-4 py-1.5 text-sm font-bold border rounded-full ${badgeConfig.container} ${badgeConfig.text}`}>
          {badgeConfig.label}
        </span>
      </div>

      {/* CORE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {hasAddress ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 mb-3.5 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" /> Delivery Address
              </h3>
              <address className="not-italic text-sm text-gray-600 space-y-1 leading-relaxed">
                <p className="font-semibold text-gray-900 text-sm">
                  {order.addressSnapshot?.name}
                </p>
                <p>{order.addressSnapshot?.addressLine}</p>
                <p>
                  {order.addressSnapshot?.city}, {order.addressSnapshot?.state} — <span className="font-semibold">{order.addressSnapshot?.pincode}</span>
                </p>
                <p className="pt-2 text-xs text-gray-500">Contact Number: {order.addressSnapshot?.phone}</p>
              </address>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center text-gray-500 text-xs">
              <MapPin className="h-5 w-5 mx-auto mb-2 text-gray-400" />
              Digital delivery or no shipment address snapshot was captured.
            </div>
          )}

          {order.paymentProvider && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-400" /> Payment Info
              </h3>
              <p className="text-sm font-medium text-gray-700 capitalize">
                {order.paymentProvider.toLowerCase()} Gateway
              </p>
              {order.paymentProviderId && (
                <p className="text-xs text-gray-400 font-mono mt-1 truncate">
                  Ref: {order.paymentProviderId}
                </p>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-gray-100 bg-gray-50/70">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Truck className="h-4 w-4 text-gray-400" /> Your Package Elements
              </h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {order.items && Array.isArray(order.items) ? (
                order.items.map((item: any) => (
                  <div
                    key={item.id || `${item.product?.id}-${item.quantity}`} 
                    className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="h-16 w-16 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden p-1">
                      {resolveFirstProductImage(item?.product?.images) ? (
  <img
    src={
      resolveFirstProductImage(item?.product?.images) ||
      "/placeholder-product.png"
    }
    alt={item.product?.name || "product"}
    className="h-full w-full object-contain mix-blend-multiply"
  />
) : (
  <Package className="h-6 w-6 text-gray-300" />
)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {item?.product?.name || "Product Item"}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Price per unit: ₹{Number(item?.price || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900 text-sm">
                        ₹{(Number(item?.price || 0) * (item?.quantity || 1)).toLocaleString("en-IN")}
                      </p>
                      <p className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md inline-block mt-1">
                        Qty: {item?.quantity || 1}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">
                  No items were packaged with this confirmation ID.
                </div>
              )}
            </div>
          </div>

          {/* Pricing Ledger Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Financial Breakdown
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span className="font-medium text-gray-900">
                  {shippingCost > 0 ? `₹${shippingCost.toLocaleString("en-IN")}` : "₹0 (Free)"}
                </span>
              </div>
              
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total Paid</span>
                <span className="text-xl font-black text-blue-600">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}