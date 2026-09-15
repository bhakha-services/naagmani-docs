'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { getAllPages } from '@/lib/navigation';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const allPages = useMemo(() => getAllPages(), []);

  // Filter pages based on query
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return allPages
      .filter((page) => page.title.toLowerCase().includes(q) || page.section.toLowerCase().includes(q) || page.href.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, allPages]);

  // Keyboard shortcut (Cmd/Ctrl + K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].href);
    }
  };

  if (!isOpen) return null;

  const quickLinks = [
    { title: 'What is Naagmani?', href: '/docs/introduction/what-is-naagmani', section: 'Introduction' },
    { title: 'Quickstart Guide', href: '/docs/quickstart/overview', section: 'Quickstart' },
    { title: 'Chat Completions API', href: '/docs/api/chat-completions', section: 'API Reference' },
    { title: 'Smart Model Routing', href: '/docs/concepts/routing', section: 'Concepts' },
    { title: 'Go HDK', href: '/docs/sdk/go', section: 'SDKs' },
    { title: 'CLI Commands', href: '/docs/cli/commands', section: 'CLI' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800 gap-3">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search documentation, APIs, SDKs, CLI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-500 hover:text-zinc-300 p-1 rounded"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="py-3 px-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold px-2 mb-2 block">
                Popular Guides
              </span>
              <div className="space-y-1">
                {quickLinks.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-900 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-emerald-500" />
                      <div>
                        <span className="text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-xs text-zinc-500 block">{item.section}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={item.href}
                    onClick={() => handleSelect(item.href)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors ${
                      isSelected ? 'bg-zinc-900 text-emerald-400' : 'text-zinc-200 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`} />
                      <div>
                        <span className="text-sm font-medium">{item.title}</span>
                        <span className="text-xs text-zinc-500 block">{item.section}</span>
                      </div>
                    </div>
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-zinc-500">
              No results found for &ldquo;<span className="text-zinc-300 font-medium">{query}</span>&rdquo;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-800/80 bg-zinc-950 text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <span>Navigate <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800">↓</kbd></span>
            <span>Select <kbd className="px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800">↵</kbd></span>
          </div>
          <span className="text-emerald-500">Naagmani Docs v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
