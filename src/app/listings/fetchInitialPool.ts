/**
 * Server-side fetch of initial pool data for SSR/ISR.
 *
 * Always goes through /api/pool-listings/ (live proxy to WP) — no cache layer.
 *
 * The parsed result is passed as `initialPool` to StateHome so the SSR HTML
 * contains real product listings from the first byte.
 */

import { Listing, SeoV2, buildFeaturedOrder } from "./listingShared";
import type { InitialPool } from "./home";
import type { FilterState } from "./StateFilterBar";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://campervans.vercel.app";

/** Build the /api/pool-listings/ query string from the full FilterState. */
function buildApiParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams({ orderby: "default", per_page: "21", page: "1", seed: "1" });
  if (filters.state)              params.set("state",             String(filters.state));
  if (filters.region)             params.set("region",            String(filters.region));
  if (filters.category)           params.set("category",          String(filters.category));
  if (filters.condition)          params.set("condition",         String(filters.condition));
  if (filters.make)               params.set("make",              String(filters.make));
  if (filters.model)              params.set("model",             String(filters.model));
  if (filters.suburb)             params.set("suburb",            String(filters.suburb));
  if (filters.pincode)            params.set("pincode",           String(filters.pincode));
  if (filters.from_price)         params.set("from_price",        String(filters.from_price));
  if (filters.to_price)           params.set("to_price",          String(filters.to_price));
  if (filters.minKg)              params.set("from_atm",          String(filters.minKg));
  if (filters.maxKg)              params.set("to_atm",            String(filters.maxKg));
  if (filters.from_sleep)         params.set("from_sleep",        String(filters.from_sleep));
  if (filters.to_sleep)           params.set("to_sleep",          String(filters.to_sleep));
  if (filters.from_length)        params.set("from_length",       String(filters.from_length));
  if (filters.to_length)          params.set("to_length",         String(filters.to_length));
  if (filters.acustom_fromyears)  params.set("acustom_fromyears", String(filters.acustom_fromyears));
  if (filters.acustom_toyears)    params.set("acustom_toyears",   String(filters.acustom_toyears));
  if (filters.keyword) {
    const kw = String(filters.keyword).replace(/\+/g, " ").trim().replace(/\s+/g, " ");
    if (kw) params.set("search", kw);
  }
  return params;
}

/** Parse a raw pool_test JSON response into the InitialPool shape. */
function parsePoolJson(json: any, isIndexed: boolean): InitialPool | null {
  const seo: SeoV2 | null = json?.data?.seo_v2 ?? json?.seo_v2 ?? null;
  const products: Listing[]         = json?.data?.products         ?? json?.products         ?? [];
  const premiumsRaw: Listing[]      = json?.data?.premium_products  ?? json?.premium_products  ?? [];
  const exclusivesRaw: Listing[]    = json?.data?.exclusive_products ?? json?.exclusive_products ?? [];
  const empExclusivesRaw: Listing[] = json?.data?.emp_exclusive_products ?? json?.emp_exclusive_products ?? [];
  const totalCount: number          = json?.data?.counts?.total_count ?? json?.counts?.total_count ?? products.length;

  if (!products.length && !premiumsRaw.length) return null;

  const totalProducts = json?.data?.pagination?.total_products ?? json?.pagination?.total_products ?? totalCount;
  // Use total_pages from the API response (computed by backend using actual per_page).
  // Fallback to manual calculation with per_page=21 if the field is absent.
  const apiTotalPages = json?.data?.pagination?.total_pages ?? json?.pagination?.total_pages;
  const maxPages = apiTotalPages
    ? Math.max(1, apiTotalPages)
    : Math.max(1, Math.ceil(totalProducts / 21));

  let featured: Listing[] = [];
  let newItems: Listing[]  = [];
  let usedItems: Listing[] = [];

  if (isIndexed) {
    const featuredSource = products.filter((p) => p.slot_bucket === "featured");
    featured = buildFeaturedOrder(featuredSource, premiumsRaw, exclusivesRaw);
    const featuredIds = new Set(featured.map((p) => p.id));
    newItems  = products.filter((p) => p.slot_bucket === "new"  && !p.is_premium && !p.is_exclusive && !featuredIds.has(p.id));
    usedItems = products.filter((p) => p.slot_bucket === "used" && !p.is_premium && !p.is_exclusive && !featuredIds.has(p.id));
  } else {
    // Non-indexed: combined grid, no slot splitting
    const totalC = totalCount === 0 && empExclusivesRaw.length > 0;
    featured = totalC
      ? empExclusivesRaw
      : buildFeaturedOrder(products, premiumsRaw, exclusivesRaw);
    newItems  = [];
    usedItems = [];
  }

  return { seo, featured, new: newItems, used: usedItems, maxPages, isIndexed };
}

/** Live fetch through /api/pool-listings/ (pure proxy to WP, no caching). */
async function fetchFromApi(filters: FilterState): Promise<any | null> {
  const params = buildApiParams(filters);
  try {
    const res = await fetch(`${APP_URL}/api/pool-listings/?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Fetch the initial pool for SSR/ISR rendering. */
export async function fetchInitialPool(
  filters: FilterState,
  isIndexed = true
): Promise<InitialPool | null> {
  const apiJson = await fetchFromApi(filters);
  if (apiJson) {
    const parsed = parsePoolJson(apiJson, isIndexed);
    if (parsed) return parsed;
  }
  return null;
}
