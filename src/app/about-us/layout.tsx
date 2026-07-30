 import { Metadata } from "next";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "About Campervan Marketplace - Your Trusted Campervan Resource",
     template: "%s ",
   },
   description:
     "Campervan Marketplace is your go-to platform for finding the perfect campervan from the right manufacturer or dealer @ the right price.",
   icons: { icon: "/favicon.ico" },
   robots: "index, follow",
   verification: {
     google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: "https://www.caravansforsale.com.au/about-us/",
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
