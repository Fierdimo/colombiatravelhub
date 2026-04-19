/**
 * Build-time affiliate API fetch utilities.
 * These functions run during `npm run build` (Vercel deploy) — never in the browser.
 * They call the real affiliate platform APIs and return typed AffiliateLink objects.
 *
 * Requires env vars (see .env.example):
 *   VIATOR_API_KEY + VIATOR_PARTNER_ID  → fetchViatorProducts()
 *   GYG_PARTNER_ID                      → fetchGYGActivities()
 */

import type { AffiliateLink } from '../core/domain/models';

// ─── Viator ───────────────────────────────────────────────────────────────────

interface ViatorProductImage {
  variants: Array<{ width: number; height: number; url: string }>;
}

interface ViatorProduct {
  productCode: string;
  title: string;
  description: string;
  images: ViatorProductImage[];
  pricing: { summary: { fromPrice: number; currency: string } };
  reviews: { combinedAverageRating: number; totalReviews: number };
  itinerary?: { duration?: { fixedDurationInMinutes?: number } };
  flags?: string[];
}

interface ViatorSearchResponse {
  products: ViatorProduct[];
  totalCount: number;
}

/**
 * Fetches top-rated Viator products for a given destination.
 * Destination IDs:  Cartagena = "5177"
 * @see https://developer.viator.com
 */
export async function fetchViatorProducts(
  apiKey: string,
  destinationId: string,
  partnerId: string,
  count = 24,
): Promise<AffiliateLink[]> {
  try {
    const res = await fetch('https://api.viator.com/partner/products/search', {
      method: 'POST',
      headers: {
        'exp-api-key': apiKey,
        'Accept-Language': 'es',
        'Content-Type': 'application/json',
        Accept: 'application/json;version=2.0',
      },
      body: JSON.stringify({
        filtering: { destination: destinationId },
        sorting: { sort: 'TOP_RATED', order: 'DESCENDING' },
        pagination: { start: 1, count },
        currency: 'USD',
      }),
    });

    if (!res.ok) {
      console.warn(`[Viator API] ${res.status} ${res.statusText}`);
      return [];
    }

    const data: ViatorSearchResponse = await res.json();
    const products = data.products ?? [];

    console.log(`[Viator API] Fetched ${products.length} products for destination ${destinationId}`);

    return products.map((p, i) => {
      // Pick the widest image variant available
      const imageUrl = p.images?.[0]?.variants
        ?.sort((a, b) => b.width - a.width)?.[0]?.url;

      const durationMin = p.itinerary?.duration?.fixedDurationInMinutes;
      const duration = durationMin
        ? durationMin >= 480
          ? 'Día completo'
          : durationMin >= 60
            ? `${Math.round(durationMin / 60)} horas`
            : `${durationMin} min`
        : undefined;

      const isTopSeller = p.flags?.includes('TOP_SELLER');
      const isBestValue = p.flags?.includes('BEST_VALUE');

      return {
        id: `viator-${p.productCode.toLowerCase()}`,
        provider: 'viator',
        url: `https://www.viator.com/tours/${p.productCode}?pid=${partnerId}&mcid=42383&medium=link`,
        label: p.title,
        description: p.description?.slice(0, 220),
        imageUrl,
        priceFrom: p.pricing?.summary?.fromPrice,
        currency: p.pricing?.summary?.currency ?? 'USD',
        rating: p.reviews?.combinedAverageRating,
        reviewCount: p.reviews?.totalReviews,
        duration,
        badge: isTopSeller ? 'popular' : isBestValue ? 'bestPrice' : undefined,
        featured: i < 6,
      } satisfies AffiliateLink;
    });
  } catch (err) {
    console.error('[Viator API] Fetch failed:', err);
    return [];
  }
}

// ─── GetYourGuide ─────────────────────────────────────────────────────────────

interface GYGActivity {
  activity_id: number;
  title: string;
  abstract: string;
  pictures: Array<{ url: string }>;
  price: { from: number; currency_code: string };
  avg_rating: number;
  cnt_ratings: number;
  duration: string;
  special_offer: boolean;
}

interface GYGResponse {
  data: { activities: GYGActivity[]; total_activities: number };
  status: { status: string };
}

/**
 * Fetches top activities from GetYourGuide for a search query.
 * @see https://api.getyourguide.com/
 */
export async function fetchGYGActivities(
  partnerId: string,
  query: string,
  count = 20,
): Promise<AffiliateLink[]> {
  try {
    const url = new URL('https://api.getyourguide.com/1/activities');
    url.searchParams.set('q', query);
    url.searchParams.set('count', String(count));
    url.searchParams.set('sort_by', 'popularity');
    url.searchParams.set('lang', 'es');

    // GYG API requires the partner ID in the X-Partner-Id header, not as a query param
    const res = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        'X-Partner-Id': partnerId,
      },
    });

    if (!res.ok) {
      console.warn(`[GYG API] ${res.status} ${res.statusText}`);
      return [];
    }

    const data: GYGResponse = await res.json();
    const activities = data.data?.activities ?? [];

    console.log(`[GYG API] Fetched ${activities.length} activities for "${query}"`);

    return activities.map((a, i) => ({
      id: `gyg-${a.activity_id}`,
      provider: 'getyourguide',
      url: `https://www.getyourguide.com/activity/${a.activity_id}/?partner_id=${partnerId}`,
      label: a.title,
      description: a.abstract?.slice(0, 220),
      imageUrl: a.pictures?.[0]?.url,
      priceFrom: a.price?.from,
      currency: a.price?.currency_code ?? 'USD',
      rating: a.avg_rating,
      reviewCount: a.cnt_ratings,
      duration: a.duration,
      badge: a.special_offer ? 'bestPrice' : i < 3 ? 'popular' : undefined,
      featured: i < 4,
    } satisfies AffiliateLink));
  } catch (err) {
    console.error('[GYG API] Fetch failed:', err);
    return [];
  }
}
