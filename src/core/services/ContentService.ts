import type { IContentRepository } from '../ports/IContentRepository';
import type { Article, CategorySlug, DestinationSlug, HreflangEntry, Locale } from '../domain/models';

export class ContentService {
  constructor(private readonly repo: IContentRepository) {}

  getAllArticles(locale: Locale): Promise<Article[]> {
    return this.repo.getAllArticles(locale);
  }

  getArticlesByDestination(destination: DestinationSlug, locale: Locale): Promise<Article[]> {
    return this.repo.getArticlesByDestination(destination, locale);
  }

  getArticlesByCategory(
    destination: DestinationSlug,
    category: CategorySlug,
    locale: Locale,
  ): Promise<Article[]> {
    return this.repo.getArticlesByCategory(destination, category, locale);
  }

  getArticleBySlug(
    destination: DestinationSlug,
    category: CategorySlug,
    slug: string,
    locale: Locale,
  ): Promise<Article | null> {
    return this.repo.getArticleBySlug(destination, category, slug, locale);
  }

  /** Builds hreflang alternates for an article across all available locales. */
  buildArticleAlternates(article: Article, siteUrl: string): HreflangEntry[] {
    const esPath = `/${article.destination}/${article.category}/${article.slug}`;
    const alternates: HreflangEntry[] = [
      { locale: 'es', url: `${siteUrl}${esPath}` },
      { locale: 'x-default', url: `${siteUrl}${esPath}` },
    ];
    if (article.translationSlugs?.en) {
      alternates.push({
        locale: 'en',
        url: `${siteUrl}/en/${article.destination}/${article.category}/${article.translationSlugs.en}`,
      });
    }
    return alternates;
  }
}
