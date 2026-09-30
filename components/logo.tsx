import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Official Naagmani Gem / Kernel Symbol */}
      <div
        className="relative flex items-center justify-center w-8 h-8 rounded-lg p-0.5 shrink-0 transition-all duration-200 group-hover:scale-105"
        style={{
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.2) 100%)",
          border: "1px solid rgba(16, 185, 129, 0.4)",
        }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="docsGemGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="0.5" stopColor="#10b981" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="docsOrbitGrad" x1="2" y1="16" x2="30" y2="16" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="1" stopColor="#38bdf8" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Outer Protective Octagon */}
          <polygon
            points="16,3 27,8 27,24 16,29 5,24 5,8"
            stroke="url(#docsOrbitGrad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.85"
          />

          {/* Inner Gem Facet Lattice */}
          <polygon
            points="16,7 23,11 23,21 16,25 9,21 9,11"
            fill="url(#docsGemGrad)"
            fillOpacity="0.22"
            stroke="url(#docsGemGrad)"
            strokeWidth="1.2"
          />

          {/* Core Radiant Nucleus */}
          <circle cx="16" cy="16" r="3.2" fill="#34d399" />
          <circle cx="16" cy="16" r="5" stroke="#34d399" strokeWidth="0.8" strokeDasharray="1.5 1.5" opacity="0.75" />

          {/* Cardinal Energy Rays */}
          <line x1="16" y1="3" x2="16" y2="7" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="16" y1="25" x2="16" y2="29" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="5" y1="16" x2="9" y2="16" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="23" y1="16" x2="27" y2="16" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex items-center gap-1.5 leading-none">
        <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-100 text-base group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
          Naagmani
        </span>
        <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          DOCS
        </span>
      </div>
    </Link>
  );
}
