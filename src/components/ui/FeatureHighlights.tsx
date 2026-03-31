// src/components/ui/FeatureHighlights.tsx
"use client";

import { useQuery } from '@tanstack/react-query';
import * as LucideIcons from 'lucide-react';
import apiClient from '@/lib/api-client';

// Dynamic Icon Renderer maps string names from DB to actual SVGs securely
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.CheckCircle; // Fallback icon
  return <IconComponent className={className} size={20} />;
};

export default function FeatureHighlights() {
  const { data: features, isLoading, isError } = useQuery({
    queryKey: ['active-features'],
    queryFn: () => apiClient.get('/features'),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour to prevent redundant DB hits
  });

  if (isError) return null; // Graceful degradation

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="w-20 h-3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!features?.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-gray-100 my-6">
      {features.map((feature: any) => (
        <div key={feature.id} className="flex flex-col items-center text-center space-y-3 group">
          <div className="p-3 bg-orange-50 rounded-full text-[#FFA41C] group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
            <DynamicIcon name={feature.icon} />
          </div>
          <span className="text-xs text-gray-700 font-medium leading-tight max-w-[100px]">
            {feature.title}
          </span>
        </div>
      ))}
    </div>
  );
}