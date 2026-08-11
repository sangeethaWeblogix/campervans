import type { Metadata } from "next";
import Home from "./home";
import "../globals.css";
 
export const metadata: Metadata = {
  title: "Campervan Sales Australia | New & Used Campervans for Sale",
  description:
    "Find the best campervan sales across Australia. Browse thousands of new and used campervans from trusted dealers and private sellers. Compare prices, types, and locations to find your perfect campervan.",
};
 import { fetchStateBasedCaravans } from "@/api/homeApi/state/api";
import { fetchRequirements } from "@/api/postRquirements/api";
import { fetchHomePage } from "@/api/home/api";

export const revalidate = 86400;

const CANONICAL = "https://campervans.vercel.app/caravan-sales/";

const schemaJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": CANONICAL,
      "url": CANONICAL,
      "name": "Campervan Sales Australia | New & Used Campervans for Sale",
      "description": "Find the best campervan sales across Australia. Browse thousands of new and used campervans from trusted dealers and private sellers.",
      "inLanguage": "en-AU",
      "breadcrumb": { "@id": `${CANONICAL}#breadcrumb` },
      "isPartOf": { "@type": "WebSite", "url": "https://campervans.vercel.app/" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${CANONICAL}#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home",          "item": "https://campervans.vercel.app/" },
        { "@type": "ListItem", "position": 2, "name": "Campervan Sales", "item": CANONICAL },
      ],
    },
  ],
};

export default async function OffRoadCaravansDemoPage() {
  const [
   
    stateBands,
    requirements,
    homeblog,
  ] = await Promise.all([
    
    fetchStateBasedCaravans(),
    fetchRequirements(),
    fetchHomePage(),
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
    />
    </>
  );
}
