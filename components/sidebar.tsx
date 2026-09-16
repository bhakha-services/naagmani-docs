'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationData, NavSection } from '@/lib/navigation';
import { ChevronDown, ChevronRight, BookOpen, Layers, Terminal, Shield, Zap, Cpu, ShoppingBag, AlertCircle, Sparkles, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

const sectionIcons: Record<string, any> = {
  'GET STARTED': Sparkles,
  'DEVELOPER PORTAL': LayoutDashboard,
  'CONCEPTS': Layers,
  'API REFERENCE': Terminal,
  'PLUGINS & HDKs': Cpu,
  'SDKs': BookOpen,
  'CLI MANUAL': Terminal,
  'INTEGRATIONS': Zap,
  'SECURITY & GOVERNANCE': Shield,
  'PRODUCTION OPERATIONS': Zap,
  'MARKETPLACE': ShoppingBag,
  'TROUBLESHOOTING': AlertCircle,
};

export function Sidebar({ className = '', onItemClick }: SidebarProps) {
  const pathname = usePathname();

  // Keep track of collapsed sections (default open)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside className={`w-full text-sm ${className}`} aria-label="Documentation Sidebar">
      <div className="space-y-6 pb-12">
        {navigationData.map((section: NavSection) => {
          const isCollapsed = !!collapsedSections[section.title];
          const Icon = sectionIcons[section.title] || Layers;

          return (
            <div key={section.title} className="space-y-2">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between py-1 text-xs font-mono font-bold tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase group"
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
                  {section.title}
                </span>
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
                )}
              </button>

              {/* Section Content */}
              {!isCollapsed && (
                <div className="space-y-3 pl-2 border-l border-zinc-200 dark:border-zinc-800/80 ml-1.5">
                  {/* Direct Items */}
                  {section.items && (
                    <ul className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={onItemClick}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                                isActive
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border-r-2 border-emerald-500'
                                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                              }`}
                            >
                              <span>{item.title}</span>
                              {item.badge && (
                                <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {/* Subgroups */}
                  {section.groups &&
                    section.groups.map((group) => (
                      <div key={group.title} className="space-y-1 pt-1">
                        <span className="block px-2 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                          {group.title}
                        </span>
                        <ul className="space-y-0.5">
                          {group.items.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={onItemClick}
                                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                                    isActive
                                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border-r-2 border-emerald-500'
                                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                                  }`}
                                >
                                  <span>{item.title}</span>
                                  {item.badge && (
                                    <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                      {item.badge}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
