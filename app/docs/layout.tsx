'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { X } from 'lucide-react';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200 dark:border-zinc-800">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 font-mono">
                DOCUMENTATION
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar onItemClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex">
        {/* Desktop Left Sidebar */}
        <div className="hidden md:block w-64 lg:w-72 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800/80 pr-6 py-8 sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <Sidebar />
        </div>

        {/* Dynamic Documentation Content */}
        {children}
      </div>
    </div>
  );
}
