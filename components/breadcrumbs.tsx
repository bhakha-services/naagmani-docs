import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumbs"
      className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-4 overflow-x-auto whitespace-nowrap py-1 scrollbar-none"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-emerald-500 transition-colors shrink-0"
        aria-label="Home"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.label} className="flex items-center gap-1.5 shrink-0">
            <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-zinc-600 shrink-0" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[220px] sm:max-w-none">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
