"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function MegaMenuClient({ groups }: { groups: any[] }) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<"left" | "right">(
    "left",
  );
  const navRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const pathname = usePathname();

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const calculatePosition = (groupId: string) => {
    const element = navRefs.current[groupId];
    if (!element) return "left";

    const rect = element.getBoundingClientRect();

    const dropdownWidth = Math.min(600, window.innerWidth * 0.95);

    const viewportWidth = window.innerWidth;

    if (rect.left + dropdownWidth > viewportWidth) {
      return "right";
    }

    return "left";
  };

  const handleMouseEnter = (groupId: string, isLink: boolean) => {
    if (!isLink) {
      const position = calculatePosition(groupId);
      setDropdownPosition(position);
      setActiveGroup(groupId);
    }
  };

  return (
    <nav
      className="hidden lg:flex relative items-center gap-6 xl:gap-8 h-full"
      aria-label="Main navigation"
      onMouseLeave={() => setActiveGroup(null)}
    >
      {groups.map((group) => {
        const isLink = group.type === "link";
        const isActive = activeGroup === group.id;
        const isCurrentPath = isLink && pathname === group.navLink;

        return (
          <div
            key={group.id}
            ref={(el) => {
              navRefs.current[group.id] = el;
            }}
            className="relative h-full flex items-center"
            onMouseEnter={() => handleMouseEnter(group.id, isLink)}
          >
            {isLink ? (
              <Link
                href={group.navLink || "#"}
                className={cn(
                  "relative inline-flex items-center",
                  "text-[15px] font-medium",
                  "transition-colors duration-200",
                  "py-2 px-1",
                  "whitespace-nowrap", // ← KEEP TITLE IN ONE LINE
                  isCurrentPath
                    ? "text-[#217A6E]"
                    : "text-gray-800 hover:text-[#217A6E]",
                )}
              >
                {capitalize(group.title)}
              </Link>
            ) : (
              <button
                type="button"
                aria-expanded={isActive}
                aria-haspopup="true"
                className={cn(
                  "relative inline-flex items-center gap-1",
                  "text-[15px] font-medium",
                  "transition-colors duration-200 h-full",
                  "whitespace-nowrap", // ← KEEP TITLE IN ONE LINE
                  isActive
                    ? "text-[#217A6E]"
                    : "text-gray-800 hover:text-[#217A6E]",
                )}
              >
                <span>{capitalize(group.title)}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    "flex-shrink-0", // ← PREVENT ICON SHRINKING
                    isActive ? "rotate-180" : "",
                  )}
                />
              </button>
            )}

            {/* Dropdown Panel */}
            <AnimatePresence>
              {isActive && !isLink && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={cn(
                    "absolute top-full z-50",
                    dropdownPosition === "right" ? "right-0" : "left-0",
                  )}
                >
                  <div
                    className={cn(
                      "absolute -top-2 w-full h-2 bg-transparent",
                      dropdownPosition === "right" ? "right-0" : "left-0",
                    )}
                  />
                  <div
                    className={cn(
                      "w-[600px] max-w-[95vw]",
                      "overflow-hidden",
                      "rounded-lg",
                      "border border-gray-200",
                      "bg-white",
                      "shadow-xl",
                      dropdownPosition === "right" && "origin-top-right",
                    )}
                  >
                    <div className="grid grid-cols-12 items-stretch">
                      <div className="col-span-8 px-8 py-8 bg-white">
                        <div
                          className="grid gap-x-6 gap-y-8"
                          style={{
                            gridTemplateColumns: `repeat(${Math.min(
                              group.columns?.length || 1,
                              3,
                            )}, minmax(0, 1fr))`,
                          }}
                        >
                          {group.columns?.map((column: any) => (
                            <div key={column.id}>
                              {column.showHeading !== false && column.title && (
                                <h3
                                  className={cn(
                                    "mb-4",
                                    "text-base",
                                    "font-extrabold",
                                    "text-gray-900",
                                  )}
                                >
                                  {capitalize(column.title) || "Explore"}
                                </h3>
                              )}
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
                                      className={cn(
                                        "block",
                                        "text-sm text-gray-600",
                                        "leading-5 break-words",
                                        "transition-colors duration-200",
                                        "hover:text-[#217A6E] hover:font-medium",
                                      )}
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
                      {group.image && (
                        <div className="col-span-4 bg-gray-50/50 p-6 flex flex-col items-stretch border-l border-gray-100">
                          <Link
                            href="#"
                            className="block relative w-full h-full min-h-[250px] rounded-md overflow-hidden group/promo"
                          >
                            <Image
                              src={group.image}
                              alt={group.title}
                              fill
                              className={cn(
                                "object-cover",
                                "transition-transform duration-500",
                                "group-hover/promo:scale-105",
                              )}
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
