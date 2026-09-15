'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { StatusBadge } from './status-badge';

interface ApiEndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  status?: 'available' | 'beta' | 'planned';
  description?: string;
}

export function ApiEndpoint({ method, path, status = 'available', description }: ApiEndpointProps) {
  const [copied, setCopied] = useState(false);

  const methodColors = {
    GET: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    POST: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    PUT: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    PATCH: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
    DELETE: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md border ${
              methodColors[method] || methodColors.GET
            }`}
          >
            {method}
          </span>
          <code className="text-sm md:text-base font-mono font-semibold text-zinc-900 dark:text-zinc-100">
            {path}
          </code>
          <button
            onClick={handleCopy}
            className="text-zinc-400 hover:text-emerald-500 transition-colors p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
            title="Copy path"
            aria-label="Copy endpoint path"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {status && <StatusBadge status={status} />}
      </div>

      {description && (
        <p className="mt-2.5 text-sm text-zinc-600 dark:text-zinc-400 leading-normal">
          {description}
        </p>
      )}
    </div>
  );
}
