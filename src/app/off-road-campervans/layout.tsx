import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Off-Road Campervans For Sale – Australia’s Best Off-Road & 4WD Campervans",
  description: "Browse off-road campervans for sale across Australia. Compare prices on rugged 4WD, hybrid and semi off-road models built for adventure and remote touring.",
  robots: "noindex, nofollow",
  alternates: {
    canonical: "https://campervans.vercel.app/off-road-campervans/",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
