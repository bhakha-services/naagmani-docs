import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { replaceEnvUrls } from './env-urls';

export interface DocHeading {
  id: string;
  text: string;
  level: number;
}

export interface DocPage {
  slug: string[];
  slugPath: string;
  title: string;
  description: string;
  hasExplicitDescription?: boolean;
  content: string;
  headings: DocHeading[];
  status?: 'available' | 'beta' | 'planned';
  category?: string;
  lastModified?: string;
}

const docsDirectory = path.join(process.cwd(), 'docs');

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function getAllDocSlugs(): string[][] {
  const slugs: string[][] = [];

  function traverse(currentDir: string, currentSlug: string[] = []) {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        traverse(path.join(currentDir, entry.name), [...currentSlug, entry.name]);
      } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
        const fileBase = entry.name.replace(/\.mdx?$/, '');
        slugs.push([...currentSlug, fileBase]);
      }
    }
  }

  traverse(docsDirectory);
  return slugs;
}

export async function getDocBySlug(slug: string[]): Promise<DocPage | null> {
  const relativePath = `${slug.join('/')}.md`;
  let fullPath = path.join(docsDirectory, relativePath);

  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(docsDirectory, `${slug.join('/')}.mdx`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
  }

  const rawFile = fs.readFileSync(fullPath, 'utf-8');
  const { data: frontmatter, content: rawContent } = matter(rawFile);
  const content = replaceEnvUrls(rawContent);

  // Extract headings
  const headings: DocHeading[] = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim().replace(/\*\*/g, '').replace(/`/g, '');
    const id = slugify(text);
    headings.push({ id, text, level });
  }

  // Determine title
  let title = frontmatter.title ? replaceEnvUrls(frontmatter.title) : undefined;
  if (!title) {
    const h1Match = /^#\s+(.+)$/m.exec(content);
    if (h1Match) {
      title = h1Match[1].trim().replace(/\*\*/g, '').replace(/`/g, '');
    } else {
      title = slug[slug.length - 1]
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
  }

  // Determine description
  let description = frontmatter.description ? replaceEnvUrls(frontmatter.description) : undefined;
  if (!description) {
    // Look for first paragraph after H1
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (
        trimmed &&
        !trimmed.startsWith('#') &&
        !trimmed.startsWith('```') &&
        !trimmed.startsWith('---') &&
        !trimmed.startsWith('|') &&
        !trimmed.startsWith('┌')
      ) {
        description = trimmed.replace(/\*\*/g, '').replace(/`/g, '').slice(0, 160);
        break;
      }
    }
  }
  if (!description) {
    description = `Documentation for ${title} in Naagmani AI Operating System.`;
  }

  // Determine status
  let status: 'available' | 'beta' | 'planned' | undefined = frontmatter.status;
  if (!status) {
    if (content.toLowerCase().includes('status: beta') || content.includes('[BETA]')) {
      status = 'beta';
    } else if (content.toLowerCase().includes('status: planned') || content.includes('[PLANNED]')) {
      status = 'planned';
    } else {
      status = 'available';
    }
  }

  const slugPath = `/docs/${slug.join('/')}`;

  return {
    slug,
    slugPath,
    title,
    description,
    hasExplicitDescription: Boolean(frontmatter.description),
    content,
    headings,
    status,
    category: slug[0]?.toUpperCase(),
  };
}

export function getAllDocs(): DocPage[] {
  const slugs = getAllDocSlugs();
  const docs: DocPage[] = [];

  for (const slug of slugs) {
    const relativePath = `${slug.join('/')}.md`;
    const fullPath = path.join(docsDirectory, relativePath);
    if (fs.existsSync(fullPath)) {
      const rawFile = fs.readFileSync(fullPath, 'utf-8');
      const { data: frontmatter, content: rawContent } = matter(rawFile);
      const content = replaceEnvUrls(rawContent);
      const h1Match = /^#\s+(.+)$/m.exec(content);
      const title =
        (frontmatter.title ? replaceEnvUrls(frontmatter.title) : undefined) ||
        (h1Match ? h1Match[1].trim() : slug[slug.length - 1]);
      
      docs.push({
        slug,
        slugPath: `/docs/${slug.join('/')}`,
        title,
        description: (frontmatter.description ? replaceEnvUrls(frontmatter.description) : undefined) || `Documentation for ${title}`,
        content,
        headings: [],
        category: slug[0]?.toUpperCase(),
      });
    }
  }

  return docs;
}
