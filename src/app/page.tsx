import Home from "./home-demo/home";
import "./globals.css?=1";
import { Metadata } from "next";
 
import { fetchStateBasedCaravans } from "@/api/homeApi/state/api";
import { fetchRequirements } from "@/api/postRquirements/api";
import { fetchHomePage } from "@/api/home/api";
import { fetchTypeCounts } from "@/api/homeApi/typeCounts/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Campervans For Sale – New & Used Campervan Marketplace in Australia",
    template: "%s ",
  },
  description:
    "Browse campervans for sale across Australia. Compare prices on off-road, hybrid, pop top, touring, luxury models with size, weight & sleeping capacity.",
  icons: { icon: "/favicon.ico" },
  robots: "index, follow",
  verification: {
    google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo",
  },
  alternates: {
    canonical: "https://www.campervansforsale.au",
  },
  openGraph: {
    title: "Campervans For Sale – New & Used Campervan Marketplace in Australia",
    description: "Browse campervans for sale across Australia. Compare prices on off-road, hybrid, pop top, touring, luxury models with size, weight & sleeping capacity.",
    url: "https://www.campervansforsale.au",
    siteName: "Campervans for Sale",
    images: [
      {
        url: "https://www.campervansforsale.au/images/camper_logo.png",
        width: 800,
        height: 600,
        alt: "Campervans for Sale Australia",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campervans For Sale – New & Used Campervan Marketplace in Australia",
    description: "Browse campervans for sale across Australia. Compare prices on off-road, hybrid, pop top, touring, luxury models with size, weight & sleeping capacity.",
  },
};

const BASE_URL = "https://www.campervansforsale.au";

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "url": BASE_URL,
      "name": "Campervans For Sale",
      "description": "Australia's Marketplace for New & Used Campervans",
      "inLanguage": "en-AU",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${BASE_URL}/listings/{search_term_string}-search/`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      "name": "Campervans For Sale",
      "url": BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/images/camper_logo.png`,
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "areaServed": "AU",
        "availableLanguage": "English",
      },
    },
  ],
};

export default async function Page() {
  const [
    stateBands,
    requirements,
    homeblog,
    typeCounts,
  ] = await Promise.all([
    fetchStateBasedCaravans(),
    fetchRequirements(),
    fetchHomePage(),
    fetchTypeCounts(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <Home
        stateBands={stateBands}
        requirements={requirements}
        homeblog={homeblog?.latest_posts ?? []}
        typeCounts={typeCounts}
      />
    </>
  );
}
