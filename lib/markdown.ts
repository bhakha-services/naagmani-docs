import { Marked } from 'marked';
import { createHighlighter, type Highlighter } from 'shiki';
import { replaceEnvUrls } from './env-urls';

export { replaceEnvUrls } from './env-urls';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const SUPPORTED_LANGS = [
  'json',
  'jsonc',
  'javascript',
  'typescript',
  'tsx',
  'jsx',
  'bash',
  'sh',
  'python',
  'rust',
  'yaml',
  'toml',
  'sql',
  'html',
  'css',
  'markdown',
  'dockerfile',
  'go',
  'c',
  'cpp',
  'diff',
  'graphql',
  'proto',
  'text',
];

const LANG_ALIASES: Record<string, string> = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  mts: 'typescript',
  cts: 'typescript',
  shell: 'bash',
  zsh: 'bash',
  py: 'python',
  rs: 'rust',
  yml: 'yaml',
  md: 'markdown',
  mdx: 'markdown',
  docker: 'dockerfile',
  golang: 'go',
};

let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: SUPPORTED_LANGS,
    });
  }
  return highlighterPromise;
}

function normalizeLang(lang?: string): string {
  if (!lang) return 'text';
  const clean = lang.trim().toLowerCase();
  return LANG_ALIASES[clean] || clean;
}

export async function highlightCodeSnippet(code: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter();
  const targetLang = normalizeLang(lang);
  const loadedLangs = highlighter.getLoadedLanguages();
  const safeLang = loadedLangs.includes(targetLang) ? targetLang : 'text';

  try {
    return highlighter.codeToHtml(code, {
      lang: safeLang,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    });
  } catch (err) {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre class="shiki"><code>${escaped}</code></pre>`;
  }
}

const ALERT_CONFIGS: Record<
  string,
  {
    title: string;
    border: string;
    bg: string;
    text: string;
    iconSvg: string;
  }
> = {
  NOTE: {
    title: 'Note',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5 dark:bg-blue-500/10',
    text: 'text-blue-500 dark:text-blue-400',
    iconSvg: `<svg class="w-4 h-4 shrink-0 text-blue-500 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  },
  INFO: {
    title: 'Info',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5 dark:bg-blue-500/10',
    text: 'text-blue-500 dark:text-blue-400',
    iconSvg: `<svg class="w-4 h-4 shrink-0 text-blue-500 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  },
  TIP: {
    title: 'Tip',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5 dark:bg-emerald-500/10',
    text: 'text-emerald-500 dark:text-emerald-400',
    iconSvg: `<svg class="w-4 h-4 shrink-0 text-emerald-500 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  },
  IMPORTANT: {
    title: 'Important',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/5 dark:bg-purple-500/10',
    text: 'text-purple-500 dark:text-purple-400',
    iconSvg: `<svg class="w-4 h-4 shrink-0 text-purple-500 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  },
  WARNING: {
    title: 'Warning',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5 dark:bg-amber-500/10',
    text: 'text-amber-500 dark:text-amber-400',
    iconSvg: `<svg class="w-4 h-4 shrink-0 text-amber-500 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },
  CAUTION: {
    title: 'Caution',
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/5 dark:bg-rose-500/10',
    text: 'text-rose-500 dark:text-rose-400',
    iconSvg: `<svg class="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  },
  DANGER: {
    title: 'Danger',
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/5 dark:bg-rose-500/10',
    text: 'text-rose-500 dark:text-rose-400',
    iconSvg: `<svg class="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  },
};

export async function compileMarkdown(content: string, currentSlug: string[]): Promise<string> {
  const processedContent = replaceEnvUrls(content);
  const highlighter = await getHighlighter();
  const marked = new Marked();

  // Custom renderer with explicit return types
  const renderer = {
    heading(this: any, { tokens, depth }: { tokens: any[]; depth: number }): string {
      const text = this.parser.parseInline(tokens);
      if (depth === 1) {
        // Skip H1 as it will be rendered by page header component
        return '';
      }
      const plainText = text.replace(/<[^>]*>/g, '').replace(/`/g, '');
      const id = slugify(plainText);
      const tag = `h${depth}`;
      return `<${tag} id="${id}" class="group flex items-center gap-2">
        <span>${text}</span>
        <a href="#${id}" class="opacity-0 group-hover:opacity-100 text-emerald-500 hover:text-emerald-400 text-sm font-mono transition-opacity ml-1" aria-label="Permalink to ${plainText}">#</a>
      </${tag}>\n`;
    },

    link(this: any, { href, title, tokens }: { href: string; title?: string | null; tokens: any[] }): string {
      const text = this.parser.parseInline(tokens);
      let targetHref = href;

      // Handle relative .md links
      if (targetHref && !targetHref.startsWith('http') && !targetHref.startsWith('#') && !targetHref.startsWith('mailto:')) {
        let cleanPath = targetHref.replace(/\.md$/, '');
        
        if (cleanPath.startsWith('../')) {
          // relative to parent
          const parentSlug = currentSlug.slice(0, -1);
          const parts = cleanPath.split('/');
          let upCount = 0;
          while (parts[0] === '..') {
            parts.shift();
            upCount++;
          }
          const baseSlug = parentSlug.slice(0, Math.max(0, parentSlug.length - (upCount - 1)));
          targetHref = `/docs/${[...baseSlug, ...parts].join('/')}`;
        } else if (!cleanPath.startsWith('/') && !cleanPath.startsWith('./')) {
          // relative to current directory
          const currentDir = currentSlug.slice(0, -1);
          targetHref = `/docs/${[...currentDir, cleanPath].join('/')}`;
        } else if (cleanPath.startsWith('./')) {
          const currentDir = currentSlug.slice(0, -1);
          targetHref = `/docs/${[...currentDir, cleanPath.slice(2)].join('/')}`;
        }
      }

      const isExternal = targetHref.startsWith('http');
      const extAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      const titleAttr = title ? ` title="${title}"` : '';

      return `<a href="${targetHref}" class="text-emerald-500 hover:text-emerald-400 underline decoration-emerald-500/40 hover:decoration-emerald-400 font-medium transition-colors"${titleAttr}${extAttrs}>${text}</a>`;
    },

    table(this: any, { header, rows }: { header: any[]; rows: any[][] }): string {
      const headerHtml = header.map((cell: any) => `<th>${this.parser.parseInline(cell.tokens)}</th>`).join('');
      const bodyHtml = rows
        .map((row: any[]) => {
          const rowContent = row.map((cell: any) => `<td>${this.parser.parseInline(cell.tokens)}</td>`).join('');
          return `<tr>${rowContent}</tr>`;
        })
        .join('');

      return `<div class="overflow-x-auto my-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table class="w-full text-left text-sm">
          <thead class="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <tr>${headerHtml}</tr>
          </thead>
          <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
            ${bodyHtml}
          </tbody>
        </table>
      </div>`;
    },

    code(this: any, { text, lang }: { text: string; lang?: string }): string {
      const rawLang = (lang || 'text').trim().toLowerCase();

      if (rawLang === 'mermaid') {
        const encoded = encodeURIComponent(text);
        const escaped = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        return `<div class="mermaid-diagram-wrapper my-6 not-prose" data-mermaid="${encoded}">
          <div class="p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/60 flex items-center justify-center text-sm text-zinc-400">
            <div class="flex items-center gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Rendering diagram...</span>
            </div>
          </div>
          <pre class="hidden"><code>${escaped}</code></pre>
        </div>`;
      }

      const targetLang = normalizeLang(rawLang);
      const loadedLangs = highlighter.getLoadedLanguages();
      const safeLang = loadedLangs.includes(targetLang) ? targetLang : 'text';

      let highlightedHtml = '';
      try {
        highlightedHtml = highlighter.codeToHtml(text, {
          lang: safeLang,
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
          defaultColor: false,
        });
      } catch (err) {
        const escaped = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        highlightedHtml = `<pre class="shiki"><code>${escaped}</code></pre>`;
      }

      return `<div class="code-block-wrapper relative my-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#09090B] overflow-hidden group shadow-lg not-prose">
        <div class="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-950/70 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
          <span class="flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-500/80"></span>
            ${rawLang}
          </span>
          <button onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('code').innerText); this.innerText='Copied!'; setTimeout(() => this.innerText='Copy', 2000)" class="px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1">
            Copy
          </button>
        </div>
        <div class="shiki-code-container p-4 overflow-x-auto text-sm font-mono leading-relaxed">
          ${highlightedHtml}
        </div>
      </div>`;
    },

    blockquote(this: any, { tokens }: { tokens: any[] }): string {
      const quote = this.parser.parse(tokens);
      const alertMatch = quote.match(/^\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|INFO|DANGER)\](?:\s*<br\s*\/?>|\s+)?([\s\S]*?)<\/p>([\s\S]*)$/i);

      if (alertMatch) {
        const typeKey = alertMatch[1].toUpperCase();
        const config = ALERT_CONFIGS[typeKey] || ALERT_CONFIGS.NOTE;
        const firstPara = alertMatch[2].trim();
        const remaining = alertMatch[3].trim();

        let innerContent = '';
        if (firstPara) {
          innerContent += `<p>${firstPara}</p>`;
        }
        if (remaining) {
          innerContent += remaining;
        }

        return `<div class="my-6 rounded-lg border ${config.border} ${config.bg} p-4 text-sm leading-relaxed shadow-sm not-prose">
          <div class="flex items-center gap-2 font-semibold ${config.text} text-xs tracking-wider uppercase mb-2">
            ${config.iconSvg}
            <span>${config.title}</span>
          </div>
          <div class="text-zinc-700 dark:text-zinc-300 [&>p]:mb-2 [&>p:last-child]:mb-0 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-zinc-200/60 dark:[&_code]:bg-zinc-800/80 [&_code]:text-xs [&_code]:font-mono">
            ${innerContent}
          </div>
        </div>`;
      }

      return `<blockquote class="my-4 border-l-2 border-emerald-500 bg-emerald-500/5 px-4 py-3 rounded-r text-zinc-700 dark:text-zinc-300">
        ${quote}
      </blockquote>`;
    },
  };

  marked.use({ renderer });

  return marked.parse(content) as string;
}
