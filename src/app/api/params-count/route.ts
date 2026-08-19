import { NextRequest, NextResponse } from "next/server";

export const preferredRegion = "syd1";

const API_KEY = process.env.CFS_API_KEY;

async function fetchFromWP(searchParams: URLSearchParams): Promise<NextResponse> {
  const paramsStr = searchParams.toString();
  const url = `https://admin.caravansforsale.com.au/wp-json/cfs/v1/params_count?${paramsStr}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        ...(API_KEY && { "X-API-Key": API_KEY }),
      },
    });

    if (!response.ok) {
      console.error(
        `[params-count] WP API HTTP ${response.status} | params="${paramsStr}" | Check CFS_API_KEY.`
      );
      return NextResponse.json({}, { status: response.status });
    }

    const raw = await response.text();

    // Detect SiteGround / Cloudflare bot challenge
    if (raw.includes("sgcaptcha") || raw.trimStart().startsWith("<html")) {
      // Extract the blocked IP from SiteGround's challenge URL (y=ipc:IP:timestamp)
      const ipcMatch = raw.match(/ipc:([0-9.]+):/);
      const blockedIp = ipcMatch?.[1] ?? "unknown";
      console.error(
        `[params-count] BOT CHALLENGE blocked request | server_ip="${blockedIp}" | params="${paramsStr}" | This is your Vercel server IP — whitelist it in SiteGround.`
      );
      return NextResponse.json({}, { status: 503 });
    }

    const idx = raw.indexOf('{"');
    try {
      const data = JSON.parse(idx > 0 ? raw.substring(idx) : raw);
      return NextResponse.json(data);
    } catch {
      console.error(
        `[params-count] WP API unparseable body | params="${paramsStr}" | body_preview="${raw.slice(0, 200)}"`
      );
      return NextResponse.json({});
    }
  } catch (err) {
    console.error(
      `[params-count] WP API fetch failed | params="${paramsStr}" | error="${(err as Error).message}"`
    );
    return NextResponse.json({}, { status: 502 });
  }
}

export async function GET(request: NextRequest) {
  return fetchFromWP(request.nextUrl.searchParams);
}
