
  // export const dynamic = "force-dynamic"
  
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import "./globals.css?=37";
  import "@fortawesome/fontawesome-free/css/all.min.css";
  import Navbar from "./navbar/Navbar";
  import Footer from "./footer/Footer";
  import React, { Suspense } from "react";
  import { Metadata } from "next";
  import ScrollToTop from "./navigation/ScrollToTopGlobal";
  import UTMTracker from "./UTMTracker";
  // import NextTopLoader from "nextjs-toploader";
import ThemeRegistry from './components/ThemeRegistry';
import NavigationHistory from "@/components/NavigationHistory";
import { BannerProvider } from "@/components/BannerHandler";

  
  export const metadata: Metadata = {
    title: {
      default: "Campervans For Sale – Australia’s Marketplace for New & Used Campervans",
      template: "%s ",
    },
    description:
      "Browse new & used campervans for sale across Australia. Compare prices on luxury, touring, 4x4, off-grid & family campervans with features, layouts & sleeping capacity.",
    icons: { icon: "/favicon.ico?=1" },
    // robots: "index, follow",
    verification: {
      google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
    },
    alternates: {
      canonical: "https://www.caravansforsale.com.au",
    },
    
  
  };
  
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  const gtmId = "GTM-N3362FGQ";
const gtmServer = "https://gtm.caravansforsale.com.au";
    return (
      <html lang="en">
        <head>
          {/* Google Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
  
          
        
          
        </head>
        <body
          className="flex flex-col min-h-screen new_font"
          style={{
            fontFamily:
              "Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
          }}
        >
          

  
         <Suspense fallback={null}>
  <UTMTracker />
</Suspense>
<Suspense fallback={null}>
  <NavigationHistory />
</Suspense>
<Suspense fallback={null}>
  <Navbar />
</Suspense>
                  <Suspense fallback={null}>

          <ScrollToTop />
          </Suspense>
          <main className="product-page style-5">
            {/* <NextTopLoader
          color="#ff6600"
          height={3}
          showSpinner={false}
        /> */}
 <ThemeRegistry>
          <BannerProvider>
          {children}
          </BannerProvider>
        </ThemeRegistry>
                    </main>
          <Footer />
        </body>
      </html>
      
    );
  }
  