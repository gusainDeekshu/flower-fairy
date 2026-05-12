// src/components/layout/MobileMenuDrawer.tsx

"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { useUIStore } from "@/store/useUIStore";
import { BRAND } from "@/config/brand.config";
import { motion, AnimatePresence } from "framer-motion";

export function MobileMenuDrawer({ groups }: { groups: any[] }) {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleGroup = (id: string) => {
    setExpandedGroup(expandedGroup === id ? null : id);
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          {/* Dark Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={closeMobileMenu} 
          />
          
          {/* Side Drawer */}
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="relative w-[85%] max-w-[360px] bg-white h-full shadow-2xl flex flex-col z-10"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <span className="text-xl font-black text-[#217A6E] tracking-tight">Menu</span>
              </div>
              <button 
                onClick={closeMobileMenu} 
                className="p-2 bg-white rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm border border-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Accordion Menu Items */}
            <div className="flex-1 overflow-y-auto py-2 px-4 scrollbar-hide">
              <ul className="space-y-1">
                {groups.map((group) => {
                  const isLink = group.type === "link";
                  const isExpanded = expandedGroup === group.id;

                  return (
                    <li key={group.id} className="border-b border-gray-50 last:border-0 pb-1 pt-1">
                      {isLink ? (
                        <Link
                          href={group.navLink || "#"}
                          onClick={closeMobileMenu}
                          className="block py-3 text-[15px] font-black text-gray-800 uppercase tracking-wide"
                        >
                          {group.title}
                        </Link>
                      ) : (
                        <div>
                          <button
                            onClick={() => toggleGroup(group.id)}
                            className="w-full flex items-center justify-between py-3 text-[15px] font-black text-gray-800 uppercase tracking-wide"
                          >
                            {group.title}
                            <ChevronDown 
                              size={18} 
                              className={`transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#217A6E]" : "text-gray-400"}`} 
                            />
                          </button>
                          
                          {/* Sub-menu Accordion Content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-3 pb-4 space-y-5 pt-1 border-l-2 border-[#217A6E]/20 ml-2 mb-2 mt-1">
                                  {group.columns?.map((col: any) => (
                                    <div key={col.id}>
                                      {col.title && (
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 ml-2">{col.title}</h4>
                                      )}
                                      <ul className="space-y-3">
                                        {col.items?.map((item: any) => (
                                          <li key={item.id}>
                                            <Link
                                              onClick={closeMobileMenu}
                                              href={
                                                item.type === "COLLECTION" ? `/collections/${item.slug}` :
                                                item.type === "PRODUCT" ? `/product/${item.slug}` :
                                                `/${item.slug}`
                                              }
                                              className="text-[14px] font-semibold text-gray-600 hover:text-[#217A6E] flex items-center gap-3 py-1"
                                            >
                                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                              {item.label}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Support Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-3">
               <a href={`tel:${BRAND.phone}`} className="flex items-center gap-3 text-sm font-semibold text-gray-700 hover:text-[#217A6E]">
                 <span className="p-2 bg-white rounded-full shadow-sm text-[#217A6E]"><Phone size={16} /></span>
                 {BRAND.phone}
               </a>
               <a href={`mailto:${BRAND.email}`} className="flex items-center gap-3 text-sm font-semibold text-gray-700 hover:text-[#217A6E]">
                 <span className="p-2 bg-white rounded-full shadow-sm text-[#217A6E]"><Mail size={16} /></span>
                 {BRAND.email}
               </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}