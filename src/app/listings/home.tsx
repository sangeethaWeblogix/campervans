
"use client";

import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import StateHero from "./StateHero";
import StateFilterBar, { FilterState } from "./StateFilterBar";
import StateListingGrid, { SeoV2, Listing, buildFeaturedOrder } from "./StateListingGrid";
import { dedupeById } from "./listingShared";
import StateBrowseSection from "./StateBrowseSection";
import type { BrowseSectionData } from "./browseSectionShared";
import StateContent from "./StateContent";
import { buildApiUrl, buildListingsSlug, buildFilterBreadcrumbs } from "./urlUtils";
// import { useBanners } from "@/components/BannerHandler";
// import { useBannerTracking } from "@/hooks/useBannerTracking";
import "./main.css?=7";

// clickid pagination — same scheme as /listings/: no ?page=N in the URL,
// instead a random ?clickid= id maps (via localStorage, with a `pN` suffix
// fallback baked into the id) to the page it represents. This lets a
// hard refresh on a paginated URL restore the right page.
const PAGE_KEY = (id: string) => `page_${id}`;
const readPage = (id: string): number | null => {
  try {
    const v = localStorage.getItem(PAGE_KEY(id));
    if (v) return parseInt(v, 10);
  } catch { }
  const match = id.match(/p(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};

// Fixed seed value passed to the pool-listings API — no per-request shuffling.
const POOL_SEED = 1;

/** Full pool data fetched server-side in page.tsx and passed as a prop so the
 *  SSR HTML contains real product listings from the first byte. */
export type InitialPool = {
  seo: SeoV2 | null;
  featured: Listing[];
  new: Listing[];
  used: Listing[];
  maxPages: number;
  isIndexed: boolean;
};

interface Props {
  initialFilters: FilterState;
  /** Full pool fetched server-side — products + seo for SSR rendering. */
  initialPool?: InitialPool | null;
  /** @deprecated replaced by initialPool.seo */
  initialSeo?: SeoV2 | null;
  /** Server-fetched (SSR/ISR) counts for StateBrowseSection's initial filters —
   * seeds its pills/links so they're present in page source for crawlers. */
  browseData?: BrowseSectionData;
  /**
   * Server-determined isIndexed value — passed separately so non-indexed pages
   * that have initialPool=null still initialise isIndexed correctly without
   * waiting for the async /api/indexed-url/ client check (which causes an
   * extra pool re-fetch when it flips the default true → false).
   */
  serverIsIndexed?: boolean;
}

export default function StateHome({ initialFilters, browseData, initialPool, initialSeo, serverIsIndexed }: Props) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(initialPool?.maxPages ?? 1);
  const [clickid, setClickid] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [seo, setSeo] = useState<SeoV2 | null>(initialPool?.seo ?? initialSeo ?? null);
  const [newSeo, setNewSeo] = useState<SeoV2 | null>(null);
  const [usedSeo, setUsedSeo] = useState<SeoV2 | null>(null);
  const [pool, setPool] = useState<{ featured: Listing[]; new: Listing[]; used: Listing[] }>(
    initialPool
      ? { featured: initialPool.featured, new: initialPool.new, used: initialPool.used }
      : { featured: [], new: [], used: [] }
  );
  const [poolLoading, setPoolLoading] = useState(!initialPool);
  // Whether the current canonical /listings/ URL is in url.csv's curated
  // indexed set — gates the full hero banner (image + description) and the
  // Featured/New/Used split: indexed pages split the pool by slot_bucket into
  // three sections, non-indexed pages get one combined grid.
  const [isIndexed, setIsIndexed] = useState(initialPool?.isIndexed ?? serverIsIndexed ?? true);

  // Skip the very first pool-effect run when the server already provided
  // initialPool — data is already in state, no re-fetch needed. After that,
  // normal live fetches run on filter/page changes.
  const initialPropConsumed = useRef(initialPool == null);

  // ── Top banner ad (impression + click tracking) ── commented out: banner API call disabled on listing page
  // const { matchedBanners } = useBanners();
  // const topBanners = useMemo(
  //   () => matchedBanners.filter((b) => b.placement === "listings" && b.position === "top"),
  //   [matchedBanners],
  // );
  // const [topBanner, setTopBanner] = useState<(typeof topBanners)[0] | null>(null);
  // const topBannerInitRef = useRef(false);

  // useEffect(() => {
  //   if (topBannerInitRef.current || topBanners.length === 0) return;
  //   topBannerInitRef.current = true;
  //   setTopBanner(topBanners[Math.floor(Math.random() * topBanners.length)]);
  // }, [topBanners]);

  // const topBannerList = useMemo(() => (topBanner ? [topBanner] : []), [topBanner]);
  // // Impression tracking (IntersectionObserver) — same hook/API as the rest of the site.
  // const { bannerRefs, trackClick } = useBannerTracking(topBannerList);

  // const handleTopBannerClick = useCallback(() => {
  //   if (!topBanner) return;
  //   trackClick(topBanner.id);
  // }, [topBanner, trackClick]);

  // const topBannerBlock = topBanner && (
  //   <div className="container lsd-top-banner">
  //     <a
  //       href={topBanner.target_url}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       data-banner-id={topBanner.id}
  //       ref={(el) => { bannerRefs.current[0] = el; }}
  //       onClick={handleTopBannerClick}
  //     >
  //       <img src={topBanner.image_url} alt={topBanner.name} style={{ width: "100%", height: "auto", display: "block" }} />
  //     </a>
  //   </div>
  // );

  // Push the API's seo_v2 into the browser tab title + meta description.
  useEffect(() => {
    if (!seo) {
      // Filter changed and the new page's SEO hasn't loaded yet — fall back
      // to the generic title instead of leaving the previous page's title
      // showing (stale tab title while the new fetch is in flight).
      document.title = "Campervans For Sale – Australia's Marketplace for New & Used Campervans";
      return;
    }
    if (seo.meta_title) document.title = seo.meta_title;
    if (seo.meta_description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", seo.meta_description);
    }
  }, [seo]);

  // Restore page from ?clickid= on mount (hard refresh / shared link) before
  // the grids below fetch anything, so they fetch the right page just once.
  useEffect(() => {
    const cid = new URLSearchParams(window.location.search).get("clickid");
    if (cid) {
      const saved = readPage(cid);
      if (saved && saved > 0) {
        setClickid(cid);
        setPage(saved);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const cid = new URLSearchParams(window.location.search).get("clickid");
      if (cid) {
        const saved = readPage(cid);
        setClickid(cid);
        setPage(saved && saved > 0 ? saved : 1);
      } else {
        setClickid(null);
        setPage(1);
      }
      setMaxPages(1);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleTotalPages = (n: number) => setMaxPages(prev => Math.max(prev, n));

  useEffect(() => {
    if (page !== 1) return;
    const canonicalPath = buildListingsSlug(filters);
    fetch(`/api/indexed-url/?path=${encodeURIComponent(canonicalPath)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => setIsIndexed(json?.indexed ?? false))
      .catch(() => setIsIndexed(false));
  }, [filters, page]);

  // Page 1 uses ONE shared pool call, split by slot_bucket into
  // Featured/New/Used — instead of 3 separate condition-locked API calls.
  const poolApiUrl = buildApiUrl("/api/pool-listings/?per_page=21", filters, POOL_SEED);

  useEffect(() => {
    if (!ready || page !== 1) return;
    // Skip the very first effect run when the server already provided
    // initialPool — data is already in state, no re-fetch needed.
    // Subsequent runs (filter changes) proceed normally.
    if (!initialPropConsumed.current) {
      initialPropConsumed.current = true;
      return;
    }
    const requestUrl = `${poolApiUrl}&page=${page}`;

    let cancelled = false;
    setPoolLoading(true);
    // Clear the previous filter's seo_v2 up front — otherwise a failed/slow
    // fetch for the new filter combo leaves the old state's title/description
    // on screen (e.g. Victoria's copy lingering after switching to NSW).
    setSeo(null);

    fetch(requestUrl, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled) return;

        // seo_v2 is set first, independently of the product-pool bucketing
        // below, so a bad product shape can never suppress the title/description.
        const seoData = json?.data?.seo_v2 ?? json?.seo_v2;
        if (seoData) setSeo(seoData);

        const products: Listing[] = dedupeById(json?.data?.products ?? json?.products ?? []);
        const premiumsRaw: Listing[] = json?.data?.premium_products ?? json?.premium_products ?? [];
        const exclusivesRaw: Listing[] = json?.data?.exclusive_products ?? json?.exclusive_products ?? [];
        const empExclusivesRaw: Listing[] = json?.data?.emp_exclusive_products ?? json?.emp_exclusive_products ?? [];
        const totalCount: number = json?.data?.counts?.total_count ?? json?.counts?.total_count ?? products.length;

        if (totalCount === 0 && empExclusivesRaw.length > 0) {
          // No products at all — fall back to the emp_exclusive_products pool
          // so the page isn't empty, all shown with the Spotlight Van design.
          const empItems = empExclusivesRaw.map((p) => ({ ...p, is_exclusive: true }));
          setPool({ featured: empItems, new: [], used: [] });
        } else if (isIndexed) {
          // Indexed pages split by slot_bucket into Featured/New/Used.
          const featuredSource = products.filter((p) => p.slot_bucket === "featured");
          const featuredItems = buildFeaturedOrder(featuredSource, premiumsRaw, exclusivesRaw);
          const featuredIds = new Set(featuredItems.map((p) => p.id));

          const newItems = products.filter((p) => p.slot_bucket === "new" && !p.is_premium && !p.is_exclusive && !featuredIds.has(p.id));
          const usedItems = products.filter((p) => p.slot_bucket === "used" && !p.is_premium && !p.is_exclusive && !featuredIds.has(p.id));

          setPool({ featured: featuredItems, new: newItems, used: usedItems });
        } else {
          // Non-indexed pages get one combined grid instead of a split.
          const combined = buildFeaturedOrder(products, premiumsRaw, exclusivesRaw);
          setPool({ featured: combined, new: [], used: [] });
        }

        handleTotalPages(json?.pagination?.total_pages ?? 1);
      })
      .catch((err) => {
        console.warn('[StateHome] pool fetch failed, retaining existing data:', (err as any)?.message);
        // setSeo(null) was called at the top of this effect — restore from initialPool
        // so the H1/description don't vanish when the live re-fetch fails.
        if (!cancelled && initialPool?.seo) setSeo(initialPool.seo);
      })
      .finally(() => { if (!cancelled) setPoolLoading(false); });

    return () => { cancelled = true; };
  }, [poolApiUrl, page, isIndexed, ready]);

  // New/Used grid headings need their own condition-locked seo_v2 (the shared
  // pool call above is unlocked, so its seo_v2 only covers the page overall).
  // Featured reuses that page-level seo since there's no dedicated "featured"
  // seo concept on the backend. Skipped entirely on non-indexed pages
  // (nothing to show these titles on there).
  useEffect(() => {
    if (!ready || page !== 1 || !isIndexed) {
      setNewSeo(null);
      setUsedSeo(null);
      return;
    }
    const newUrl = `${buildApiUrl("/api/pool-listings/?per_page=1", filters, POOL_SEED, "New")}&page=1`;
    const usedUrl = `${buildApiUrl("/api/pool-listings/?per_page=1", filters, POOL_SEED, "Used")}&page=1`;

    fetch(newUrl, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => setNewSeo(json?.data?.seo_v2 ?? json?.seo_v2 ?? null))
      .catch(() => setNewSeo(null));

    fetch(usedUrl, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => setUsedSeo(json?.data?.seo_v2 ?? json?.seo_v2 ?? null))
      .catch(() => setUsedSeo(null));
  }, [filters, page, isIndexed]);

  const pushFiltersToUrl = (f: FilterState) => {
    window.history.pushState({}, "", buildListingsSlug(f));
  };

  const handleFilterChange = (f: FilterState) => {
    setFilters(f); setPage(1); setMaxPages(1); setClickid(null);
    pushFiltersToUrl(f);
  };
  const handleClearAll = () => {
    setFilters({}); setPage(1); setMaxPages(1); setClickid(null);
    pushFiltersToUrl({});
  };

  const hasActiveFilters = !!(
    filters.category || filters.condition || filters.make ||
    filters.from_price || filters.to_price || filters.minKg || filters.maxKg ||
    filters.region || filters.suburb || filters.from_sleep || filters.to_sleep ||
    filters.acustom_fromyears || filters.from_length || filters.keyword
  );

  const handleNextPage = () => {
    if (page >= maxPages) return;
    const nextPage = page + 1;
    const id = uuidv4();
    try { localStorage.setItem(PAGE_KEY(id), String(nextPage)); } catch { }
    const url = new URL(window.location.href);
    url.searchParams.set("clickid", id);
    window.history.pushState({}, "", url.toString());
    setClickid(id);
    setPage(nextPage);
    setMaxPages(1);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handlePrevPage = () => {
    if (page <= 1) return;
    const prevPage = page - 1;
    const url = new URL(window.location.href);
    if (prevPage <= 1) {
      url.searchParams.delete("clickid");
      setClickid(null);
    } else {
      const id = uuidv4();
      try { localStorage.setItem(PAGE_KEY(id), String(prevPage)); } catch { }
      url.searchParams.set("clickid", id);
      setClickid(id);
    }
    window.history.pushState({}, "", url.toString());
    setPage(prevPage);
    setMaxPages(1);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const pagination = (
    <div className="pagination-wrapper">
      <nav className="woocommerce-pagination custom-pagination">
        <ul className="pagination-icons">
          <li>
            <button className="prev-icon" onClick={handlePrevPage} disabled={page === 1}>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 1L1 6l5 5" />
              </svg>
              Back
            </button>
          </li>
          <li className="page-count">Page {page} of {maxPages}</li>
          <li>
            <button className="next-icon" onClick={handleNextPage} disabled={page === maxPages}>
              Next
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1l5 5-5 5" />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );

  if (!ready) {
    // Full server-fetched pool: render real products so SSR HTML is fully populated.
    if (initialPool) {
      const ip = initialPool;
      return (
        <div className="lsd-page">
          {ip.isIndexed ? (
            <StateHero
              title={ip.seo?.h1}
              description={ip.seo?.short_description || ip.seo?.meta_description}
              loading={false}
              breadcrumbs={buildFilterBreadcrumbs(filters)}
            />
          ) : (
            <div className="container lsd-standalone-breadcrumb-wrap">
              <nav className="lsd-breadcrumb" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <svg width="12" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e3e3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: "block" }} aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                <Link href="/listings/">Campervans for Sale</Link>
                {buildFilterBreadcrumbs(filters).map((crumb) => (
                  <span key={crumb.href}>
                    <svg width="12" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e3e3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: "block" }} aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </span>
                ))}
              </nav>
            </div>
          )}
          <StateFilterBar
            currentFilters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />
          {ip.isIndexed ? (
            <>
              <StateListingGrid
                title={ip.seo?.meta_title ? `Featured ${ip.seo.meta_title}` : ""}
                viewAllHref={`${buildListingsSlug(filters)}?featured=1`}
                items={ip.featured}
                loading={false}
                showSpotlight={true}
                hideViewAll
                hideBanners={!!filters.make}
              />
              <StateListingGrid
                title=""
                viewAllHref={buildListingsSlug(filters, "New")}
                items={ip.new}
                loading={false}
                hideViewAll={page > 1}
                hideBanners={!!filters.make}
              />
              <StateListingGrid
                title=""
                viewAllHref={buildListingsSlug(filters, "Used")}
                items={ip.used}
                loading={false}
                hideViewAll={page > 1}
                hideBanners={!!filters.make}
              />
            </>
          ) : (
            <StateListingGrid
              title={ip.seo?.h1 || "Campervans for Sale"}
              titleAs="h1"
              viewAllHref={buildListingsSlug(filters)}
              items={ip.featured}
              loading={false}
              showSpotlight={true}
              hideViewAll
              hideBanners={!!filters.make}
            />
          )}
          <StateBrowseSection state={filters.state} region={filters.region} category={filters.category} initialData={browseData} />
          <StateContent footerDescription={ip.seo?.footer_description} faq={ip.seo?.faq} />
          {filters.category === 'off-road' && (
            <section className="lsd-offroad-extra"><div className="container">
              <h2 className="lsd-offroad-extra__title">Find Your Ideal Off Road Campervan</h2>
              <p className="lsd-offroad-extra__body">Browse live campervan listings from across the country, then compare <a href="https://campervans.vercel.app/off-road-campervans/">off road campervans in Australia</a> using search filters by price, location, weight, length and sleeping capacity while exploring manufacturer and model reviews.</p>
            </div></section>
          )}
          <div className="lsd-sell-cta">
            <div className="container">
              <div className="lsd-sell-cta__inner">
                <h2 className="lsd-sell-cta__title">Looking to Sell Your Campervan?</h2>
                <p className="lsd-sell-cta__body">
                  If you&apos;re upgrading or no longer need your current campervan,{" "}
                  <a href="/sell-my-caravan/" className="lsd-sell-cta__link">sell your campervan</a>{" "}
                  by creating a listing on CaravansForSale.com.au and connect with active buyers across Australia. Your advertisement stays online until it&apos;s sold for a one-time fee of $49.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // Has server-fetched SEO only (no products): render structure with skeleton.
    if (initialSeo) return (
      <div className="lsd-page">
        <StateHero
          title={initialSeo.h1}
          description={initialSeo.short_description || initialSeo.meta_description}
          loading={false}
          breadcrumbs={buildFilterBreadcrumbs(filters)}
        />
        <StateFilterBar
          currentFilters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
        />
        <StateListingGrid
          title={initialSeo.meta_title ? `Featured ${initialSeo.meta_title}` : ""}
          viewAllHref=""
          items={[]}
          loading={true}
          showSpotlight={true}
          hideViewAll
        />
        <StateBrowseSection state={filters.state} region={filters.region} category={filters.category} initialData={browseData} />
        <StateContent footerDescription={initialSeo.footer_description} faq={initialSeo.faq} />
        <div className="lsd-sell-cta">
          <div className="container">
            <div className="lsd-sell-cta__inner">
              <h2 className="lsd-sell-cta__title">Looking to Sell Your Campervan?</h2>
              <p className="lsd-sell-cta__body">
                If you&apos;re upgrading or no longer need your current campervan,{" "}
                <a href="/sell-my-caravan/" className="lsd-sell-cta__link">sell your campervan</a>{" "}
                by creating a listing on CaravansForSale.com.au and connect with active buyers across Australia. Your advertisement stays online until it&apos;s sold for a one-time fee of $49.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
    // No server data at all — minimal white overlay (mobile flash prevention).
    return (
      <>
        <style>{`.lsd-mob-white{display:none}@media(max-width:767px){.lsd-mob-white{display:block}}`}</style>
        <div className="lsd-mob-white" style={{ minHeight: "100vh", background: "#fff" }} />
      </>
    );
  }

  if (page === 1) {
    return (
      <div className="lsd-page">
        {/* Non-indexed pages skip the full hero banner (image + description),
            but every URL still gets the breadcrumb trail — just as a plain
            standalone bar instead of sitting inside the hero. */}
        {isIndexed ? (
          <StateHero title={seo?.h1} description={seo?.short_description || seo?.meta_description} loading={poolLoading} breadcrumbs={buildFilterBreadcrumbs(filters)} />
        ) : (
          <div className="container lsd-standalone-breadcrumb-wrap">
            <nav className="lsd-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <svg width="12" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e3e3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: "block" }} aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
              <Link href="/listings/">Campervans for Sale</Link>
              {buildFilterBreadcrumbs(filters).map((crumb) => (
                <span key={crumb.href}>
                  <svg width="12" height="20" viewBox="0 0 24 24" fill="none" stroke="#3e3e3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: "block" }} aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </span>
              ))}
            </nav>
          </div>
        )}

        <StateFilterBar
          currentFilters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
        />

        {isIndexed ? (
          <>
            <StateListingGrid
              title={seo?.meta_title ? `Featured ${seo.meta_title}` : ""}
              viewAllHref={`${buildListingsSlug(filters)}?featured=1`}
              items={pool.featured}
              loading={poolLoading}
              showSpotlight={true}
              hideViewAll
              hideBanners={!!filters.make}
            />

            <StateListingGrid
              title={newSeo?.meta_title || (seo?.meta_title ? `New ${seo.meta_title}` : "New Campervans")}
              viewAllHref={buildListingsSlug(filters, "New")}
              items={pool.new}
              loading={poolLoading}
              hideBanners={!!filters.make}
            />

            <StateListingGrid
              title={usedSeo?.meta_title || (seo?.meta_title ? `Used ${seo.meta_title}` : "Used Campervans")}
              viewAllHref={buildListingsSlug(filters, "Used")}
              items={pool.used}
              loading={poolLoading}
              hideBanners={!!filters.make}
            />
          </>
        ) : (
          // Non-indexed pages get one combined grid with no slot_bucket split.
          <StateListingGrid
            title={seo?.h1 || "Campervans for Sale"}
            titleAs="h1"
            viewAllHref={buildListingsSlug(filters)}
            items={pool.featured}
            loading={poolLoading}
            showSpotlight={true}
            hideViewAll
            hideBanners={!!filters.make}
          />
        )}

        {maxPages > 1 && pagination}

        <StateBrowseSection state={filters.state} region={filters.region} category={filters.category} initialData={browseData} />
        <StateContent footerDescription={seo?.footer_description} faq={seo?.faq} />
        {filters.category === 'off-road' && (
          <section className="lsd-offroad-extra"><div className="container">
            <h2 className="lsd-offroad-extra__title">Find Your Ideal Off Road Campervan</h2>
            <p className="lsd-offroad-extra__body">Browse live campervan listings from across the country, then compare <a href="https://campervans.vercel.app/off-road-campervans/">off road campervans in Australia</a> using search filters by price, location, weight, length and sleeping capacity while exploring manufacturer and model reviews.</p>
          </div></section>
        )}
        <div className="lsd-sell-cta">
          <div className="container">
            <div className="lsd-sell-cta__inner">
              <h2 className="lsd-sell-cta__title">Looking to Sell Your Campervan?</h2>
              <p className="lsd-sell-cta__body">
                If you&apos;re upgrading or no longer need your current campervan,{" "}
                <a href="/sell-my-caravan/" className="lsd-sell-cta__link">sell your campervan</a>{" "}
                by creating a listing on CaravansForSale.com.au and connect with active buyers across Australia. Your advertisement stays online until it&apos;s sold for a one-time fee of $49.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // page > 1 — single combined grid, StateListingGrid self-fetches via apiUrl
  const allUrl = buildApiUrl("/api/pool-listings/?per_page=21", filters, POOL_SEED);

  return (
    <div className="lsd-page">
      <div className="lsd-paged-header">
        <div className="container">
          <nav className="lsd-paged-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <svg width="10" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
            <Link href="/listings/">Campervans for Sale</Link>
            {buildFilterBreadcrumbs(filters).map((crumb) => (
              <span key={crumb.href}>
                <svg width="10" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                <Link href={crumb.href}>{crumb.label}</Link>
              </span>
            ))}
          </nav>
          <h1 className="lsd-paged-title">{seo?.h1 || "Campervans for Sale"}</h1>
        </div>
      </div>

      <StateFilterBar
        currentFilters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />

      <StateListingGrid
        title=""
        viewAllHref={buildListingsSlug(filters)}
        apiUrl={allUrl}
        page={page}
        showSpotlight={true}
        hideViewAll
        onTotalPages={(n) => setMaxPages((prev) => Math.max(prev, n))}
      />

      {maxPages > 1 && pagination}

      <StateBrowseSection state={filters.state} region={filters.region} category={filters.category} initialData={browseData} />
      <StateContent footerDescription={seo?.footer_description} faq={seo?.faq} />
      {filters.category === 'off-road' && (
        <section className="lsd-offroad-extra"><div className="container">
          <h2 className="lsd-offroad-extra__title">Find Your Ideal Off Road Campervan</h2>
          <p className="lsd-offroad-extra__body">Browse live campervan listings from across the country, then compare <a href="https://campervans.vercel.app/off-road-campervans/">off road campervans in Australia</a> using search filters by price, location, weight, length and sleeping capacity while exploring manufacturer and model reviews.</p>
        </div></section>
      )}
      <div className="lsd-sell-cta">
        <div className="container">
          <div className="lsd-sell-cta__inner">
            <h2 className="lsd-sell-cta__title">Looking to Sell Your Campervan?</h2>
            <p className="lsd-sell-cta__body">
              If you&apos;re upgrading or no longer need your current campervan,{" "}
              <a href="/sell-my-caravan/" className="lsd-sell-cta__link">sell your campervan</a>{" "}
              by creating a listing on CaravansForSale.com.au and connect with active buyers across Australia. Your advertisement stays online until it&apos;s sold for a one-time fee of $49.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
