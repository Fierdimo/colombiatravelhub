import type { AffiliateLink, AffiliateProvider, DestinationSlug } from '../domain/models';

export interface IAffiliateRepository {
  readonly provider: AffiliateProvider;
  getLinkById(id: string): AffiliateLink | null;
  getLinksByIds(ids: string[]): AffiliateLink[];
  /** Returns curated/featured products for a destination. Used by the homepage. */
  getFeaturedLinks(destination: DestinationSlug): AffiliateLink[];
}
