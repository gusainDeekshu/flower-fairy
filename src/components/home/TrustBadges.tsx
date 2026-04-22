// src\components\home\TrustBadges.tsx

"use client";

import React from 'react';
import { Leaf, ShieldCheck, Droplet, HeartHandshake } from 'lucide-react';

export const TrustBadges = () => {
  // You can also drive this via your CMS settings, 
  // but for Trust Badges, hardcoding is often safer for layout stability.
  const badges = [
    { icon: Leaf, title: "100% Vegan", desc: "Plant-based goodness" },
    { icon: Droplet, title: "Paraben Free", desc: "No harmful chemicals" },
    { icon: ShieldCheck, title: "Dermato Tested", desc: "Safe for all skin types" },
    { icon: HeartHandshake, title: "Cruelty Free", desc: "Never tested on animals" }
  ];

  return (
    <section className="w-full border-t border-gray-200 bg-[#fbf9f6] py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
        {badges.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-white p-3 shadow-sm">
                <Icon className="h-8 w-8 text-green-700" strokeWidth={1.5} />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-tight text-gray-900">
                {badge.title}
              </h4>
              <p className="mt-1 text-[11px] text-gray-500 uppercase tracking-widest">
                {badge.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustBadges;