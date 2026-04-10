'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Truck, Package, Home, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface TrackingTimelineProps {
  awbCode: string;
}

export default function TrackingTimeline({ awbCode }: TrackingTimelineProps) {
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const response = await apiClient.get(`/shipping/track/${awbCode}`);
        setTrackingData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Tracking data unavailable.');
      } finally {
        setLoading(false);
      }
    };

    if (awbCode) fetchTracking();
  }, [awbCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 space-x-2 text-green-600">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="font-medium">Fetching live tracking...</span>
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
        <div>
          <p className="font-semibold text-orange-800">Tracking update pending</p>
          <p className="text-sm text-orange-600">AWB: {awbCode}</p>
          <p className="text-xs text-orange-500 mt-1">It may take a few hours for the courier to update their system.</p>
        </div>
      </div>
    );
  }

  // Shiprocket sends a 1 (Delivered), 6 (Shipped), etc.
  const currentStatusId = trackingData.shipment_status; 
  const isDelivered = currentStatusId === 7 || trackingData.shipment_track[0]?.current_status === 'Delivered';

  // Define our ideal Flipkart-style pipeline
  const steps = [
    { title: 'Order Placed', icon: Package, isCompleted: true },
    { title: 'Packed & Ready', icon: Package, isCompleted: currentStatusId >= 2 },
    { title: 'Shipped', icon: Truck, isCompleted: currentStatusId >= 6 },
    { title: 'Out for Delivery', icon: Truck, isCompleted: currentStatusId === 17 || isDelivered },
    { title: 'Delivered', icon: Home, isCompleted: isDelivered },
  ];

  const scans = trackingData.shipment_track_activities || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Track Shipment</h3>
          <p className="text-sm text-gray-500">AWB: {awbCode}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500">Courier Partner</p>
          <p className="text-sm font-bold text-gray-900">{trackingData.shipment_track[0]?.courier_name || 'Assigned'}</p>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          const isActive = step.isCompleted;

          return (
            <div key={index} className="flex relative pb-8">
              {/* Connecting Line */}
              {!isLast && (
                <div 
                  className={`absolute left-[11px] top-8 bottom-0 w-[2px] ${
                    steps[index + 1].isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} 
                />
              )}

              {/* Dot / Icon */}
              <div className="relative z-10 flex-shrink-0 mr-4">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center border-2 ${
                  isActive ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'
                }`}>
                  {isActive ? (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-gray-300" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div>
                <h4 className={`text-base font-semibold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.title}
                </h4>
                
                {/* Show detailed scan activity if this is the currently active step */}
                {isActive && index === 2 && scans.length > 0 && (
                  <div className="mt-3 space-y-3 bg-gray-50 p-3 rounded-lg text-sm border">
                    {scans.slice(0, 3).map((scan: any, i: number) => (
                      <div key={i} className="flex gap-3 text-gray-600">
                        <span className="min-w-[120px] text-xs text-gray-500">
                          {new Date(scan.date).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">{scan.activity}</p>
                          <p className="text-xs">{scan.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}