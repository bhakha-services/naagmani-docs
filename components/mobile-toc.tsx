'use client';

import React, { useState } from 'react';
import { DocHeading } from '@/lib/docs';
import { AlignLeft, ChevronDown } from 'lucide-react';

interface MobileTocProps {
  headings: DocHeading[];
}

export function MobileToc({ headings }: MobileTocProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!headings || headings.length === 0) return null;

  return (
    <div className="xl:hidden my-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 overflow-hidden text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left font-mono font-medium text-zinc-700 dark:text-zinc-300 hover:text-emerald-500 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <AlignLeft className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>On this page ({headings.length})</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-500' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-3.5 pb-3 pt-1 border-t border-zinc-200 dark:border-zinc-800 max-h-60 overflow-y-auto scrollbar-thin">
          <ul className="space-y-1.5 pt-1">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={heading.level === 3 ? 'pl-3' : 'pl-0'}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    const el = document.getElementById(heading.id);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                      history.pushState(null, '', `#${heading.id}`);
                    }
                  }}
                  className="block text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors py-0.5 truncate"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
