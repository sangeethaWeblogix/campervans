import { Metadata } from "next";

const BASE_URL = "https://campervans.vercel.app";

export interface StateData {
  slug: string;
  label: string;
  capital: string;
  abbr: string;
  mapImg: string;
}

export const STATES_DATA: Record<string, StateData> = {
  victoria: {
    slug: "victoria",
    label: "Victoria",
    capital: "Melbourne",
    abbr: "VIC",
    mapImg: "/images/vic_map.svg",
  },
  "new-south-wales": {
    slug: "new-south-wales",
    label: "New South Wales",
    capital: "Sydney",
    abbr: "NSW",
    mapImg: "/images/nsw_map.svg",
  },
  queensland: {
    slug: "queensland",
    label: "Queensland",
    capital: "Brisbane",
    abbr: "QLD",
    mapImg: "/images/qld_map.svg",
  },
  "south-australia": {
    slug: "south-australia",
    label: "South Australia",
    capital: "Adelaide",
    abbr: "SA",
    mapImg: "/images/sa_map.svg",
  },
  tasmania: {
    slug: "tasmania",
    label: "Tasmania",
    capital: "Hobart",
    abbr: "TAS",
    mapImg: "/images/tas_map.svg",
  },
  "western-australia": {
    slug: "western-australia",
    label: "Western Australia",
    capital: "Perth",
    abbr: "WA",
    mapImg: "/images/wa_map.svg",
  },
};

export const ALL_STATE_SLUGS = Object.keys(STATES_DATA);

export function getStateBySlug(slug: string): StateData | undefined {
  return STATES_DATA[slug];
}

export function buildStateMetadata(state: StateData): Metadata {
  return {
    title: `Sell My Campervan in ${state.label} | List Until Sold for $49`,
    description: `Sell your campervan in ${state.label} for just $49. List until sold, pay no commission and connect directly with campervan buyers across ${state.capital} and regional ${state.label}.`,
    robots: "index, follow",
    alternates: {
      canonical: `${BASE_URL}/sell-my-campervan/${state.slug}/`,
    },
  };
}

export function buildStateJsonLd(state: StateData) {
  const pageUrl = `${BASE_URL}/sell-my-campervan/${state.slug}/`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Sell My Campervan in ${state.label} | List Until Sold for $49`,
        description: `Sell your campervan in ${state.label} with CampervanForSale.com.au. List for a one-time $49 fee, keep 100% of the sale price, and stay live until sold.`,
        inLanguage: "en-AU",
        isPartOf: { "@id": `${BASE_URL}/#website` },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: "Private Campervan Listing Service",
        url: pageUrl,
        description:
          "List your campervan for sale on CampervanForSale.com.au for a one-time $49 fee. No commissions, no subscriptions, live until sold.",
        provider: {
          "@type": "Organization",
          name: "Campervans For Sale",
          url: BASE_URL,
        },
        areaServed: {
          "@type": "State",
          name: state.label,
        },
        offers: {
          "@type": "Offer",
          price: "49",
          priceCurrency: "AUD",
          description: "One-time listing fee, live until sold, no commissions",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faqpage`,
        mainEntity: [
          {
            "@type": "Question",
            name: `How do I sell my campervan in ${state.label}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `You can sell your campervan in ${state.label} by creating a private seller listing on CampervanForSale.com.au. Add your campervan details, upload clear photos, set your asking price and publish your ad so buyers across ${state.capital} and regional ${state.label} can contact you directly.`,
            },
          },
          {
            "@type": "Question",
            name: `How much does it cost to sell my campervan in ${state.label}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: "It costs $49 inc. GST to list your campervan on CampervanForSale.com.au. This is a one-time listing fee with no monthly subscription, no hidden charges and no commission when your campervan sells.",
            },
          },
          {
            "@type": "Question",
            name: "How long does my campervan listing stay live?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Your campervan listing stays live until sold. You do not need to keep paying monthly fees to keep your ad active. Once your campervan is sold, you can remove the listing from the website.",
            },
          },
          {
            "@type": "Question",
            name: "Can I edit my campervan listing after publishing?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. After your listing is published, you can update your campervan details, change the asking price, add or replace photos and improve your description if needed.",
            },
          },
          {
            "@type": "Question",
            name: "How do buyers contact me?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Interested buyers can contact you directly through your campervan listing. This allows you to answer questions, arrange inspections, negotiate the price and manage the sale privately.",
            },
          },
          {
            "@type": "Question",
            name: "Do I pay commission when my campervan sells?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. CampervanForSale.com.au does not charge commission when your campervan sells. You pay the one-time listing fee and keep 100% of the agreed sale price.",
            },
          },
          {
            "@type": "Question",
            name: `How should I price my campervan in ${state.label}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Check similar campervans for sale in ${state.label} before setting your price. Compare by make, model, year, condition, length, GVM, tare weight, sleeping capacity, features and location. A realistic asking price can help attract more genuine buyers.`,
            },
          },
          {
            "@type": "Question",
            name: "Is it safe to sell my campervan privately online?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Yes, but you should take normal precautions. Speak with buyers directly, meet in a safe location, confirm payment has cleared before handover and complete any required transfer paperwork for ${state.label}.`,
            },
          },
          {
            "@type": "Question",
            name: "Can I remove my listing after my campervan is sold?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Once your campervan has sold, you can remove your listing so buyers know it is no longer available.",
            },
          },
        ],
      },
    ],
  };
}
