// src/components/layout/Footer.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail } from 'lucide-react';
import { apiClient } from "@/lib/api-client";
import { BRAND } from "@/config/brand.config";

interface FooterLink { id: string; label: string; url: string; }
interface FooterColumn { id: string; title: string; links: FooterLink[]; }

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
    <footer className="bg-[#0f172a] text-gray-300 pt-14 pb-8 px-6 md:px-10">

      {/* TOP */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

        {/* ✅ BRAND BLOCK */}
        <div className="md:col-span-4 space-y-5">

          {/* Logo + Name */}
          <div className="flex items-center gap-3">
            <Image
              src={BRAND.logo}
              alt={BRAND.name}
              width={40}
              height={40}
              className="rounded-md object-contain"
            />
            <h2 className="text-white text-lg font-bold">
              {BRAND.name}
            </h2>
          </div>

          {/* Tagline */}
          <p className="text-sm opacity-70 leading-relaxed">
            Natural wellness products crafted for modern lifestyles.
          </p>

          {/* Contact */}
          <div className="space-y-2 text-sm">
            <a
              href={`tel:${BRAND.phone}`}
              className="flex items-center gap-2 hover:text-white transition"
            >
              <Phone size={16}/> {BRAND.phone}
            </a>

            <a
              href={`mailto:${BRAND.email}`}
              className="flex items-center gap-2 hover:text-white transition"
            >
              <Mail size={16}/> {BRAND.email}
            </a>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            className="inline-block text-sm font-medium px-4 py-2 rounded-md text-white"
            style={{ backgroundColor: BRAND.theme.primary }}
          >
            Chat on WhatsApp
          </a>

          {/* Social */}
          <div className="flex gap-3 pt-2">
            <a href={BRAND.social.facebook} target="_blank" className="p-2 bg-blue-600 rounded-full hover:opacity-80">
              <Facebook size={16}/>
            </a>
            <a href={BRAND.social.twitter} target="_blank" className="p-2 bg-sky-400 rounded-full hover:opacity-80">
              <Twitter size={16}/>
            </a>
            <a href={BRAND.social.instagram} target="_blank" className="p-2 bg-pink-600 rounded-full hover:opacity-80">
              <Instagram size={16}/>
            </a>
            <a href={BRAND.social.youtube} target="_blank" className="p-2 bg-red-600 rounded-full hover:opacity-80">
              <Youtube size={16}/>
            </a>
          </div>

        </div>

        {/* ✅ DYNAMIC COLUMNS */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {columns.length > 0 ? (
            columns.map((col) => (
              <div key={col.id}>
                <h3 className="text-white font-semibold mb-4 text-sm tracking-wide">
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

      <hr className="border-gray-700 mb-6" />

      {/* BOTTOM */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-sm opacity-60">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>

        {/* Payments */}
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-60">We Accept:</span>
          {['Visa', 'MC', 'Paytm', 'UPI'].map((pay) => (
            <span key={pay} className="bg-white text-gray-800 text-[10px] font-bold px-2 py-1 rounded">
              {pay}
            </span>
          ))}
        </div>

      </div>
    </footer>
  );
}