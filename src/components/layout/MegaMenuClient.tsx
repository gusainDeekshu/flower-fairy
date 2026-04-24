"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function MegaMenuClient({ groups }: { groups: any[] }) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  console.log("Rendering MegaMenuClient with groups:", groups);
  return (
    <nav
      className="flex items-center space-x-10 h-14"
      onMouseLeave={() => setActiveGroup(null)}
    >
      {groups.map((group) => {
        // 🔥 The backend guarantees 'type' is correct, but safety check is good
        const isLink = group.type === "link";

        return (
          <div
            key={group.id}
            className="relative h-full flex items-center"
            onMouseEnter={() => !isLink && setActiveGroup(group.id)}
          >
            {/* 🔥 IF DIRECT LINK */}
            {isLink ? (
              <Link
                href={group.navLink || "#"}
                className="flex items-center space-x-1 text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#217A6E] text-gray-700"
              >
                <span>{group.title}</span>
              </Link>
            ) : (
              /* 🔥 IF DROPDOWN (Existing) */
              <button
                className={`flex items-center space-x-1 text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#217A6E] ${activeGroup === group.id ? "text-[#217A6E]" : "text-gray-700"}`}
              >
                <span>{group.title}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${activeGroup === group.id ? "rotate-180" : ""}`}
                />
              </button>
            )}
            {activeGroup === group.id && !isLink && (
              <div className="fixed left-0 top-[110px] w-full bg-white shadow-2xl border-t border-gray-100 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="mx-auto max-w-7xl px-8 py-10">
                  <div className="grid grid-cols-12 gap-10">
                    {/* 🔥 FIX: Map through COLUMNS first */}
                    <div className="col-span-8 grid grid-cols-3 gap-8">
                      {group.columns?.map((column: any) => (
                        <div key={column.id}>
                          <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-6 border-b border-gray-50 pb-2">
                            {column.title || "Explore"}
                          </h3>
                          <ul className="space-y-4">
                            {column.items?.map((item: any) => (
                              <li key={item.id}>
                                <Link
                                  href={
                                    item.type === "COLLECTION"
                                      ? `/collections/${item.slug}`
                                      : item.type === "PRODUCT"
                                        ? `/product/${item.slug}`
                                        : `/${item.slug}` // 🔥 FIX: EXTERNAL links go to root (e.g., /blog)
                                  }
                                  className="text-[14px] font-semibold text-gray-800 hover:text-[#217A6E] transition-all flex items-center group"
                                >
                                  <span className="w-0 group-hover:w-3 h-[2px] bg-[#217A6E] mr-0 group-hover:mr-2 transition-all"></span>
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Promo Banner */}
                    {group.image && (
                      <div className="col-span-4">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg group/img">
                          <Image
                            src={group.image}
                            alt={group.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
