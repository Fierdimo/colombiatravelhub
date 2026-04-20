import type { AffiliateLink, AffiliateProvider, DestinationSlug } from '../domain/models';

export interface IAffiliateRepository {
  readonly provider: AffiliateProvider;
  getLinkById(id: string): AffiliateLink | null;
  getLinksByIds(ids: string[]): AffiliateLink[];
  /** Returns curated/featured products for a destination. Used by the homepage. */
  getFeaturedLinks(destination: DestinationSlug): AffiliateLink[];
  /** Returns the full product catalog for a destination. Used by category pages. */
  getAllLinks(destination: DestinationSlug): AffiliateLink[];
}
