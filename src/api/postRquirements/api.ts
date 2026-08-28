// src/api/requirements/api.ts
const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;
const API_KEY = process.env.CFS_API_KEY; // ✅ Add this

export type Requirement = {
  id?: number; // if the API returns one
  featured?: "0" | "1";
  type: string; // e.g., "Hybrid"
  condition: string; // e.g., "Used" | "New"
  location: string; // e.g., "2033"
  requirements: string; // text
  budget: string; // number as string
  active?: "0" | "1";
  created_at?: string;
};

type ListResp = {
  success: boolean;
  data: Requirement[]; // screenshot shows an array under data
};

export async function fetchRequirements(): Promise<Requirement[]> {
  if (!API_BASE) return [];
  const url = `${API_BASE}/cara_req`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 0 },
      headers: {
        Accept: "application/json",
        // Without a browser-like UA, SiteGround's WAF bot-challenge blocks
        // this request from Vercel's server IP (confirmed on other WP routes
        // in this app) — matches the header pool-listings/route.ts already
        // sends, which is why that endpoint works fine from production.
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        ...(API_KEY && { "X-API-Key": API_KEY }),
      },
    });
    if (!res.ok) {
      console.error(`[cara_req] WP API HTTP ${res.status}`);
      return [];
    }
    const raw = await res.text();
    if (raw.includes("sgcaptcha") || raw.trimStart().startsWith("<html")) {
      const blockedIp = raw.match(/ipc:([0-9.]+):/)?.[1] ?? "unknown";
      console.error(
        `[cara_req] BOT CHALLENGE blocked request | server_ip="${blockedIp}" | This is your Vercel server IP — whitelist it in SiteGround.`
      );
      return [];
    }
    const json: ListResp = JSON.parse(raw);
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

// If your backend accepts JSON POST at same endpoint.
// If it’s form-data or a different path (e.g. /cara_req/create),
// just tweak the fetch below.
export async function createRequirement(
  payload: Requirement
): Promise<boolean> {
  if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_CFS_API_BASE");
  const url = `${API_BASE}/cara_req`;
  const res = await fetch(url, {
    method: "POST",
headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-API-Key": API_KEY }), // ✅ Added
      },    // normalize optional booleans to "0"/"1" strings if needed
    body: JSON.stringify({
      ...payload,
      featured: payload.featured ?? "0",
      active: payload.active ?? "1",
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`createRequirement failed: ${res.status} ${text}`);
  }
  // if your API returns {success:true}, you can check it here:
  // const json = await res.json(); return json?.success === true;
  return true;
}
