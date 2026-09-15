import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PagerItem {
  title: string;
  href: string;
  section: string;
}

interface PagerProps {
  prev: PagerItem | null;
  next: PagerItem | null;
}

export function Pager({ prev, next }: PagerProps) {
  if (!prev && !next) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-emerald-500/[0.02] transition-all"
        >
          <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-500 transition-colors mb-1 font-mono">
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </span>
          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col items-end text-right p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-emerald-500/[0.02] transition-all"
        >
          <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-500 transition-colors mb-1 font-mono">
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
