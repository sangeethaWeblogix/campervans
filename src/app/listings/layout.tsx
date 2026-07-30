import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campervans for Sale in Victoria | CaravansForSale.com.au",
  description: "Browse new and used campervans for sale in Victoria from dealers and private sellers.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
