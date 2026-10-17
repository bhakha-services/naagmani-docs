'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  getActiveSectionByPath,
  NavSection,
} from '@/lib/navigation';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Terminal,
  Cpu,
  ShoppingBag,
  Sparkles,
  LayoutDashboard,
  Server,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

const sectionIcons: Record<string, any> = {
  'GET STARTED': Sparkles,
  'ARCHITECTURE & CONCEPTS': BookOpen,
  'DEVELOPER PORTAL': LayoutDashboard,
  'API REFERENCE': Terminal,
  'MARKETPLACE': ShoppingBag,
  'BUILD WITH NAAGMANI': Cpu,
  'DEPLOYMENT & SELF-HOSTING': Server,
};

export function Sidebar({ className = '', onItemClick }: SidebarProps) {
  const pathname = usePathname();

  // Dynamically resolve the active section based on the current URL / selected header tab
  const activeSection: NavSection = getActiveSectionByPath(pathname);
  const ActiveIcon = sectionIcons[activeSection.title] || Layers;

  // State to collapse/expand specific sub-groups within the active section
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupTitle: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  return (
    <aside className={`w-full text-sm ${className}`} aria-label="Documentation Sidebar">
      <div className="space-y-4 pb-12">
        {/* Clean Active Section Header (No redundant dropdown) */}
        <div className="pb-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <ActiveIcon className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">{activeSection.title}</span>
          </div>
        </div>

        {/* Filtered Section Navigation */}
        <div className="space-y-3">
          {/* Direct Items (if any) */}
          {activeSection.items && activeSection.items.length > 0 && (
            <ul className="space-y-0.5">
              {activeSection.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onItemClick}
                      title={item.title}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs sm:text-[13px] transition-all ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border-l-2 border-emerald-500 shadow-2xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 ml-1.5">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Subgroups (if any) */}
          {activeSection.groups &&
            activeSection.groups.map((group) => {
              const isCollapsed = !!collapsedGroups[group.title];
              const hasActiveChild = group.items.some((item) => item.href === pathname);

              return (
                <div key={group.title} className="space-y-1 pt-1.5">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="w-full flex items-center justify-between px-2 py-1 text-xs font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase group"
                  >
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          hasActiveChild ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
                        }`}
                      />
                      {group.title}
                    </span>
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                    )}
                  </button>

                  {/* Group Items */}
                  {!isCollapsed && (
                    <div className="space-y-0.5 pl-2 border-l border-zinc-200 dark:border-zinc-800/80 ml-2">
                      <ul className="space-y-0.5">
                        {group.items.map((item) => {
                          const isActive = pathname === item.href;
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={onItemClick}
                                title={item.title}
                                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs sm:text-[13px] transition-all ${
                                  isActive
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border-l-2 border-emerald-500 shadow-2xs'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                                }`}
                              >
                                <span className="truncate">{item.title}</span>
                                {item.badge && (
                                  <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 ml-1.5">
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </aside>
  );
}
