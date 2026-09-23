'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Logo } from './logo';
import { Search, Sun, Moon, Github, Menu, X } from 'lucide-react';
import { SearchDialog } from './search-dialog';
import { siteConfig } from '@/lib/config';

export function Navbar({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { label: 'Docs', href: '/docs/introduction/what-is-naagmani', activeMatch: '/docs/introduction' },
    { label: 'API Reference', href: '/docs/api/overview', activeMatch: '/docs/api' },
    { label: 'Plugins', href: '/docs/plugins/overview', activeMatch: '/docs/plugins' },
    { label: 'SDKs', href: '/docs/sdk/go', activeMatch: '/docs/sdk' },
    { label: 'CLI', href: '/docs/cli/installation', activeMatch: '/docs/cli' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#09090B]/80 backdrop-blur-md">
        <div className="max-w-[1920px] 4xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {onMobileMenuToggle && (
              <button
                onClick={onMobileMenuToggle}
                className="md:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <Logo />
          </div>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.activeMatch) || pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, Theme Toggle, GitHub & CTA */}
          <div className="flex items-center gap-2.5">
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 hover:border-zinc-300 dark:hover:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400 transition-all shadow-sm group"
              aria-label="Search documentation (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
              <span className="hidden sm:inline">Search docs...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded border border-zinc-300 dark:border-zinc-700">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4 hidden dark:block text-zinc-300 hover:text-amber-400 transition-colors" />
              <Moon className="w-4 h-4 block dark:hidden text-zinc-700 hover:text-emerald-600 transition-colors" />
            </button>

            {/* GitHub Link */}
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              aria-label="Naagmani on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* CTA Button */}
            <Link
              href="/docs/quickstart/overview"
              className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Global Search Dialog Modal */}
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
