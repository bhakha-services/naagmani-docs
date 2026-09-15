import React from 'react';
import { Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface CalloutProps {
  type?: 'note' | 'tip' | 'warning' | 'danger' | 'info';
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = 'note', title, children }: CalloutProps) {
  const configs = {
    note: {
      icon: Info,
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/5',
      text: 'text-emerald-500',
      title: title || 'Note',
    },
    tip: {
      icon: CheckCircle2,
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      title: title || 'Tip',
    },
    warning: {
      icon: AlertTriangle,
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/5',
      text: 'text-amber-500',
      title: title || 'Warning',
    },
    danger: {
      icon: XCircle,
      border: 'border-rose-500/30',
      bg: 'bg-rose-500/5',
      text: 'text-rose-500',
      title: title || 'Important',
    },
    info: {
      icon: Info,
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/5',
      text: 'text-blue-500',
      title: title || 'Info',
    },
  };

  const config = configs[type] || configs.note;
  const Icon = config.icon;

  return (
    <div className={`my-6 rounded-lg border ${config.border} ${config.bg} p-4 text-sm leading-relaxed shadow-sm`}>
      <div className="flex items-center gap-2 font-semibold mb-2">
        <Icon className={`w-4 h-4 ${config.text}`} />
        <span className={config.text}>{config.title}</span>
      </div>
      <div className="text-zinc-700 dark:text-zinc-300 [&>p]:mb-2 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
