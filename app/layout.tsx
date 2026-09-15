import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#09090B' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://docs.naagmani.app'),
  title: {
    default: 'Naagmani Documentation — AI Runtime Platform',
    template: '%s — Naagmani Documentation',
  },
  description:
    'Official developer documentation, architectural guides, API references, CLI manuals, and Plugin SDK guides for Naagmani — The AI Runtime for your applications.',
  keywords: [
    'AI runtime',
    'AI infrastructure',
    'AI gateway',
    'AI API gateway',
    'LLM gateway',
    'LLM routing',
    'AI model routing',
    'AI provider routing',
    'AI developer platform',
    'AI API infrastructure',
    'AI plugins',
    'MCP gateway',
    'AI security',
    'AI firewall',
    'LLM observability',
    'AI usage tracking',
    'AI cost management',
    'AI API management',
  ],
  authors: [{ name: 'Naagmani Team', url: 'https://docs.naagmani.app' }],
  creator: 'Naagmani Team',
  publisher: 'Bhakha Services',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://docs.naagmani.app',
    siteName: 'Naagmani Documentation',
    title: 'Naagmani Documentation — The AI Runtime for your applications',
    description:
      'Standardize model connectivity, bring-your-own-key security, polyglot plugin execution, real-time FinOps metering, and resilient AI routing with a single OpenAI-compatible gateway.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Naagmani Documentation — The AI Runtime for your applications',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naagmani Documentation — The AI Runtime for your applications',
    description:
      'Developer documentation, API reference, CLI guides, and Plugin SDKs for the Naagmani AI Operating System.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://docs.naagmani.app/#organization',
        name: 'Naagmani',
        url: 'https://docs.naagmani.app',
        logo: {
          '@type': 'ImageObject',
          url: 'https://docs.naagmani.app/icon.png',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://docs.naagmani.app/#website',
        url: 'https://docs.naagmani.app',
        name: 'Naagmani Documentation',
        description: 'Official developer documentation and API reference for the Naagmani AI Operating System.',
        publisher: {
          '@id': 'https://docs.naagmani.app/#organization',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Naagmani AI Runtime',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Cross-platform',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: 'The AI Runtime for your applications. Unified gateway, BYOK vault, smart model router, and polyglot plugin engine.',
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-500">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
