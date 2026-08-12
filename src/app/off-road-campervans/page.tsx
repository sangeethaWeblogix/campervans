import type { Metadata } from "next";
import Home from "./home";
import "../globals.css";
 
export const metadata: Metadata = {
  title: "Off Road Campervans Australia | New & Used Off Road Campervans for Sale",
  description:
    "Discover Australia's largest collection of off road campervans. Compare full off road, semi off road and hybrid campervans, browse live listings, reviews and expert buying guides.",
  robots: "noindex, nofollow",
};
 import { fetchStateBasedCaravans } from "@/api/homeApi/state/api";
import { fetchRequirements } from "@/api/postRquirements/api";
import { fetchHomePage } from "@/api/home/api";

const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;
const API_KEY  = process.env.CFS_API_KEY;
const APP_URL  = process.env.NEXT_PUBLIC_APP_URL || "https://campervans.vercel.app";

const wpHeaders = (): Record<string, string> => ({
  Accept: "application/json",
  ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
});

type SnapshotData = {
  total_count: number;
  price_min: number;
  price_max: number;
  used_price_min: number;
  used_price_max: number;
};

async function fetchOffRoadSnapshot(): Promise<SnapshotData> {
  const empty = { total_count: 0, price_min: 0, price_max: 0, used_price_min: 0, used_price_max: 0 };
  try {
    const res = await fetch(
      `${API_BASE}/market_snapshot?category=off-road`,
      { headers: wpHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return empty;
    const raw = await res.text();
    const jsonStart = raw.indexOf("{");
    const json = JSON.parse(jsonStart <= 0 ? raw : raw.substring(jsonStart));
    if (!json?.success) return empty;
    return {
      total_count:    json.total_count    ?? 0,
      price_min:      json.price_min      ?? 0,
      price_max:      json.price_max      ?? 0,
      used_price_min: json.used_price_min ?? 0,
      used_price_max: json.used_price_max ?? 0,
    };
  } catch {
    return empty;
  }
}

async function fetchOffRoadBlogs(): Promise<any[]> {
  try {
    const res = await fetch(
      `${API_BASE}/blog?product_category=off-road&per_page=20&page=1`,
      { headers: wpHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const raw = await res.text();
    const jsonStart = raw.indexOf("{");
    const json = JSON.parse(jsonStart <= 0 ? raw : raw.substring(jsonStart));
    return json?.data?.latest_blog_posts?.items ?? json?.data?.posts ?? json?.posts ?? [];
  } catch { return []; }
}

async function fetchOffRoadPopularBlogs(seed: number): Promise<any[]> {
  try {
    const res = await fetch(
      `${API_BASE}/blog-shuffle?popular=off-road&seed=${seed}`,
      { headers: wpHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const raw = await res.text();
    const jsonStart = raw.indexOf("{");
    const json = JSON.parse(jsonStart <= 0 ? raw : raw.substring(jsonStart));
    return json?.data ?? json?.posts ?? json?.items ?? [];
  } catch { return []; }
}

async function fetchOffRoadBrandBlogs(seed: number): Promise<any[]> {
  try {
    const res = await fetch(
      `${API_BASE}/blog-shuffle?make=off-road&seed=${seed}`,
      { headers: wpHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const raw = await res.text();
    const jsonStart = raw.indexOf("{");
    const json = JSON.parse(jsonStart <= 0 ? raw : raw.substring(jsonStart));
    return json?.data ?? json?.posts ?? json?.items ?? [];
  } catch { return []; }
}

async function fetchOffRoadModelBlogs(seed: number): Promise<any[]> {
  try {
    const res = await fetch(
      `${API_BASE}/blog-shuffle?model=off-road&seed=${seed}`,
      { headers: wpHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const raw = await res.text();
    const jsonStart = raw.indexOf("{");
    const json = JSON.parse(jsonStart <= 0 ? raw : raw.substring(jsonStart));
    return json?.data ?? json?.posts ?? json?.items ?? [];
  } catch { return []; }
}


export const revalidate = 86400;

const CANONICAL = "https://campervans.vercel.app/off-road-campervans/";

const schemaJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": CANONICAL,
      "url": CANONICAL,
      "name": "Off Road Campervans Australia | New & Used Off Road Campervans for Sale",
      "description": "Discover Australia's largest collection of off road campervans. Compare full off road, semi off road and hybrid campervans, browse live listings, read expert reviews and explore detailed buying guides.",
      "inLanguage": "en-AU",
      "breadcrumb": { "@id": `${CANONICAL}#breadcrumb` },
      "isPartOf": { "@type": "WebSite", "url": "https://campervans.vercel.app/" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${CANONICAL}#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",             "item": "https://campervans.vercel.app/" },
        { "@type": "ListItem", "position": 2, "name": "Off Road Campervans", "item": CANONICAL },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is an off road campervan?",
          "acceptedAnswer": { "@type": "Answer", "text": "An off road campervan is a campervan built to handle rough, unsealed tracks and remote terrain. They typically feature heavy-duty chassis, independent suspension, reinforced bodywork, larger water and battery capacity, and off-road tyres to handle Australia's outback and bush conditions." },
        },
        {
          "@type": "Question",
          "name": "What is the difference between semi off road and full off road campervans?",
          "acceptedAnswer": { "@type": "Answer", "text": "Semi off road campervans are built for light unsealed roads and easy bush tracks, with upgraded suspension and stronger construction. Full off road campervans are engineered for extreme terrain — think river crossings, rocky tracks and remote touring — with independent suspension, heavy-duty chassis and full off-grid capability." },
        },
        {
          "@type": "Question",
          "name": "Can off road campervans go off grid?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Most off road campervans come with or can be fitted with solar panels, lithium batteries, large fresh water tanks and composting or cassette toilets, allowing extended stays in remote areas without external power or water hookups." },
        },
        {
          "@type": "Question",
          "name": "Do I need a special vehicle to tow an off road campervan?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Off road campervans are heavier and wider than standard campervans. You'll need a high-capacity 4WD with a tow bar rated to the campervan's ATM. Always check the campervan's ATM and the tow vehicle's GVM and tow rating before purchasing." },
        },
        {
          "@type": "Question",
          "name": "Are off road campervans suitable for families?",
          "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. Many off road models come in family-friendly layouts with bunk beds, multiple sleeping berths, full kitchens and ensuites. Brands like Jayco, New Age and Trakmaster offer popular family off road models across a range of budgets." },
        },
        {
          "@type": "Question",
          "name": "What is the average price of an off road campervan in Australia?",
          "acceptedAnswer": { "@type": "Answer", "text": "Off road campervan prices in Australia typically range from around $40,000 for entry-level semi off road models to over $150,000 for premium full off road expedition campervans. The most popular mid-range models sit between $60,000 and $100,000." },
        },
      ],
    },
  ],
};

export default async function OffRoadCaravansDemoPage() {
  const seed = Math.floor(Math.random() * 7) + 1;

  const [
     stateBands,
    requirements,
    homeblog,
    snapshot,
    offRoadBlogs,
    offRoadPopularBlogs,
    offRoadBrandBlogs,
    offRoadModelBlogs,
  ] = await Promise.all([
    
    fetchStateBasedCaravans(),
    fetchRequirements(),
    fetchHomePage(),
    fetchOffRoadSnapshot(),
    fetchOffRoadBlogs(),
    fetchOffRoadPopularBlogs(seed),
    fetchOffRoadBrandBlogs(seed),
    fetchOffRoadModelBlogs(seed),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />
      <Home
       stateBands={stateBands}
      requirements={requirements}
      homeblog={homeblog?.latest_posts ?? []}
      offRoadCount={snapshot.total_count}
      offRoadPriceMin={snapshot.price_min}
      offRoadPriceMax={snapshot.price_max}
      offRoadUsedPriceMin={snapshot.used_price_min}
      offRoadUsedPriceMax={snapshot.used_price_max}
      offRoadBlogs={offRoadBlogs}
      offRoadPopularBlogs={offRoadPopularBlogs}
      offRoadBrandBlogs={offRoadBrandBlogs}
      offRoadModelBlogs={offRoadModelBlogs}
    />
    </>
  );
}
