'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export interface CodeTabItem {
  label: string;
  lang: string;
  code: string;
  highlightedHtml?: string;
}

interface CodeTabsProps {
  tabs: CodeTabItem[];
  defaultTab?: number;
}

export function CodeTabs({ tabs, defaultTab = 0 }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [copied, setCopied] = useState(false);

  const currentTab = tabs[activeTab] || tabs[0];

  const handleCopy = async () => {
    if (!currentTab) return;
    await navigator.clipboard.writeText(currentTab.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl border border-zinc-800 bg-[#09090B] overflow-hidden shadow-lg">
      {/* Tab Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-800 bg-zinc-950/80">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {tabs.map((tab, idx) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                activeTab === idx
                  ? 'bg-zinc-800 text-emerald-400 font-semibold border border-zinc-700/80 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/80 rounded transition-all"
          aria-label="Copy code snippet"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Display */}
      {currentTab?.highlightedHtml ? (
        <div
          className="shiki-code-container p-4 text-xs md:text-sm font-mono overflow-x-auto leading-relaxed"
          dangerouslySetInnerHTML={{ __html: currentTab.highlightedHtml }}
        />
      ) : (
        <pre className="p-4 text-xs md:text-sm font-mono text-zinc-100 overflow-x-auto leading-relaxed">
          <code>{currentTab?.code}</code>
        </pre>
      )}
    </div>
  );
}
