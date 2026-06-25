import { getCollection, type CollectionEntry } from 'astro:content';
import { path, type Lang } from '../i18n/ui';

export function fmtDate(d: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/** Strip the `es/` or `en/` language folder from a glob entry id to get the slug. */
export function slugOf(id: string): string {
  return id.replace(/^(es|en)\//, '').replace(/\.md$/, '');
}

export async function getPosts(lang: Lang): Promise<CollectionEntry<'blog'>[]> {
  const all = await getCollection('blog', (e) => e.data.lang === lang && !e.data.draft);
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Shaped cards for the homepage / insights grid. */
export async function getPostCards(lang: Lang) {
  const posts = await getPosts(lang);
  return posts.map((p) => ({
    title: p.data.title,
    description: p.data.description,
    category: p.data.category,
    date: fmtDate(p.data.pubDate, lang),
    href: path('insights', lang) + slugOf(p.id) + '/',
  }));
}
