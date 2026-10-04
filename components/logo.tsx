import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Official Naagmani Gem / Kernel Symbol (Adaptive for Light & Dark) */}
      <div
        className="relative flex items-center justify-center w-8 h-8 rounded-xl p-0.5 shrink-0 transition-all duration-200 group-hover:scale-105 shadow-sm
          bg-gradient-to-br from-emerald-100/90 via-teal-50 to-cyan-100/90 border border-emerald-300/80 shadow-emerald-500/10
          dark:bg-gradient-to-br dark:from-emerald-950/40 dark:via-emerald-900/20 dark:to-cyan-950/30 dark:border-emerald-500/30 dark:shadow-md dark:shadow-emerald-950/40"
      >
        {/* LIGHT MODE SVG (High-contrast rich Emerald & Cyan) */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block dark:hidden"
        >
          <defs>
            <linearGradient id="docsGemGradLight" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#059669" />
              <stop offset="0.5" stopColor="#0d9488" />
              <stop offset="1" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="docsOrbitGradLight" x1="2" y1="16" x2="30" y2="16" gradientUnits="userSpaceOnUse">
              <stop stopColor="#059669" />
              <stop offset="1" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Outer Protective Octagon */}
          <polygon
            points="16,3 27,8 27,24 16,29 5,24 5,8"
            stroke="url(#docsGemGradLight)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Inner Gem Facet Lattice */}
          <polygon
            points="16,7 23,11 23,21 16,25 9,21 9,11"
            fill="url(#docsGemGradLight)"
            fillOpacity="0.18"
            stroke="url(#docsGemGradLight)"
            strokeWidth="1.5"
          />

          {/* Core Radiant Nucleus */}
          <circle cx="16" cy="16" r="3.2" fill="#059669" />
          <circle cx="16" cy="16" r="5" stroke="#059669" strokeWidth="0.9" strokeDasharray="1.5 1.5" opacity="0.85" />

          {/* Cardinal Energy Rays */}
          <line x1="16" y1="3" x2="16" y2="7" stroke="url(#docsGemGradLight)" strokeWidth="1.5" strokeLinecap="butt" />
          <line x1="16" y1="25" x2="16" y2="29" stroke="url(#docsGemGradLight)" strokeWidth="1.5" strokeLinecap="butt" />
          <line x1="5" y1="16" x2="9" y2="16" stroke="url(#docsGemGradLight)" strokeWidth="1.5" strokeLinecap="butt" />
          <line x1="23" y1="16" x2="27" y2="16" stroke="url(#docsGemGradLight)" strokeWidth="1.5" strokeLinecap="butt" />
        </svg>

        {/* DARK MODE SVG (Luminous Glowing Emerald & Mint) */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full hidden dark:block"
        >
          <defs>
            <linearGradient id="docsGemGradDark" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="0.5" stopColor="#10b981" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="docsOrbitGradDark" x1="2" y1="16" x2="30" y2="16" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="1" stopColor="#38bdf8" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Outer Protective Octagon */}
          <polygon
            points="16,3 27,8 27,24 16,29 5,24 5,8"
            stroke="url(#docsGemGradDark)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Inner Gem Facet Lattice */}
          <polygon
            points="16,7 23,11 23,21 16,25 9,21 9,11"
            fill="url(#docsGemGradDark)"
            fillOpacity="0.25"
            stroke="url(#docsGemGradDark)"
            strokeWidth="1.5"
          />

          {/* Core Radiant Nucleus */}
          <circle cx="16" cy="16" r="3.2" fill="#34d399" />
          <circle cx="16" cy="16" r="5" stroke="#34d399" strokeWidth="0.8" strokeDasharray="1.5 1.5" opacity="0.8" />

          {/* Cardinal Energy Rays */}
          <line x1="16" y1="3" x2="16" y2="7" stroke="url(#docsGemGradDark)" strokeWidth="1.5" strokeLinecap="butt" />
          <line x1="16" y1="25" x2="16" y2="29" stroke="url(#docsGemGradDark)" strokeWidth="1.5" strokeLinecap="butt" />
          <line x1="5" y1="16" x2="9" y2="16" stroke="url(#docsGemGradDark)" strokeWidth="1.5" strokeLinecap="butt" />
          <line x1="23" y1="16" x2="27" y2="16" stroke="url(#docsGemGradDark)" strokeWidth="1.5" strokeLinecap="butt" />
        </svg>
      </div>

      <div className="flex items-center gap-1.5 leading-none">
        <span className="font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          Naagmani
        </span>
        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded-md bg-emerald-100/70 text-emerald-800 border border-emerald-300/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30">
          DOCS
        </span>
      </div>
    </Link>
  );
}
