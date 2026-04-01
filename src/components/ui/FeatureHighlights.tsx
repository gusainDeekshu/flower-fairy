"use client";

import { useQuery } from "@tanstack/react-query";
import * as LucideIcons from "lucide-react";
import {apiClient} from "@/lib/api-client";

// Smart Icon Resolver
const DynamicIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  if (!name) return <LucideIcons.CheckCircle className={className} size={20} />;

  // 1. Try an exact match first (in case you typed it perfectly like "Truck" or "ShieldCheck")
  let IconComponent = (LucideIcons as any)[name];

  // 2. If not found, intelligently convert lowercase or dash-case to PascalCase
  // Example: "truck" -> "Truck" | "shield-check" -> "ShieldCheck"
  if (!IconComponent) {
    const pascalCaseName = name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
    IconComponent = (LucideIcons as any)[pascalCaseName];
  }

  // 3. Fallback to CheckCircle if the icon name simply doesn't exist in Lucide
  IconComponent = IconComponent || LucideIcons.CheckCircle;

  return <IconComponent className={className} size={20} />;
};

export default function FeatureHighlights({
  productId,
}: {
  productId: string;
}) {
  const {
    data: features,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product-highlights", productId],
    queryFn: async () => {
      const res = await apiClient.get(`/products/${productId}/highlights`);
      // Safely extract the array regardless of how Axios/apiClient wraps it
        console.log("Rendering feature:", res) 

      return Array.isArray(res) ? res : res?.data || [];
    },
    staleTime: 1000 * 60 * 15, // Cache for 15 mins per product
    enabled: !!productId,
  });

  if (isError) return null;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 animate-pulse border-y border-gray-100 my-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full" />
            <div className="w-20 h-3 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!features || features.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-gray-100 my-6">
      {features.map((feature: any) => (
        <div
          key={feature.id}
          className="flex flex-col items-center text-center space-y-3 group"
        >
          <div
            className="p-3 rounded-full transition-all duration-300 shadow-sm"
            style={{
              backgroundColor: `${feature.color || "#16a34a"}20`,
              color: feature.color || "#16a34a",
            }}
          >
            
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
