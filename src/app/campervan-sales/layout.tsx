import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Campervan Sales Australia | New & Used Campervans for Sale",
  description: "Find the best campervan sales across Australia. Browse thousands of new and used campervans from trusted dealers and private sellers. Compare prices, types, and locations to find your perfect campervan.",
  robots: "noindex, nofollow",
  alternates: {
    canonical: "https://www.campervansforsale.au/campervan-sales/",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
