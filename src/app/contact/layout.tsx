 import "./contact.css";
import { Metadata } from "next";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "Contact Campervans For Sale | Australia’s Campervan Marketplace",
     template: "%s ",
   },
   description:
     "Have a question about campervans in Australia? Contact Campervans For Sale for support, inquiries, or help finding your next campervan today.",
   icons: { icon: "/favicon.ico" },
   robots: "index, follow",
   verification: {
     google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
   },
   alternates: {
    canonical: "https://www.campervansforsale.au/contact/",
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
