import { getCollection } from 'astro:content';
import type { IContentRepository } from '../../core/ports/IContentRepository';
import type { Article, CategorySlug, DestinationSlug, Locale } from '../../core/domain/models';

export class AstroContentAdapter implements IContentRepository {
  private async fetchAll(): Promise<Article[]> {
    const entries = await getCollection('articles');
    return entries.map((entry) => {
      // entry.id format: "es/cartagena/tours/isla-baru" (extension stripped by Astro)
      const id = entry.id.replace(/\.(md|mdx)$/i, '');
      const parts = id.split('/');
      const locale = parts[0] as Locale;
      const destination = parts[1] as DestinationSlug;
      const category = parts[2] as CategorySlug;
      const slug = parts[3];
      return {
        slug,
        locale,
        destination,
        category,
        title: entry.data.title,
        description: entry.data.description,
        pubDate: entry.data.pubDate,
        image: entry.data.image,
        imageAlt: entry.data.imageAlt,
        affiliateIds: entry.data.affiliateIds,
        translationSlugs: entry.data.translationSlugs,
        body: entry.body ?? '',
      };
    });
  }

  async getAllArticles(locale: Locale): Promise<Article[]> {
    const all = await this.fetchAll();
    return all.filter((a) => a.locale === locale);
  }

  async getArticlesByDestination(destination: DestinationSlug, locale: Locale): Promise<Article[]> {
    const all = await this.fetchAll();
    return all.filter((a) => a.destination === destination && a.locale === locale);
  }

  async getArticlesByCategory(
    destination: DestinationSlug,
    category: CategorySlug,
    locale: Locale,
  ): Promise<Article[]> {
    const all = await this.fetchAll();
    return all.filter(
      (a) => a.destination === destination && a.category === category && a.locale === locale,
    );
  }

  async getArticleBySlug(
    destination: DestinationSlug,
    category: CategorySlug,
    slug: string,
    locale: Locale,
  ): Promise<Article | null> {
    const all = await this.fetchAll();
    return (
      all.find(
        (a) =>
          a.destination === destination &&
          a.category === category &&
          a.slug === slug &&
          a.locale === locale,
      ) ?? null
    );
  }
}
