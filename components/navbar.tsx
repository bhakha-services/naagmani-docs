'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Logo } from './logo';
import {
  Search,
  Sun,
  Moon,
  Menu,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  Terminal,
  ShoppingBag,
  Cpu,
  Server,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { SearchDialog } from './search-dialog';
import { headerNavTabs } from '@/lib/navigation';
import { siteConfig } from '@/lib/config';

const tabIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'get-started': Sparkles,
  'concepts': BookOpen,
  'developer-portal': LayoutDashboard,
  'api': Terminal,
  'marketplace': ShoppingBag,
  'build': Cpu,
  'deploy': Server,
};

export function Navbar({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const activeTabRef = useRef<HTMLAnchorElement | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  }, []);

  // Auto-scroll the active tab into view only on mobile / narrow viewports when tabs overflow
  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      if (container.scrollWidth > container.clientWidth + 8) {
        const tab = activeTabRef.current;
        const tabLeft = tab.offsetLeft;
        const tabWidth = tab.offsetWidth;
        const containerWidth = container.offsetWidth;
        const targetScroll = tabLeft - (containerWidth / 2) + (tabWidth / 2);

        container.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: 'smooth',
        });
        setTimeout(updateScrollState, 350);
      } else {
        container.scrollTo({ left: 0, behavior: 'instant' });
        updateScrollState();
      }
    }
  }, [pathname, updateScrollState]);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState]);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(updateScrollState, 300);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-md shadow-2xs">
        {/* Tier 1: Main Top Bar (Brand, Centered Search, and Actions) */}
        <div className="border-b border-zinc-200/70 dark:border-zinc-800/70">
          <div className="max-w-[1920px] 4xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 h-14 sm:h-15 flex items-center justify-between gap-2 sm:gap-6">
            {/* Left: Brand & Mobile Menu Button */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              {onMobileMenuToggle && (
                <button
                  onClick={onMobileMenuToggle}
                  className="lg:hidden p-1.5 sm:p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Toggle navigation menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              <Logo />
            </div>

            {/* Center: Prominent Global Search Bar */}
            <div className="flex-1 min-w-[100px] max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto px-1 sm:px-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center justify-between px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 transition-all shadow-xs group"
                aria-label="Search documentation (Cmd+K)"
              >
                <div className="flex items-center gap-1.5 sm:gap-2.5 truncate">
                  <Search className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-zinc-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                  <span className="truncate hidden sm:inline">Search docs, guides & APIs...</span>
                  <span className="truncate sm:hidden text-xs">Search docs...</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 shrink-0 ml-2">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded border border-zinc-300 dark:border-zinc-700 shadow-2xs">
                    ⌘K
                  </kbd>
                </div>
              </button>
            </div>

            {/* Right: Theme Toggle, GitHub Link & Quick Links */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-1.5 sm:p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                aria-label="Toggle theme"
              >
                <Sun className="w-4 h-4 hidden dark:block text-zinc-300 hover:text-amber-400 transition-colors" />
                <Moon className="w-4 h-4 block dark:hidden text-zinc-700 hover:text-emerald-600 transition-colors" />
              </button>

              {/* Developer Portal External Link */}
              <a
                href="http://localhost:3003"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors whitespace-nowrap"
              >
                <span>Portal</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
              </a>

              {/* Quickstart CTA */}
              <Link
                href="/get-started/quickstart"
                className="hidden sm:inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs transition-all whitespace-nowrap"
              >
                Quickstart
              </Link>
            </div>
          </div>
        </div>

        {/* Tier 2: Sub-Header Section Navigation Tabs with Dynamic Edge Fades */}
        <div className="relative bg-zinc-50/70 dark:bg-zinc-950/70 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div className="max-w-[1920px] 4xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative">
            {/* Left Fade Indicator & Scroll Button */}
            {canScrollLeft && (
              <div className="absolute left-4 sm:left-6 lg:left-8 2xl:left-12 top-0 bottom-0 z-20 flex items-center bg-gradient-to-r from-zinc-50 via-zinc-50/90 to-transparent dark:from-zinc-950 dark:via-zinc-950/90 pl-0.5 pr-4 pointer-events-none">
                <button
                  onClick={() => scrollTabs('left')}
                  className="pointer-events-auto hidden sm:flex p-1 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 transition-colors"
                  aria-label="Scroll tabs left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Right Fade Indicator & Scroll Button */}
            {canScrollRight && (
              <div className="absolute right-4 sm:right-6 lg:right-8 2xl:right-12 top-0 bottom-0 z-20 flex items-center justify-end bg-gradient-to-l from-zinc-50 via-zinc-50/90 to-transparent dark:from-zinc-950 dark:via-zinc-950/90 pr-0.5 pl-4 pointer-events-none">
                <button
                  onClick={() => scrollTabs('right')}
                  className="pointer-events-auto hidden sm:flex p-1 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 transition-colors"
                  aria-label="Scroll tabs right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Tabs Scroll Container */}
            <div
              ref={tabsContainerRef}
              onScroll={updateScrollState}
              onWheel={(e) => {
                if (tabsContainerRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                  tabsContainerRef.current.scrollLeft += e.deltaY;
                }
              }}
              className="overflow-x-auto scrollbar-none scroll-smooth touch-pan-x"
            >
              <div className="flex items-center gap-1 sm:gap-2 h-11 w-max">
                {headerNavTabs.map((tab) => {
                  const isActive =
                    tab.activeMatches.some((prefix) => pathname.startsWith(prefix) || pathname === prefix) ||
                    (tab.id === 'get-started' && (pathname === '/' || pathname === '/docs' || pathname === '/docs/'));
                  const TabIcon = tabIcons[tab.id] || Sparkles;

                  return (
                    <Link
                      key={tab.id}
                      ref={isActive ? activeTabRef : null}
                      href={tab.href}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs sm:text-[13px] font-medium transition-all whitespace-nowrap border-b-2 -mb-[1px] ${
                        isActive
                          ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/5 dark:bg-emerald-500/10'
                          : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <TabIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-500' : 'text-zinc-400 dark:text-zinc-500'}`} />
                      <span>{tab.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Dialog Modal */}
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
