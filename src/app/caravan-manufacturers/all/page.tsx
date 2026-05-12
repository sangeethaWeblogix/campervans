// export const dynamic = "force-dynamic"
;


import Header from "./Header";
import CampervanList from "./CaravanList";
import "./comman.css";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const metaTitle =
    "Full List of Top Quality Campervan Manufacturers in Australia";
  const metaDescription =
    "Discover a diverse range of top-tier campervan manufacturers specializing in off-road, compact poptops, touring models, luxury editions &amp; innovative hybrids.";

  const robots = "index, follow";

  return {
    title: metaTitle,
    description: metaDescription,
    robots: robots,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
    },
  };
}

export default function Home() {
  return (
    <div>
      <Header />
      <CampervanList />
    </div>
  );
}
