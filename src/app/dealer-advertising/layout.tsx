 import { Metadata } from "next";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "Campervan Dealer Advertising | Unlimited Listings $299/Month | CaravansForSale",
     template: "%s ",
   },
   description:
     "Advertise your campervan dealership on CampervansForSale.au. Unlimited listings, zero lead fees, and reach high-intent campervan buyers across Australia.",
   icons: { icon: "/favicon.ico" },
   robots: "index, follow",
   verification: {
     google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: "https://www.campervansforsale.au/dealer-advertising/",
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
