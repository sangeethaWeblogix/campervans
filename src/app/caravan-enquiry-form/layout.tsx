 import { Metadata } from "next";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "Campervan Enquiry Form | Exclusive Campervan Deals & Offers",
     template: "%s ",
   },
   description:
     "Fill out our campervan enquiry form to receive exclusive offers from select quality campervan manufacturers. Get the best campervan deals sent directly to you.",
   icons: { icon: "/favicon.ico" },
   robots: "index, follow",
   verification: {
     google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: "https://campervans.vercel.app/caravan-enquiry-form/",
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
