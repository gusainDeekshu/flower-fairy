"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { MenuGroup } from '@/services/menu.service';

export default function MegaMenuClient({ groups }: { groups: MenuGroup[] }) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  return (
    <nav className="flex items-center space-x-10 h-14" onMouseLeave={() => setActiveGroup(null)}>
      {groups.map((group) => (
        <div 
          key={group.id} 
          className="relative h-full flex items-center"
          onMouseEnter={() => setActiveGroup(group.id)}
        >
          {/* Main Nav Link */}
          <button className={`flex items-center space-x-1 text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#006044] ${activeGroup === group.id ? 'text-[#006044]' : 'text-gray-700'}`}>
            <span>{group.title}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeGroup === group.id ? 'rotate-180' : ''}`} />
          </button>

          {/* Mega Dropdown Content */}
          {activeGroup === group.id && (
            <div className="fixed left-0 top-[110px] w-full bg-white shadow-2xl border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
              <div className="mx-auto max-w-7xl px-8 py-10">
                <div className="grid grid-cols-12 gap-10">
                  
                  {/* Category Links Column (60% Width) */}
                  <div className="col-span-7 grid grid-cols-2 gap-8 border-r border-gray-100">
                    <div>
                      <h3 className="text-xs font-black uppercase text-gray-400 tracking-[0.2em] mb-6">
                        Top Categories
                      </h3>
                      <ul className="space-y-4">
                        {group.items.map((item) => (
                          <li key={item.id}>
                            <Link 
                              href={item.type === 'COLLECTION' ? `/collections/${item.slug}` : `/${item.slug}`}
                              className="group flex items-center text-[15px] font-bold text-gray-800 hover:text-[#006044] transition-all"
                            >
                              <span className="w-0 group-hover:w-4 h-[2px] bg-[#006044] mr-0 group-hover:mr-2 transition-all duration-300"></span>
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Promotional Section (40% Width) */}
                  <div className="col-span-5 flex flex-col justify-center">
                    {group.image ? (
                      <div className="relative group/promo aspect-[16/8] w-full overflow-hidden rounded-2xl bg-gray-100">
                         <Link href={group.link || '#'}>
                            <Image 
                              src={group.image} 
                              alt={group.title} 
                              fill 
                              className="object-cover transition-transform duration-700 group-hover/promo:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover/promo:bg-transparent transition-colors" />
                         </Link>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl p-10">
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest text-center">
                          AE Naturals Quality Assurance
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}