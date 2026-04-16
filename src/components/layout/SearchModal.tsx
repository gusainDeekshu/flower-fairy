// src\components\layout\SearchModal.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useProductSearch } from "@/hooks/useProductSearch";

// Helper from your existing codebase
const isValidImageUrl = (url?: string) => {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("/")) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function SearchModal() {
  const router = useRouter();
  const { isSearchOpen, closeSearch } = useUIStore();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Apply strict 300ms debounce
  const debouncedSearchTerm = useDebounce(inputValue, 300);
  
  // Fetch from TanStack query ONLY using the debounced term
  const { data: results, isLoading, isFetching } = useProductSearch(debouncedSearchTerm);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "unset";
      setInputValue(""); // Clear on close
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  // Handle keyboard shortcuts (Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) closeSearch();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  if (!isSearchOpen) return null;

  const showLoading = isFetching && debouncedSearchTerm.length >= 2;
  const showEmpty = !isFetching && debouncedSearchTerm.length >= 2 && results?.length === 0;
  const showResults = results && results.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-gray-900/60 backdrop-blur-sm">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={closeSearch} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Search Input Area */}
        <div className="flex items-center px-4 py-4 border-b border-gray-100 bg-white">
          <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products, categories..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 placeholder:text-gray-400"
          />
          {inputValue && (
            <button
              onClick={() => setInputValue("")}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="h-6 w-px bg-gray-200 mx-3 hidden sm:block" />
          <button
            onClick={closeSearch}
            className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-gray-900 transition-colors hidden sm:block"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto overscroll-contain flex-1 bg-gray-50/50">
          
          {/* Idle State (Prompt) */}
          {debouncedSearchTerm.length < 2 && (
            <div className="px-6 py-12 text-center text-sm text-gray-500">
              Type at least 2 characters to start searching.
            </div>
          )}

          {/* Loading State */}
          {showLoading && (
            <div className="px-6 py-12 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mb-3 text-[#006044]" />
              <p className="text-sm font-medium">Searching catalog...</p>
            </div>
          )}

          {/* Empty State */}
          {showEmpty && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-900 font-bold mb-1">No results found</p>
              <p className="text-sm text-gray-500">
                We couldn't find anything matching "{debouncedSearchTerm}"
              </p>
            </div>
          )}

          {/* Success State */}
          {showResults && !showLoading && (
            <div className="py-2">
              {results.map((product: any) => (
                <div
                  key={product.id}
                  onClick={() => {
                    router.push(`/product/${product.slug}`);
                    closeSearch();
                  }}
                  className="flex items-center px-4 py-3 hover:bg-white cursor-pointer transition-colors group border-l-2 border-transparent hover:border-[#006044]"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg relative overflow-hidden shrink-0 border border-gray-200/60">
                    <Image
                      src={isValidImageUrl(product.images?.[0]) ? product.images[0] : "/placeholder.png"}
                      fill
                      alt={product.name}
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>

                  {/* Details */}
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate group-hover:text-[#006044] transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {product.category?.name || "Uncategorized"}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="ml-4 flex items-center shrink-0">
                    <span className="text-sm font-black text-gray-900 mr-4">
                      ₹{product.price}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#006044] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center hidden sm:flex">
          <span>Navigate using <kbd className="font-sans px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-500 shadow-sm">Tab</kbd> and <kbd className="font-sans px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-500 shadow-sm">Enter</kbd></span>
          <span>Search provided by AE Naturals</span>
        </div>
      </div>
    </div>
  );
}