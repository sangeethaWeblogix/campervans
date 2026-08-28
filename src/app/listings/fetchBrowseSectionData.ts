import {
  PRICE_BANDS,
  GVM_BANDS,
  LENGTH_BANDS,
  SLEEP_BANDS,
  type CountItem,
  type BrowseSectionData,
} from "./browseSectionShared";

const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;
const API_KEY = process.env.CFS_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.campervansforsale.au";

const wpHeaders = (): Record<string, string> => ({
  Accept: "application/json",
  ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
});

// state/region grouping still go through params_count — kept for the two
// call sites below (categoryOnly's state/region panels, categoryStateMode's
// region panel). NOTE: params_count doesn't exist on the new campervan
// backend (confirmed 404 under both cfs/v1 and cvs/v1), so these currently
// always resolve to [] until the backend team adds it — same known gap as
// /api/params-count/route.ts documents for the client side.
async function fetchGroupCountsServer(
  groupBy: string,
  scope: Record<string, string>
): Promise<CountItem[]> {
  try {
    const qs = new URLSearchParams({ group_by: groupBy, ...scope });
    const res = await fetch(`${API_BASE}/params_count?${qs.toString()}`, {
      headers: wpHeaders(),
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return [];
  }
}

/**
 * Real per-value count via the live product pool (/api/pool-listings/) —
 * the one endpoint confirmed working against the actual campervan catalog.
 * Replaces product_exists_check and params_count's group_by, both of which
 * 404 on the new backend.
 */
async function fetchPoolCountServer(
  scope: Record<string, string>,
  extra: Record<string, string>
): Promise<number> {
  try {
    const qs = new URLSearchParams({ per_page: "1", ...scope, ...extra });
    const res = await fetch(`${APP_URL}/api/pool-listings/?${qs.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const json = await res.json();
    return json?.data?.pagination?.total_products ?? json?.pagination?.total_products ?? 0;
  } catch {
    return 0;
  }
}

async function fetchBandCountServer(scope: Record<string, string>, query: string): Promise<number> {
  const bandParams: Record<string, string> = {};
  new URLSearchParams(query).forEach((v, k) => { bandParams[k] = v; });
  return fetchPoolCountServer(scope, bandParams);
}

/** Counts a known, fixed list of {slug, name} values against the live pool
 * (one request per value) — used for make/category panels so counts always
 * reflect the real campervan catalog instead of the old caravan backend. */
async function fetchCountsViaPoolServer(
  scope: Record<string, string>,
  key: string,
  items: { slug: string; name: string }[]
): Promise<CountItem[]> {
  const counts = await Promise.all(items.map((it) => fetchPoolCountServer(scope, { [key]: it.slug })));
  return items.map((it, i) => ({ name: it.name, slug: it.slug, count: counts[i] }));
}

// /make_details is the real new-backend make list (unlike params_count's
// "make" grouping, which still returns hundreds of old caravan brands — see
// /api/params-count/route.ts). Used as the candidate list for real,
// pool-based make counts below.
async function fetchKnownMakesServer(): Promise<{ slug: string; name: string }[]> {
  try {
    const res = await fetch(`${API_BASE}/make_details`, {
      headers: wpHeaders(),
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const opts = json?.data?.make_options ?? [];
    return opts.map((m: { slug: string; name: string }) => ({ slug: m.slug, name: m.name }));
  } catch {
    return [];
  }
}

async function fetchMakeCountsServer(scope: Record<string, string>): Promise<CountItem[]> {
  const makes = await fetchKnownMakesServer();
  return fetchCountsViaPoolServer(scope, "make", makes);
}

async function fetchAllBandCountsServer(scope: Record<string, string>) {
  const [price, atm, length, sleep] = await Promise.all([
    Promise.all(PRICE_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
    Promise.all(GVM_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
    Promise.all(LENGTH_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
    Promise.all(SLEEP_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
  ]);
  return { price, atm, length, sleep };
}

/** Server-side mirror of StateBrowseSection's four client-fetch modes — run
 * during SSR/ISR so the section's links land in the initial HTML instead of
 * only appearing after the client's useEffect fetches finish.
 *
 * Make/category/band counts all go through /api/pool-listings/ (the live
 * product pool) so they reflect the real campervan catalog. State/region
 * grouping still use params_count, which currently 404s on the new backend
 * (see fetchGroupCountsServer) — those two panels stay empty until the
 * backend team adds real group_by=state/region support.
 */
export async function fetchBrowseSectionData(
  filters: { state?: string; region?: string; category?: string },
): Promise<BrowseSectionData> {
  const { state, region, category } = filters;
  const hasState = !!state;
  const hasRegion = !!region;
  const hasCategory = !!category;

  const categoryOnly            = !hasState && hasCategory;
  const stateRegionMode         = hasState && hasRegion && !hasCategory;
  const categoryStateMode       = hasState && hasCategory && !hasRegion;
  const categoryStateRegionMode = hasState && hasCategory && hasRegion;

  if (categoryOnly) {
    const scope = { category: category! };
    const [makeCounts, stateCounts, regionCounts, priceCounts] = await Promise.all([
      fetchMakeCountsServer(scope),
      fetchGroupCountsServer("state", scope),
      fetchGroupCountsServer("region", scope),
      Promise.all(PRICE_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
    ]);
    return { makeCounts, stateCounts, regionCounts, priceCounts };
  }

  if (stateRegionMode) {
    // "Browse Campervans by Type" is removed here on purpose — every product
    // in the new campervan backend currently has category="uncategorized",
    // so there's no real category data to power this panel (same reason the
    // category filter/pill was removed elsewhere on the site).
    const scope = { state: state!, region: region! };
    const [makeCounts, priceCounts, atmCounts, sleepCounts] = await Promise.all([
      fetchMakeCountsServer(scope),
      Promise.all(PRICE_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
      Promise.all(GVM_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
      Promise.all(SLEEP_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
    ]);
    return { makeCounts, priceCounts, atmCounts, sleepCounts };
  }

  if (categoryStateMode) {
    const scope = { category: category!, state: state! };
    const [regionCounts, makeCounts, bands] = await Promise.all([
      fetchGroupCountsServer("region", scope),
      fetchMakeCountsServer(scope),
      fetchAllBandCountsServer(scope),
    ]);
    return {
      regionCounts,
      makeCounts,
      priceCounts: bands.price,
      atmCounts: bands.atm,
      lengthCounts: bands.length,
      sleepCounts: bands.sleep,
    };
  }

  if (categoryStateRegionMode) {
    const scope = { category: category!, state: state!, region: region! };
    const [makeCounts, bands] = await Promise.all([
      fetchMakeCountsServer(scope),
      fetchAllBandCountsServer(scope),
    ]);
    return {
      makeCounts,
      priceCounts: bands.price,
      atmCounts: bands.atm,
      lengthCounts: bands.length,
      sleepCounts: bands.sleep,
    };
  }

  // Default mode (no state/category, or state-only) — the pills rendered
  // here are static (STATES/TYPES_NO_STATE/FILTERS_NO_STATE) or come from
  // getRegionsByState, none of which need count data at all.
  return {};
}
