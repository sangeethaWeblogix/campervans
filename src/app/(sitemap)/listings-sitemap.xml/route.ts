import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 0;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.campervansforsale.au";

const CONSUMER_KEY = process.env.WC_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET!;

async function fetchProducts(page: number) {
const auth = Buffer.from(
  `${CONSUMER_KEY}:${CONSUMER_SECRET}`,
  "utf-8"
).toString("base64");

  const res = await fetch(
    `https://www.admin.campervanforsale.com.au/wp-json/wc/v3/products?per_page=100&page=${page}&_fields=slug`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "User-Agent": "Mozilla/5.0 (CaravansForSale Sitemap Bot)",
      },
      next: { revalidate: 0 },
    },
  );

if (!res.ok) {
  console.error("Woo API failed:", res.status);
  return { items: [], totalPages: 0 };
}
  const data = await res.json();
  const totalPages = Number(res.headers.get("x-wp-totalpages"));
  return { items: data, totalPages };
}

export async function GET() {
  try {
    const firstPage = await fetchProducts(1);
    let allProducts = [...firstPage.items];

    if (firstPage.totalPages > 1) {
      const remainingPages = await Promise.all(
        Array.from({ length: firstPage.totalPages - 1 }, (_, i) =>
          fetchProducts(i + 2),
        ),
      );
      for (const page of remainingPages) {
        allProducts = [...allProducts, ...page.items];
      }
    }

    const today = new Date().toISOString().split("T")[0];

    const urls = allProducts
      .map(
        (product: { slug: string }) => `
          <url>
            <loc>${SITE_URL}/product/${product.slug}/</loc>
            <lastmod>${today}</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.7</priority>
          </url>`,
      )
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
      </urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Sitemap error:", error);
    return new NextResponse("Failed to generate sitemap", { status: 500 });
  }
}
