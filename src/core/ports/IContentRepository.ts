import type { Article, CategorySlug, DestinationSlug, Locale } from '../domain/models';

export interface IContentRepository {
  getAllArticles(locale: Locale): Promise<Article[]>;
  getArticlesByDestination(destination: DestinationSlug, locale: Locale): Promise<Article[]>;
  getArticlesByCategory(
    destination: DestinationSlug,
    category: CategorySlug,
    locale: Locale,
  ): Promise<Article[]>;
  getArticleBySlug(
    destination: DestinationSlug,
    category: CategorySlug,
    slug: string,
    locale: Locale,
  ): Promise<Article | null>;
}
