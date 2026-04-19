// ─── Locale ──────────────────────────────────────────────────────────────────

export type Locale = 'es' | 'en' | 'pt';

// ─── Destination & Category ───────────────────────────────────────────────────

export type DestinationSlug = 'cartagena' | 'medellin' | 'bogota' | 'san-andres';
export type CategorySlug = 'tours' | 'playas' | 'gastronomia' | 'hospedaje' | 'itinerarios';

// ─── Article ──────────────────────────────────────────────────────────────────

export interface Article {
  /** Unique slug within the destination/category (e.g. 'isla-baru') */
  slug: string;
  locale: Locale;
  destination: DestinationSlug;
  category: CategorySlug;
  title: string;
  description: string;
  pubDate: Date;
  image: string;
  imageAlt: string;
  affiliateIds: string[];
  translationSlugs?: Partial<Record<Locale, string>>;
  /** Raw markdown body */
  body: string;
}

// ─── Affiliate ────────────────────────────────────────────────────────────────

/**
 * viator, civitatis, getyourguide — platforms that provide full product content
 * (images, descriptions, pricing) and pay affiliate commissions.
 * booking is intentionally excluded: it redirects users to an external search engine
 * without providing embeddable product content.
 */
export type AffiliateProvider = 'viator' | 'civitatis' | 'getyourguide';

export type AffiliateBadge = 'popular' | 'bestPrice' | 'new';

export interface AffiliateLink {
  id: string;
  provider: AffiliateProvider;
  /** Direct deep-link to the specific product on the provider's booking page */
  url: string;
  /** Product name shown on the card */
  label: string;
  /** Short description (1-2 sentences) shown on the product card */
  description?: string;
  /** Product cover image — can be an absolute URL from the provider's CDN or a local /images/ path */
  imageUrl?: string;
  /** Duration string displayed on the card, e.g. "3 horas", "Día completo" */
  duration?: string;
  priceFrom?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  /** Highlight badge shown on the card */
  badge?: AffiliateBadge;
  /** Show this product in the homepage featured section */
  featured?: boolean;
}

// ─── Destination ──────────────────────────────────────────────────────────────

export interface Destination {
  slug: DestinationSlug;
  names: Partial<Record<Locale, string>>;
  descriptions: Partial<Record<Locale, string>>;
  image: string;
  imageAlt: string;
  active: boolean;
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  slug: CategorySlug;
  labels: Partial<Record<Locale, string>>;
  /** Heroicon or emoji identifier */
  icon: string;
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

export interface HreflangEntry {
  locale: Locale | 'x-default';
  url: string;
}

export interface SeoMetadata {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogImageAlt: string;
  alternates: HreflangEntry[];
}
