import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllDocSlugs, getDocBySlug } from '@/lib/docs';
import { compileMarkdown } from '@/lib/markdown';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { TableOfContents } from '@/components/toc';
import { Pager } from '@/components/pager';
import { StatusBadge } from '@/components/status-badge';
import { getPager } from '@/lib/navigation';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return [
    { slug: [] },
    ...slugs.map((slug) => ({
      slug,
    })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug && resolvedParams.slug.length > 0
    ? resolvedParams.slug
    : ['introduction', 'what-is-naagmani'];

  const doc = await getDocBySlug(slug);
  if (!doc) {
    return {
      title: 'Page Not Found',
    };
  }

  const canonicalUrl = `https://docs.naagmani.app${doc.slugPath}`;

  return {
    title: doc.title,
    description: doc.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${doc.title} — Naagmani Documentation`,
      description: doc.description,
      url: canonicalUrl,
      type: 'article',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${doc.title} — Naagmani Documentation`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${doc.title} — Naagmani Documentation`,
      description: doc.description,
    },
  };
}

export default async function DocPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug && resolvedParams.slug.length > 0
    ? resolvedParams.slug
    : ['introduction', 'what-is-naagmani'];

  const doc = await getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const compiledHtml = compileMarkdown(doc.content, slug);
  const pager = getPager(doc.slugPath);

  // Generate breadcrumb items
  const breadcrumbItems: { label: string; href?: string }[] = [
    { label: 'Docs', href: '/docs/introduction/what-is-naagmani' },
  ];
  if (slug.length > 1) {
    breadcrumbItems.push({
      label: slug[0].toUpperCase(),
      href: `/docs/${slug[0]}/${slug[1]}`,
    });
  }
  breadcrumbItems.push({ label: doc.title });

  // Structured Data (TechArticle + BreadcrumbList)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: doc.title,
    description: doc.description,
    url: `https://docs.naagmani.app${doc.slugPath}`,
    author: {
      '@type': 'Organization',
      name: 'Naagmani Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Naagmani',
      url: 'https://docs.naagmani.app',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://docs.naagmani.app${doc.slugPath}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Documentation Area */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 lg:py-10 max-w-4xl">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="pb-6 mb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              {doc.title}
            </h1>
            {doc.status && <StatusBadge status={doc.status} />}
          </div>
          {doc.description && (
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {doc.description}
            </p>
          )}
        </div>

        {/* Markdown Content */}
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: compiledHtml }}
        />

        {/* Next / Previous Page Navigation */}
        <Pager prev={pager.prev} next={pager.next} />
      </main>

      {/* Right Sidebar: Table of Contents */}
      <div className="hidden xl:block w-64 flex-shrink-0 pl-6 py-10">
        <TableOfContents headings={doc.headings} />
      </div>
    </>
  );
}
