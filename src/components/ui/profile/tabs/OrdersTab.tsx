// src/components/profile/tabs/OrdersTab.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Package, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Order } from '@/types/profile';
import Link from 'next/link';
import {apiClient} from '@/lib/api-client';

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await apiClient.get<Order[]>('/api/v1/orders/my-orders');
      setOrders(res || []);
    } catch (error) {
      // Handle 404 gracefully for no orders
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
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 mb-8" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Order History</h3>
        <p className="text-gray-500 mt-1">Track, return, or buy items again.</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState 
          icon={Package} 
          title="No orders yet" 
          description="Looks like you haven't made your first purchase yet." 
          action={
            <Link href="/" className="mt-2 bg-[#009688] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#007A6E] transition-colors">
              Start Shopping
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition-shadow bg-white">
              <div className="mb-4 sm:mb-0">
                <p className="font-bold text-gray-900 flex items-center gap-2">
                  Order #{order.id.slice(-8).toUpperCase()}
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-500 font-medium">Total Amount</p>
                  <p className="font-bold text-xl text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                </div>
                <Link href={`/checkout/${order.id}`} className="p-2 text-[#009688] bg-[#009688]/10 rounded-lg hover:bg-[#009688]/20 transition-colors">
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}