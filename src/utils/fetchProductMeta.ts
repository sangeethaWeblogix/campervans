import { cache } from "react";

export interface ProductMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
}

export const fetchProductMeta = cache(async (slug: string): Promise<ProductMeta> => {
  const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE!;
  const API_KEY = process.env.CFS_API_KEY;
  const empty: ProductMeta = { title: "", description: "", canonical: "", ogImage: "" };
  try {
    const res = await fetch(
      `${API_BASE}/product-detail-new/?slug=${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 0 },
        headers: {
          Accept: "application/json",
          ...(API_KEY && { "X-API-Key": API_KEY }),
        },
      }
    );
    if (!res.ok) return empty;
    const raw = await res.text();
    const idx = raw.indexOf('{"');
    const data = JSON.parse(idx >= 0 ? raw.substring(idx) : raw);
    const seo = data?.seo ?? data?.product?.seo ?? {};
    const pd = data?.data?.product_details ?? {};
    // Backend seo.meta_title/meta_description template in the product's
    // category, but every product on this site currently has no real
    // category assigned (backend value is literally "uncategorized") —
    // swap that word for "Campervan" so it stays keyword-relevant instead
    // of showing the raw placeholder.
    const stripUncategorized = (s: string) =>
      s.replace(/\buncategorized\b/gi, "Campervan").replace(/\s{2,}/g, " ").trim();
    const title = stripUncategorized(seo.metatitle || seo.meta_title || pd.name || data?.name || "");
    const description = stripUncategorized(seo.metadescription || seo.meta_description || pd.short_description || "");
    const canonical = `https://www.campervansforsale.au/product/${slug}/`;
    const imageUrlRaw = pd.image_url;
    const ogImage: string = Array.isArray(imageUrlRaw)
      ? imageUrlRaw.filter(Boolean)[0] ?? ""
      : typeof imageUrlRaw === "string"
      ? imageUrlRaw
      : "";
    return { title, description, canonical, ogImage };
  } catch {
    return empty;
  }
});
