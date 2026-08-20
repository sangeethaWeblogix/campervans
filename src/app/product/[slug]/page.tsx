// app/product-details/[slug]/page.tsx
import ProductDetailDemo from "../../product-detail-demo/ProductDetailDemo";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";
import './product.css?=30006'

export const dynamic = "force-dynamic";

// export async function generateStaticParams() {
//   const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;
//   const API_KEY = process.env.CFS_API_KEY;
//   if (!API_BASE) return [];
//
//   const headers: Record<string, string> = {
//     Accept: "application/json",
//     ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
//   };
//
//   const fetchPage = async (page: number): Promise<string[]> => {
//     const res = await fetch(
//       `${API_BASE}/new_optimize_code?page=${page}&per_page=500`,
//       { headers, cache: "no-store" }
//     );
//     if (!res.ok) return [];
//     const data = await res.json();
//     const products: { slug?: string }[] = data?.data?.products ?? [];
//     return products.map((p) => p.slug ?? "").filter(Boolean);
//   };
//
//   // Page 1 — also tells us total_pages
//   const firstRes = await fetch(
//     `${API_BASE}/new_optimize_code?page=1&per_page=500`,
//     { headers, cache: "no-store" }
//   );
//   if (!firstRes.ok) return [];
//   const firstData = await firstRes.json();
//   const firstSlugs = (firstData?.data?.products ?? [])
//     .map((p: { slug?: string }) => p.slug ?? "")
//     .filter(Boolean) as string[];
//   const totalPages: number = firstData?.pagination?.total_pages ?? 1;
//
//   // Remaining pages — 10 at a time in parallel
//   const allSlugs = [...firstSlugs];
//   const BATCH = 10;
//   for (let i = 2; i <= totalPages; i += BATCH) {
//     const pages = Array.from(
//       { length: Math.min(BATCH, totalPages - i + 1) },
//       (_, j) => fetchPage(i + j)
//     );
//     const results = await Promise.all(pages);
//     allSlugs.push(...results.flat());
//   }
//
//   return allSlugs.map((slug) => ({ slug }));
// }

export const dynamicParams = true;

type RouteParams = { slug: string };
type PageProps = { params: Promise<RouteParams> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await Promise.race([
    fetchProductDetail(slug),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
  ]);
  const pd = data?.data?.product_details ?? {};
  const seo = data?.seo ?? data?.product?.seo ?? {};
  const slugTitle = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const title = seo.metatitle || seo.meta_title || pd.name || data?.name || slugTitle || "Campervan for Sale";
  const description = seo.metadescription || seo.meta_description || pd.short_description || "View campervan details on Campervans For Sale Australia.";
  const canonicalUrl = `https://campervans.vercel.app/product/${slug}/`;
  const rawImages = pd.image_url ?? pd.images ?? [];
  const images: string[] = (Array.isArray(rawImages) ? rawImages : [rawImages]).filter(Boolean);

  return {
    title,
    description,
    robots: seo.index === "noindex" ? "noindex, nofollow" : "index, follow",
    alternates: { canonical: canonicalUrl },
    verification: { google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo" },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Campervans for Sale",
      ...(images.length > 0 && { images: [{ url: images[0], alt: title }] }),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// The WP origin intermittently returns a transient failure (500, or a
// spurious "no route found" 404) for a request that succeeds again moments
// later — retry a couple of times before giving up, so a brief backend
// hiccup doesn't 410 a page that's actually fine.
const RETRY_DELAYS_MS = [300, 700];

const fetchProductDetail = cache(async (slug: string) => {
  const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE!;
  const API_KEY = process.env.CFS_API_KEY;
  const url = `${API_BASE}/product-detail-new/?slug=${encodeURIComponent(slug)}`;

  let lastStatus = 0;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-API-Key": API_KEY }),
      },
    });
    if (res.ok) {
      const raw = await res.text();
      const idx = raw.indexOf('{"');
      return JSON.parse(idx >= 0 ? raw.substring(idx) : raw);
    }
    lastStatus = res.status;
    if (attempt < RETRY_DELAYS_MS.length) {
      console.warn(`[fetchProductDetail] HTTP ${res.status} (attempt ${attempt + 1}), retrying: ${slug}`);
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }
  // A non-2xx here (500, or a transient "no route found" from the WP origin)
  // is NOT proof the product doesn't exist — it's backend flakiness. Throw
  // instead of returning null, so the nearest error boundary (error.tsx,
  // "Something went wrong — Try Again") handles it instead of the page
  // permanently 410'ing on a product that's actually fine.
  throw new Error(`product-detail-new fetch failed: HTTP ${lastStatus}`);
});


async function fetchSimilarProducts(productId: string | number, seed: number) {
  const API_KEY = process.env.CFS_API_KEY;
  try {
    const res = await fetch(
      `https://admin.campervanforsale.com.au/wp-json/cvs/v1/similar_products?product_id=${productId}&seed=${seed}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          ...(API_KEY && { "X-API-Key": API_KEY }),
        },
      }
    );
    if (!res.ok) return null;
    const raw = await res.text();
    const idx = raw.indexOf("{");
    const json = JSON.parse(idx > 0 ? raw.substring(idx) : raw);
    return json?.sections ?? json?.data ?? json;
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await fetchProductDetail(slug);

  if (!data || Object.keys(data).length === 0) {
    // Middleware handles 410 for the common path; this covers the rare case where
    // the middleware check timed out and let the request through.
    redirect("/410/");
  }

  const pd = data?.data?.product_details ?? {};
  const seo = data?.seo ?? data?.product?.seo ?? {};
  const pdName = seo.metatitle || seo.meta_title || pd.name || data?.name || "";
  const pdDesc = seo.metadescription || seo.meta_description || pd.short_description || data?.short_description || "";
  const canonicalUrl = `https://campervans.vercel.app/product/${slug}/`;

  const rawImages = pd.image_url ?? pd.images ?? [];
  const images: string[] = (Array.isArray(rawImages) ? rawImages : [rawImages]).filter(Boolean);

  const rawPrice = pd.sale_price || pd.regular_price || pd.price;
  const priceStr = rawPrice ? String(rawPrice).replace(/[^0-9.]/g, "") : null;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pdName,
    ...(pdDesc && { description: pdDesc }),
    ...(images.length > 0 && { image: images }),
    ...(pd.make && { brand: { "@type": "Brand", name: pd.make } }),
    ...(pd.condition && {
      itemCondition:
        String(pd.condition).toLowerCase() === "new"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
    }),
    offers: {
      "@type": "Offer",
      priceCurrency: "AUD",
      ...(priceStr && { price: priceStr }),
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
      seller: { "@type": "Organization", name: "Campervans For Sale" },
    },
  };

  const productId = pd.id ?? pd.product_id ?? data?.data?.id ?? data?.id ?? "";
  const seed = Math.ceil(Math.random() * 10);
  const similarData = productId ? await fetchSimilarProducts(productId, seed) : null;

  // Shuffle price section server-side (API doesn't shuffle it)
  if (similarData?.similar_by_price?.products?.length) {
    const arr = similarData.similar_by_price.products;
    let s = seed * 9301 + 49297;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  return (
    <main className="mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailDemo data={data} similarData={similarData} />
    </main>
  );
}