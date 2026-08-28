export const dynamic = "force-dynamic";

import Header from "./Header";
import CaravanList from "./CaravanList";
import "./comman.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Full List of Top Quality Caravan Manufacturers in Australia",
  description:
    "Discover a diverse range of top-tier caravan manufacturers specializing in off-road, compact poptops, touring models, luxury editions & innovative hybrids.",
  robots: "index, follow",
  alternates: {
    canonical: "https://campervans.vercel.app/caravan-manufacturers/all/",
  },
  openGraph: {
    title: "Full List of Top Quality Caravan Manufacturers in Australia",
    description:
      "Discover a diverse range of top-tier caravan manufacturers specializing in off-road, compact poptops, touring models, luxury editions & innovative hybrids.",
    url: "https://campervans.vercel.app/caravan-manufacturers/all/",
    images: [
      {
        url: "https://campervans.vercel.app/images/camper_logo.png",
        width: 800,
        height: 600,
        alt: "Caravan Manufacturers Australia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Full List of Top Quality Caravan Manufacturers in Australia",
    description:
      "Discover a diverse range of top-tier caravan manufacturers specializing in off-road, compact poptops, touring models, luxury editions & innovative hybrids.",
  },
};

export default function Home() {
  return (
    <div>
      <Header />
      {/* <CaravanList /> */}
    </div>
  );
}
