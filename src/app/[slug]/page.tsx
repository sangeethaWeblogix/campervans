import DeatilsPage from "./details";

export const dynamic = "force-dynamic";

import "./details.css";
import { Card, CardContent, Typography, Button } from "@mui/material";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import Thankyou from './ThankYouClient '
import { Metadata } from "next";
import { fetchBlogDetail } from "./fetchBlogDetail";

type RouteParams = { slug: string };
type PageProps = { params: Promise<RouteParams> };

// Slugs that browsers/crawlers request automatically — never real blog posts.
// Bail out before touching the API to avoid noisy 404 log spam.
const NON_BLOG_SLUG_PATTERN = /\.(png|jpg|jpeg|gif|ico|svg|xml|txt|json|webp|bmp|css|js|woff|woff2|ttf|eot|mov|mp4|avi|mkv|webm|wmv|flv|mp3|wav|pdf|zip)$/i;
const NON_BLOG_EXACT = new Set(['wp-json', 'wp-admin', 'wp-login', 'wp-login.php', 'favicon.ico', 'robots.txt', 'sitemap.xml']);

function isNonBlogSlug(slug: string): boolean {
  return NON_BLOG_SLUG_PATTERN.test(slug) || NON_BLOG_EXACT.has(slug);
}

// ✅ SEO from product.seo (NO images)
export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (isNonBlogSlug(slug)) {
    return { robots: "noindex, nofollow" };
  }
  if (slug.startsWith("thank-you-")) {
    return {
      title: "Thank You",
      description: "Your enquiry was submitted successfully.",
      robots: "noindex, nofollow",
      verification: {
        google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ Google site verification
      },
      alternates: {
        canonical: `https://campervans.vercel.app/${slug}/`,
      },
    };
  }
  const data = await fetchBlogDetail(slug);

  const seo = data?.seo ?? data?.product?.seo ?? {};
  const title =
    seo.metatitle ||
    seo.meta_title ||
    data?.title ||
    data?.name ||
    "Product - Campervans for Sale";

  const description =
    seo.metadescription ||
    seo.meta_description ||
    data?.short_description ||
    "View campervan details.";
  const robots = "index, follow";
  const canonicalUrl = `https://campervans.vercel.app/${slug}/`;
  console.log("generateMetadata", { title, description, robots, canonicalUrl });
  return {
    title,
    description,
    robots,
    alternates: {
      canonical: canonicalUrl, // ✅ canonical link
    },
    verification: {
      google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
    },
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary", // no image card
      title,
      description,
    },
    other: {
      "og:type": "blog",
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  if (isNonBlogSlug(slug)) {
    notFound();
  }

  if (slug.startsWith("thank-you-")) {
    return (
      <div
        style={{
          minHeight: "80vh", // keeps space between header and footer
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 5,
            maxWidth: 500,
            textAlign: "center",
          }}
        >
          <CardContent>
            <div
              style={{
                width: 80,
                height: 80,
                margin: "0 auto 20px",
                borderRadius: "50%",
                backgroundColor: "#3f3e82",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Thank you for submitting your information with{" "}
              <span style={{ color: "#000" }}>campervanforsale.com.au</span>.
            </Typography>

            <Typography variant="body1" color="text.secondary" gutterBottom>
              Your campervan dealer will contact you as soon as possible.
            </Typography>

            <Link href="/" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  backgroundColor: "#3f3e82",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#2f2e63",
                  },
                }}
              >
                Go back
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  const data = await fetchBlogDetail(slug);

  if (slug.startsWith("thank-you-")) {
    return <Thankyou />;
  }
  if (!data || !data?.data?.blog_detail) {
    redirect("/404");
  }

  return (
    <div>
      <DeatilsPage data={data} />
    </div>
  );
}
