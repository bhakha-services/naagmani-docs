'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { SearchDialog } from '@/components/search-dialog';
import { Search, Home, BookOpen, ArrowRight } from 'lucide-react';

export default function NotFound() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Error code badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20">
            404 ERROR
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Page not found
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            The documentation page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              Search Documentation
            </button>

            <Link
              href="/docs/introduction/what-is-naagmani"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Go to Documentation
            </Link>
          </div>

          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-emerald-500 transition-colors inline-flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              Return to Homepage
            </Link>
          </div>
        </div>
      </main>

      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
