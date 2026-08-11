import { Metadata } from "next";
import { ReactNode } from "react";
 
export const metadata: Metadata = {
  title: "Campervans For Sale – Australia’s Marketplace for New & Used Campervans",
  description:"Browse campervans for sale across Australia. Compare prices on off-road, hybrid, pop top, touring, luxury models with size, weight & sleeping capacity",
  robots: "noindex, nofollow",
  alternates: {
    canonical: "https://campervans.vercel.app/home-demo/",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
