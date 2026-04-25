// src\components\layout\MegaMenuClient.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MegaMenuClient({ groups }: { groups: any[] }) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  return (
    <nav
      className="relative flex items-center gap-8 xl:gap-10 h-16"
      aria-label="Main navigation"
      onMouseLeave={() => setActiveGroup(null)}
    >
      {groups.map((group) => {
        const isLink = group.type === "link";
        const isActive = activeGroup === group.id;

        return (
          <div
            key={group.id}
            className="relative h-full flex items-center"
            onMouseEnter={() => !isLink && setActiveGroup(group.id)}
          >
            {/* DIRECT LINK */}
            {isLink ? (
              <Link
                href={group.navLink || "#"}
                className="
                  relative
                  text-sm font-semibold uppercase tracking-wide
                  text-zinc-800
                  transition-colors duration-200
                  hover:text-[#217A6E]
                "
              >
                {group.title}
              </Link>
            ) : (
              <button
                type="button"
                aria-expanded={isActive}
                aria-haspopup="true"
                className="
                  inline-flex items-center gap-1
                  text-sm font-semibold uppercase tracking-wide
                  text-zinc-800
                  transition-colors duration-200
                  hover:text-[#217A6E]
                "
              >
                <span>{group.title}</span>

                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isActive ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}

            {/* MEGA PANEL */}
            <AnimatePresence>
              {isActive && !isLink && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.22 }}
                  className="
                    absolute left-1/2 top-full z-50
                    -translate-x-1/2
                    mt-4
                    w-[min(1200px,95vw)]
                    rounded-2xl
                    border border-zinc-100
                    bg-white
                    shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                    overflow-hidden
                  "
                >
                  <div className="grid grid-cols-12">

                    {/* MENU COLUMNS */}
                    <div className="col-span-8 px-8 py-8">
                      <div className="grid grid-cols-3 gap-8">
                        {group.columns?.map((column: any) => (
                          <div key={column.id}>
                            <h3
                              className="
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-[0.18em]
                                text-zinc-400
                                mb-5
                              "
                            >
                              {column.title || "Explore"}
                            </h3>

                            <ul className="space-y-3">
                              {column.items?.map((item: any) => (
                                <li key={item.id}>
                                  <Link
                                    href={
                                      item.type === "COLLECTION"
                                        ? `/collections/${item.slug}`
                                        : item.type === "PRODUCT"
                                        ? `/product/${item.slug}`
                                        : `/${item.slug}`
                                    }
                                    className="
                                      group flex items-center
                                      text-sm font-medium text-zinc-700
                                      transition-colors duration-200
                                      hover:text-[#217A6E]
                                    "
                                  >
                                    <span
                                      className="
                                        mr-0 h-[2px] w-0 bg-[#217A6E]
                                        transition-all duration-200
                                        group-hover:w-3 group-hover:mr-2
                                      "
                                    />
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PROMO BLOCK */}
                    {group.image && (
                      <div className="col-span-4 bg-zinc-50 p-6">
                        <div
                          className="
                            relative
                            h-full min-h-[280px]
                            overflow-hidden
                            rounded-2xl
                          "
                        >
                          <Image
                            src={group.image}
                            alt={group.title}
                            fill
                            className="
                              object-cover
                              transition-transform duration-700
                              hover:scale-105
                            "
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                          <div className="absolute bottom-5 left-5 text-white">
                            <p className="text-lg font-semibold">
                              {group.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}