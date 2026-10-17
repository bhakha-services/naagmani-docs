'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { Logo } from '@/components/logo';
import {
  X,
  ArrowUpRight,
  Github,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  Terminal,
  ShoppingBag,
  Cpu,
  Server,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { headerNavTabs } from '@/lib/navigation';
import { siteConfig } from '@/lib/config';

const sectionTabIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'get-started': Sparkles,
  'concepts': BookOpen,
  'developer-portal': LayoutDashboard,
  'api': Terminal,
  'marketplace': ShoppingBag,
  'build': Cpu,
  'deploy': Server,
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />

      {/* Mobile & Tablet Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-[88vw] max-w-xs sm:max-w-sm bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-2xl flex flex-col h-full animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Title & Close Button */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              <div className="flex items-center gap-2">
                <Logo />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Center: Sections Switcher + Active Section Navigation */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
              {/* Sections Selector */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 font-semibold">
                  Documentation Sections
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {headerNavTabs.map((tab, idx) => {
                    const isActive =
                      tab.activeMatches.some((prefix) => pathname.startsWith(prefix) || pathname === prefix) ||
                      (tab.id === 'get-started' && (pathname === '/docs' || pathname === '/docs/'));
                    const TabIcon = sectionTabIcons[tab.id] || Sparkles;
                    const isLastOdd = idx === headerNavTabs.length - 1 && headerNavTabs.length % 2 !== 0;

                    return (
                      <Link
                        key={tab.id}
                        href={tab.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                          isLastOdd ? 'col-span-2' : ''
                        } ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30 shadow-2xs'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 border border-transparent'
                        }`}
                      >
                        <TabIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-500' : 'text-zinc-400 dark:text-zinc-500'}`} />
                        <span className="truncate">{tab.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Active Section Tree */}
              <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80">
                <Sidebar onItemClick={() => setMobileMenuOpen(false)} />
              </div>
            </div>

            {/* Drawer Footer: Quick Actions */}
            <div className="pt-3 mt-2 border-t border-zinc-200 dark:border-zinc-800 shrink-0 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="http://localhost:3003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  <span>Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                </a>
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              </div>
              <Link
                href="/docs/get-started/quickstart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full px-3 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs transition-all"
              >
                Quickstart Guide
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Container - Fluid & Ultrawide Responsive */}
      <div className="max-w-[1920px] 4xl:max-w-[2400px] mx-auto w-full px-4 sm:px-6 lg:px-8 2xl:px-12 flex-1 flex">
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block w-64 xl:w-72 2xl:w-80 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800/80 pr-6 2xl:pr-8 py-6 sticky top-[101px] max-h-[calc(100vh-101px)] overflow-y-auto scrollbar-none">
          <Sidebar />
        </div>

        {/* Dynamic Documentation Content */}
        {children}
      </div>
    </div>
  );
}
