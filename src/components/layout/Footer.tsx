// src/components/layout/Footer.tsx

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  Mail,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { BRAND } from "@/config/brand.config";

interface FooterLink {
  id: string;
  label: string;
  url: string;
}
interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

async function getFooterData(): Promise<FooterColumn[]> {
  try {
    const response = await apiClient.get("/footer");
    const data = response.data || response;
    return data.columns || [];
  } catch (error) {
    console.error("Failed to fetch footer:", error);
    return [];
  }
}

export async function Footer() {
  const columns = await getFooterData();

  return (
    <footer className="bg-[#0f172a] text-gray-300 pt-16 pb-10 px-6 md:px-10">

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">

        {/* 🔥 BRAND BLOCK (FIXED WIDTH + STRONG ALIGNMENT) */}
        <div className="md:col-span-5 flex flex-col items-start space-y-6">

          {/* Logo */}
          <div className="relative w-[220px] h-[90px]">
            <Image
              src={BRAND.logo}
              alt={BRAND.name}
              fill
              className="object-contain object-left"
              priority
            />
          </div>

          {/* Tagline */}
          <p className="text-sm opacity-70 max-w-sm leading-relaxed">
            Natural wellness products crafted for modern lifestyles.
          </p>

          {/* Contact */}
          <div className="space-y-2 text-sm">
            <a href={`tel:${BRAND.phone}`} className="flex items-center gap-2 hover:text-white">
              <Phone size={16}/> {BRAND.phone}
            </a>
            <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 hover:text-white">
              <Mail size={16}/> {BRAND.email}
            </a>
          </div>

          {/* CTA */}
          <a
            href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            className="px-5 py-2.5 rounded-md text-sm font-medium text-white"
            style={{ backgroundColor: BRAND.theme.primary }}
          >
            Chat on WhatsApp
          </a>

          {/* Social */}
          <div className="flex gap-3 pt-2">
            <a href={BRAND.social.facebook} className="p-2 bg-blue-600 rounded-full">
              <Facebook size={16}/>
            </a>
            <a href={BRAND.social.twitter} className="p-2 bg-sky-400 rounded-full">
              <Twitter size={16}/>
            </a>
            <a href={BRAND.social.instagram} className="p-2 bg-pink-600 rounded-full">
              <Instagram size={16}/>
            </a>
            <a href={BRAND.social.youtube} className="p-2 bg-red-600 rounded-full">
              <Youtube size={16}/>
            </a>
          </div>

        </div>

        {/* 🔥 LINK COLUMNS (ALIGNED TOP) */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-10">

          {columns.length > 0 ? (
            columns.map((col) => (
              <div key={col.id} className="flex flex-col">
                <h3 className="text-white font-semibold mb-4 text-sm">
                  {col.title}
                </h3>

                <ul className="space-y-2 text-sm opacity-80">
                  {col.links.map((link) => (
                    <li key={link.id}>
                      <Link href={link.url} className="hover:text-white transition">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">Loading...</div>
          )}

        </div>

      </div>

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto mt-14 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* LEFT */}
        <p className="text-sm opacity-60">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-60">We Accept:</span>
          {["Visa", "MC", "Paytm", "UPI"].map((pay) => (
            <span
              key={pay}
              className="bg-white text-gray-800 text-[10px] font-bold px-2 py-1 rounded"
            >
              {pay}
            </span>
          ))}
        </div>

      </div>

    </footer>
  );
}