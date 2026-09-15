import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      {/* Naagmani Emblem Icon */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-emerald-500/30 group-hover:border-emerald-500/60 shadow-sm transition-all">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-emerald-500 group-hover:text-emerald-400 transition-colors"
        >
          {/* Stylized Naagmani Diamond / Serpent Gem */}
          <path
            d="M12 2L20 8V16L12 22L4 16V8L12 2Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 6L16 9.5V14.5L12 18L8 14.5V9.5L12 6Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-100 text-base group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
          Naagmani
        </span>
        <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          DOCS
        </span>
      </div>
    </Link>
  );
}
