// src/components/home/TrustTicker.tsx

"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

const getIcon = (name?: string) => {
  if (!name) return LucideIcons.ShieldCheck;

  return (
    (LucideIcons as any)[name] ||
    (LucideIcons as any)[
      name
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")
    ] ||
    LucideIcons.ShieldCheck
  );
};

export const TrustTicker = ({ settings }: any) => {
  const { selectedIds = [] } = settings || {};

  const { data: masterFeatures = [], isLoading } = useQuery({
    queryKey: ["storefront-features"],
    queryFn: async () => {
      const res: any = await apiClient.get("/storefront/features");
      return Array.isArray(res) ? res : res?.data || [];
    },
    staleTime: 1000 * 60 * 60,
  });

  const activeBadges = Array.isArray(masterFeatures)
    ? masterFeatures.filter((feature: any) => selectedIds.includes(feature.id))
    : [];

  if (isLoading || !activeBadges.length) return null;

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Inner bordered container */}
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 px-6 py-8 md:px-10 md:py-10 shadow-sm">
          <div className="flex flex-wrap items-start justify-center gap-y-8 md:gap-y-0">
            {activeBadges.map((badge: any) => {
              const Icon = getIcon(badge.icon);

              return (
                <div
                  key={badge.id}
                  className="flex w-1/2 flex-col items-center text-center md:w-1/4 px-4"
                >
                  {/* Icon */}

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-black shadow-sm transition-all duration-300 group-hover:shadow-md">
                    <Icon
                      className="h-6 w-6 text-white"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="max-w-[180px] truncate text-base font-semibold text-neutral-900 leading-tight">
                    {badge.title}
                  </h3>

                  {/* Description */}
                  {badge.description && (
                    <p className="mt-1 max-w-[180px] truncate text-sm text-neutral-500 leading-tight">
                      {badge.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
