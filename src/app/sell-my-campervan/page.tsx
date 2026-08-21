import SellerDemo from "./seller-demo";
import "./seller-demo.css";

const BASE_URL = "https://campervans.vercel.app";

const sellPageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE_URL}/sell-my-campervan/#webpage`,
      "url": `${BASE_URL}/sell-my-campervan/`,
      "name": "Sell My Campervan Online Australia | List Until Sold for $49",
      "description":
        "Sell your campervan online across Australia for just $49. List until sold, edit anytime, pay no commission and connect directly with genuine campervan buyers.",
      "inLanguage": "en-AU",
      "isPartOf": { "@id": `${BASE_URL}/#website` },
    },
    {
      "@type": "Service",
      "@id": `${BASE_URL}/sell-my-campervan/#service`,
      "name": "Private Campervan Listing Service",
      "url": `${BASE_URL}/sell-my-campervan/`,
      "description":
        "List your campervan for sale on CampervanForSale.com.au for a one-time $49 fee. No commissions, no subscriptions, live until sold.",
      "provider": {
        "@type": "Organization",
        "name": "Campervans For Sale",
        "url": BASE_URL,
      },
      "areaServed": {
        "@type": "Country",
        "name": "Australia",
      },
      "offers": {
        "@type": "Offer",
        "price": "49",
        "priceCurrency": "AUD",
        "description": "One-time listing fee, live until sold, no commissions",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${BASE_URL}/sell-my-campervan/#faqpage`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I sell my campervan online in Australia?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can sell your campervan online by creating a private seller listing on CampervanForSale.com.au. Add your campervan details, upload clear photos, set your asking price and publish your ad so buyers across Australia can contact you directly.",
          },
        },
        {
          "@type": "Question",
          "name": "How much does it cost to list my campervan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It costs $49 inc. GST to list your campervan on CampervanForSale.com.au. This is a one-time listing fee with no monthly subscription, no hidden charges and no commission when your campervan sells.",
          },
        },
        {
          "@type": "Question",
          "name": "How long does my campervan listing stay live?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Your campervan listing stays live until sold. You do not need to keep paying monthly fees to keep your ad active. Once your campervan is sold, you can remove the listing from the website.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I edit my campervan listing after publishing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. After your listing is published, you can update your campervan details, change the asking price, add or replace photos and improve your description if needed.",
          },
        },
        {
          "@type": "Question",
          "name": "How do buyers contact me?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Interested buyers can contact you directly through your campervan listing. This allows you to answer questions, arrange inspections, negotiate the price and manage the sale privately.",
          },
        },
        {
          "@type": "Question",
          "name": "Do I pay commission when my campervan sells?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. CampervanForSale.com.au does not charge commission when your campervan sells. You pay the one-time listing fee and keep 100% of the agreed sale price.",
          },
        },
        {
          "@type": "Question",
          "name": "How should I price my campervan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Check similar campervans for sale before setting your price. Compare by make, model, year, condition, length, GVM, tare weight, sleeping capacity, features and location. A realistic asking price can help attract more genuine buyers.",
          },
        },
        {
          "@type": "Question",
          "name": "Is it safe to sell my campervan privately online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, but you should take normal precautions. Speak with buyers directly, meet in a safe location, confirm payment has cleared before handover and complete any required transfer paperwork for your state or territory.",
          },
        },
      ],
    },
  ],
};

export default function SellMyCaravan() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sellPageJsonLd) }}
      />
      <SellerDemo />
    </>
  );
}
