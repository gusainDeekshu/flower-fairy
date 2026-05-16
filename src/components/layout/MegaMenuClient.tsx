// src/components/layout/MegaMenuClient.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MegaMenuClient({ groups }: { groups: any[] }) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
  return (
    <nav
      className="relative flex items-center gap-6 xl:gap-8 h-full"
      aria-label="Main navigation"
      onMouseLeave={() => setActiveGroup(null)}
    >
      {groups.map((group) => {
        const isLink = group.type === "link";
        const isActive = activeGroup === group.id;

        return (
          <div
            key={group.id}
            // 🔥 Restored 'relative' here so the dropdown aligns to this specific word
            className="relative h-full flex items-center group/nav"
            onMouseEnter={() => !isLink && setActiveGroup(group.id)}
          >
            {/* DIRECT LINK */}
            {isLink ? (
              <Link
                href={group.navLink || "#"}
                className="
                  relative
                  inline-flex items-center
                  text-[15px] font-medium text-gray-800
                  transition-colors duration-200
                  hover:text-[#217A6E]
                "
              >
                {capitalize(group.title)}
              </Link>
            ) : (
              <button
                type="button"
                aria-expanded={isActive}
                aria-haspopup="true"
                className={`
                  relative inline-flex items-center gap-1
                  text-[15px] font-medium
                  transition-colors duration-200 h-full
                  ${
                    isActive
                      ? "text-[#217A6E]"
                      : "text-gray-800 hover:text-[#217A6E]"
                  }
                `}
              >
                <span>{capitalize(group.title)}</span>

                <ChevronDown
                  className={`
                    w-4 h-4 transition-transform duration-200
                    ${isActive ? "rotate-180" : ""}
                  `}
                />
              </button>
            )}

            {/* MEGA PANEL - LEFT ALIGNED TO TEXT */}
            <AnimatePresence>
              {isActive && !isLink && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="
                    absolute left-0 top-[90%] z-50
                    pt-0
                  "
                >
                  {/* Invisible bridge to keep hover active */}
                  <div className="absolute -top-4 left-0 w-full h-4 bg-transparent" />

                  <div
                    className="
                      w-[min(600px,95vw)]
                      overflow-hidden
                      rounded-lg /* Soft rounded square corners */
                      border border-gray-200
                      bg-white
                      shadow-xl
                    "
                  >
                    <div className="grid grid-cols-12 items-stretch">
                      
                      {/* MENU COLUMNS (LEFT SIDE) */}
                      <div className="col-span-8 px-8 py-8 bg-white">
                        <div className="grid grid-cols-3 gap-x-6 gap-y-8">
                          {group.columns?.map((column: any) => (
                            <div key={column.id}>
                              <h3
                                className="
                                  mb-4
                                  text-base
                                  font-extrabold
                                  text-gray-900
                                "
                              >
                                {capitalize(column.title) || "Explore"}
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
                                        block
                                        text-sm text-gray-600
                                        transition-colors duration-200
                                        hover:text-[#217A6E] hover:font-medium
                                      "
                                    >
                                      {capitalize(item.label)}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* PROMO BLOCK (RIGHT SIDE) */}
                      {group.image && (
                        <div className="col-span-4 bg-gray-50/50 p-6 flex flex-col items-stretch border-l border-gray-100">
                          <Link href="#" className="block relative w-full h-full min-h-[250px] rounded-md overflow-hidden group/promo">
                            <Image
                              src={group.image}
                              alt={group.title}
                              fill
                              className="
                                object-cover /* Fills the square perfectly without whitespace */
                                transition-transform duration-500
                                group-hover/promo:scale-105
                              "
                            />
                          </Link>
                        </div>
                      )}
                      
                    </div>
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