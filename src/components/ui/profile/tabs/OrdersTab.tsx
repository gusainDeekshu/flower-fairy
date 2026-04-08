// src/components/ui/profile/tabs/OrdersTab.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Package, ArrowRight, Calendar, CreditCard, Tag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Order } from '@/types/profile';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      // NOTE: Ensure the path matches your backend route. 
      // If your apiClient base URL already includes /api/v1, use "/orders/my-orders"
      const res = await apiClient.get<Order[]>('/orders/my-orders');
      
      // Defensively handle response structure
      const data = Array.isArray(res) ? res : (res as any)?.data || [];
      setOrders(data);
    } catch (error: any) {
      console.error("Fetch Orders Error:", error);
      // Only show error if it's not a 404 (which just means no orders found)
      if (error.response?.status !== 404) {
        toast.error('Failed to load order history');
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300 max-w-4xl">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Order History
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
            {orders.length} Orders
          </span>
        </h3>
        <p className="text-gray-500 mt-1">Track, manage, and review your past purchases.</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState 
          icon={Package} 
          title="No orders yet" 
          description="Looks like you haven't made your first purchase yet. Start exploring our collection!" 
          action={
            <Link href="/" className="mt-4 inline-block bg-[#009688] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#007A6E] transition-all shadow-lg shadow-[#009688]/20">
              Start Shopping
            </Link>
          }
        />
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="group border border-gray-200 rounded-2xl overflow-hidden hover:border-[#009688]/50 hover:shadow-xl hover:shadow-gray-200/50 transition-all bg-white">
              {/* Header: Status and ID */}
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                   <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                      <Package size={18} className="text-[#009688]" />
                   </div>
                   <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Order Reference</p>
                      <p className="font-bold text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                   </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full border ${
                    order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                    order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                    order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-orange-50 text-orange-700 border-orange-200'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Body: Details */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
                    <Calendar size={12} /> Placed On
                  </span>
                  <p className="text-gray-900 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
                    <CreditCard size={12} /> Total Paid
                  </span>
                  <p className="text-[#009688] font-bold text-lg">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center md:justify-end gap-3">
                   <Link 
                    href={`/orders/${order.id}`} // Links to a dedicated order tracking page
                    className="flex-1 md:flex-none text-center bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </Link>
                  <Link 
                    href={`/orders/${order.id}/track`}
                    className="flex-1 md:flex-none text-center bg-[#009688] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#007A6E] transition-all shadow-md shadow-[#009688]/10 flex items-center justify-center gap-2"
                  >
                    Track <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Footer: Quick Preview of items (Optional but recommended) */}
              {(order as any).items && (order as any).items.length > 0 && (
                <div className="px-6 py-3 bg-gray-50/30 border-t border-gray-50 flex items-center gap-2 overflow-x-auto">
                  <span className="text-[10px] font-bold text-gray-400 uppercase mr-2 shrink-0">Items:</span>
                  {(order as any).items.slice(0, 3).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-md shrink-0">
                       <span className="text-[11px] text-gray-600 font-medium truncate max-w-[120px]">{item.product?.name || 'Product'}</span>
                       <span className="text-[10px] text-gray-400 font-bold">x{item.quantity}</span>
                    </div>
                  ))}
                  {(order as any).items.length > 3 && (
                    <span className="text-[10px] font-bold text-[#009688]">+{ (order as any).items.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}