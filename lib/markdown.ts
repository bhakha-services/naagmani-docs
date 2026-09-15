import { Marked } from 'marked';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function compileMarkdown(content: string, currentSlug: string[]): string {
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
      const language = lang || 'text';
      const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      return `<div class="code-block-wrapper relative my-5 rounded-lg border border-zinc-800 bg-[#09090B] overflow-hidden group shadow-lg">
        <div class="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-950/70 text-xs text-zinc-400 font-mono">
          <span class="flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-500/80"></span>
            ${language}
          </span>
          <button onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('code').innerText); this.innerText='Copied!'; setTimeout(() => this.innerText='Copy', 2000)" class="px-2 py-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1">
            Copy
          </button>
        </div>
        <pre class="p-4 overflow-x-auto text-sm text-zinc-100 font-mono leading-relaxed"><code>${escaped}</code></pre>
      </div>`;
    },

    blockquote(this: any, { tokens }: { tokens: any[] }): string {
      const quote = this.parser.parse(tokens);
      return `<blockquote class="my-4 border-l-2 border-emerald-500 bg-emerald-500/5 px-4 py-3 rounded-r text-zinc-700 dark:text-zinc-300">
        ${quote}
      </blockquote>`;
    },
  };

  marked.use({ renderer });

  return marked.parse(content) as string;
}
