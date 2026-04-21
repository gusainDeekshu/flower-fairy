// src\components\home\TrustTicker.tsx

import React from "react";
import { Leaf, Droplet, ShieldCheck, Rabbit } from "lucide-react";

const badges = [
  { icon: Leaf, text: "100% Vegan Formulations" },
  { icon: Droplet, text: "Dermatologically Tested" },
  { icon: Rabbit, text: "Cruelty Free" },
  { icon: ShieldCheck, text: "No Harsh Chemicals" },
];

export function TrustTicker() {
  return (
    <div className="w-full bg-[#F9F9F9] border-y border-gray-100 py-4 overflow-hidden flex whitespace-nowrap">
      <div className="flex animate-marquee gap-12 md:gap-24 px-8 items-center min-w-full justify-around">
        {badges.map((badge, idx) => (
          <div key={idx} className="flex items-center gap-3 text-gray-800">
            <badge.icon className="w-5 h-5 text-[#006044]" strokeWidth={1.5} />
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest">{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}