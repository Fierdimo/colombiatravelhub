import type { AffiliateLink, AffiliateProvider } from '../domain/models';

export interface IAffiliateRepository {
  readonly provider: AffiliateProvider;
  getLinkById(id: string): AffiliateLink | null;
  getLinksByIds(ids: string[]): AffiliateLink[];
}
