'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Check, Copy, Code2, Eye } from 'lucide-react';

export function MermaidRenderer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let isSubscribed = true;

    async function renderMermaidDiagrams() {
      const wrappers = document.querySelectorAll<HTMLElement>('.mermaid-diagram-wrapper[data-mermaid]');
      if (wrappers.length === 0) return;

      try {
        const mermaid = (await import('mermaid')).default;
        const isDark = resolvedTheme === 'dark';

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          themeVariables: isDark
            ? {
                darkMode: true,
                background: '#09090b',
                mainBkg: '#18181b',
                primaryColor: '#065f46',
                primaryTextColor: '#f4f4f5',
                primaryBorderColor: '#10b981',
                lineColor: '#34d399',
                secondaryColor: '#27272a',
                tertiaryColor: '#09090b',
                noteBkgColor: '#18181b',
                noteTextColor: '#f4f4f5',
                noteBorderColor: '#27272a',
                actorBkg: '#065f46',
                actorBorder: '#10b981',
                actorTextColor: '#ecfdf5',
                actorLineColor: '#34d399',
                signalColor: '#34d399',
                signalTextColor: '#f4f4f5',
                labelBoxBkgColor: '#18181b',
                labelBoxBorderColor: '#27272a',
                labelTextColor: '#f4f4f5',
                stateBkg: '#18181b',
                stateLabelColor: '#f4f4f5',
                stateBorder: '#10b981',
                innerEndBackground: '#10b981',
                compositeBackground: '#09090b',
                altBackground: '#18181b',
              }
            : {
                darkMode: false,
                background: '#ffffff',
                mainBkg: '#f4f4f5',
                primaryColor: '#ecfdf5',
                primaryTextColor: '#064e3b',
                primaryBorderColor: '#059669',
                lineColor: '#059669',
                secondaryColor: '#f4f4f5',
                tertiaryColor: '#ffffff',
                noteBkgColor: '#f4f4f5',
                noteTextColor: '#18181b',
                noteBorderColor: '#e4e4e7',
                actorBkg: '#ecfdf5',
                actorBorder: '#059669',
                actorTextColor: '#064e3b',
                actorLineColor: '#059669',
                signalColor: '#059669',
                signalTextColor: '#18181b',
                stateBkg: '#f4f4f5',
                stateLabelColor: '#18181b',
                stateBorder: '#059669',
              },
        });

        for (let i = 0; i < wrappers.length; i++) {
          const wrapper = wrappers[i];
          const rawCode = decodeURIComponent(wrapper.getAttribute('data-mermaid') || '');
          if (!rawCode.trim()) continue;

          const id = `mermaid-svg-${i}-${Math.random().toString(36).substring(2, 9)}`;

          try {
            const { svg } = await mermaid.render(id, rawCode);
            if (!isSubscribed) return;

            // Render container with interactive header and SVG content
            wrapper.innerHTML = `
              <div class="mermaid-card rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/60 shadow-sm overflow-hidden transition-colors">
                <div class="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/70 dark:bg-zinc-900/60 text-xs font-mono">
                  <div class="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span class="font-medium">Mermaid Diagram</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <button type="button" class="mermaid-toggle-btn px-2.5 py-1 rounded text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5" title="Toggle Code">
                      <span class="btn-label">Code</span>
                    </button>
                    <button type="button" class="mermaid-copy-btn px-2.5 py-1 rounded text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5" title="Copy Mermaid Syntax">
                      <span class="btn-label">Copy</span>
                    </button>
                  </div>
                </div>
                <div class="mermaid-svg-container p-6 flex justify-center items-center overflow-x-auto min-h-[140px]">
                  ${svg}
                </div>
                <div class="mermaid-code-view hidden p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto">
                  <pre class="leading-relaxed"><code>${rawCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                </div>
              </div>
            `;

            // Attach event listeners for copy and toggle buttons
            const copyBtn = wrapper.querySelector<HTMLButtonElement>('.mermaid-copy-btn');
            const toggleBtn = wrapper.querySelector<HTMLButtonElement>('.mermaid-toggle-btn');
            const codeView = wrapper.querySelector<HTMLElement>('.mermaid-code-view');
            const svgContainer = wrapper.querySelector<HTMLElement>('.mermaid-svg-container');

            if (copyBtn) {
              copyBtn.addEventListener('click', async () => {
                await navigator.clipboard.writeText(rawCode);
                const label = copyBtn.querySelector('.btn-label');
                if (label) {
                  label.textContent = 'Copied!';
                  setTimeout(() => {
                    label.textContent = 'Copy';
                  }, 2000);
                }
              });
            }

            if (toggleBtn && codeView && svgContainer) {
              toggleBtn.addEventListener('click', () => {
                const isCodeHidden = codeView.classList.contains('hidden');
                if (isCodeHidden) {
                  codeView.classList.remove('hidden');
                  const label = toggleBtn.querySelector('.btn-label');
                  if (label) label.textContent = 'Hide Code';
                } else {
                  codeView.classList.add('hidden');
                  const label = toggleBtn.querySelector('.btn-label');
                  if (label) label.textContent = 'Code';
                }
              });
            }
          } catch (err) {
            console.error('Mermaid render error for diagram:', err);
            if (!isSubscribed) return;
            wrapper.innerHTML = `
              <div class="mermaid-card rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 my-4 text-xs font-mono text-amber-600 dark:text-amber-400">
                <div class="flex items-center gap-2 mb-2 font-semibold text-sm">
                  <span>⚠️ Mermaid Render Warning</span>
                </div>
                <pre class="p-3 bg-zinc-900 text-zinc-200 rounded-lg overflow-x-auto mb-2"><code>${rawCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
              </div>
            `;
          }
        }
      } catch (err) {
        console.error('Failed to load mermaid:', err);
      }
    }

    renderMermaidDiagrams();

    return () => {
      isSubscribed = false;
    };
  }, [mounted, resolvedTheme]);

  return <div ref={containerRef} className="mermaid-renderer-anchor hidden" aria-hidden="true" />;
}
