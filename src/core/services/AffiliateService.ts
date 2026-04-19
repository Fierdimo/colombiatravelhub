import type { IAffiliateRepository } from '../ports/IAffiliateRepository';
import type { AffiliateLink, DestinationSlug } from '../domain/models';

export class AffiliateService {
  constructor(private readonly repos: IAffiliateRepository[]) {}

  /** Returns affiliate links for a list of IDs, checking all registered providers. */
  getLinksForIds(ids: string[]): AffiliateLink[] {
    const links: AffiliateLink[] = [];
    for (const id of ids) {
      for (const repo of this.repos) {
        const link = repo.getLinkById(id);
        if (link) {
          links.push(link);
          break;
        }
      }
    }
    return links;
  }

  /**
   * Returns all featured products for a destination across all providers.
   * When API keys are configured, these are real-time products from the platforms.
   * Falls back to curated hardcoded products otherwise.
   */
  getFeaturedForDestination(destination: DestinationSlug): AffiliateLink[] {
    return this.repos.flatMap((repo) => repo.getFeaturedLinks(destination));
  }
}
