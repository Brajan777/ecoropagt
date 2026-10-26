'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Leaf, ArrowRight } from 'lucide-react';

export function AnnouncementBar() {
  const { siteConfig } = useApp();

  return (
    <div className="bg-verde-100 border-b border-verde-200 text-grafito-800 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-verde-200 text-verde-700 font-bold text-[11px]">
            <Leaf className="w-3.5 h-3.5 fill-current" /> Eco-Circular GT
          </span>
          <span className="truncate sm:overflow-visible">
            {siteConfig.announcementText} • <strong>{siteConfig.announcementSubtext}</strong>
          </span>
        </div>
        <a
          href="/#mi-closet-virtual"
          className="hidden sm:inline-flex items-center gap-1 font-bold text-lavanda-600 hover:underline shrink-0"
        >
          <span>¿Cómo abrir tu Clóset Virtual?</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
