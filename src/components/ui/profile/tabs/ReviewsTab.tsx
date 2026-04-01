// src/components/profile/tabs/ReviewsTab.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Star, MessageSquare, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Review } from '@/types/profile';
import Image from 'next/image';
import {apiClient} from '@/lib/api-client';

export function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const fetchReviews = useCallback(async () => {
    try {
      const res = await apiClient.get<Review[]>('/api/v1/reviews/my');
      setReviews(res || []);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const deleteReview = async (id: string) => {
    setDeletingId(id);
    try {
      await apiClient.delete(`/api/v1/reviews/${id}`);
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (e) {
      toast.error('Failed to delete review');
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-8" />
        {[1, 2].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900">My Reviews</h3>
        <p className="text-gray-500 mt-1">Ratings and reviews you've submitted.</p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState 
          icon={MessageSquare} 
          title="No reviews yet" 
          description="Purchase products and share your experience with the community." 
        />
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col sm:flex-row gap-5">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 relative border border-gray-100">
                <Image 
                  src={review.product.images[0] || '/placeholder.jpg'} 
                  alt={review.product.name} 
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                  <h4 className="font-bold text-gray-900 line-clamp-1">{review.product.name}</h4>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded border border-yellow-100 w-fit">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} 
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mt-2 italic border-l-2 border-[#009688] pl-3 py-1">
                  "{review.comment || 'No comment provided.'}"
                </p>
                
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => deleteReview(review.id)} 
                    disabled={deletingId === review.id}
                    className="text-red-500 text-sm font-semibold flex items-center gap-1.5 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                  >
                    {deletingId === review.id ? (
                      <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={16}/>
                    )}
                    Delete Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}