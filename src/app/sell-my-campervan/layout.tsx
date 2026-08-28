import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sell My Campervan Online Australia | List Until Sold for $49",
  description:
    "Sell your campervan online across Australia for just $49. List until sold, edit anytime, pay no commission and connect directly with genuine campervan buyers.",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.campervansforsale.au/sell-my-campervan/",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
