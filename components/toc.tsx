'use client';

import React, { useEffect, useState } from 'react';
import { DocHeading } from '@/lib/docs';
import { AlignLeft } from 'lucide-react';

interface TocProps {
  headings: DocHeading[];
}

export function TableOfContents({ headings }: TocProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0% -60% 0%', threshold: 0.1 }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pl-4 text-sm" aria-label="Table of contents">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 font-semibold">
        <AlignLeft className="w-3.5 h-3.5 text-emerald-500" />
        <span>On this page</span>
      </div>

      <ul className="space-y-2 border-l border-zinc-200 dark:border-zinc-800">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id} className={heading.level === 3 ? 'pl-3' : 'pl-0'}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(heading.id);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    setActiveId(heading.id);
                    history.pushState(null, '', `#${heading.id}`);
                  }
                }}
                className={`block -ml-px pl-3 py-0.5 text-xs transition-colors border-l ${
                  isActive
                    ? 'border-emerald-500 text-emerald-500 dark:text-emerald-400 font-medium'
                    : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600'
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
