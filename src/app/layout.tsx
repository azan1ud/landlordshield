import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://landlordshield.vercel.app"),
  title: {
    default: "LandlordShield — UK Landlord Compliance Dashboard",
    template: "%s | LandlordShield",
  },
  description:
    "Track gas safety, EICR, EPC, and all landlord compliance certificates in one place. Stay ahead of Making Tax Digital, Renters' Rights Act, and EPC C deadlines. Free for 1 property.",
  keywords: [
    "landlord compliance",
    "UK landlord",
    "gas safety certificate",
    "EICR",
    "EPC rating",
    "making tax digital landlord",
    "renters rights act",
    "landlord software UK",
    "certificate tracker",
    "landlord dashboard",
  ],
  authors: [{ name: "LandlordShield by Avantware" }],
  openGraph: {
    title: "LandlordShield — UK Landlord Compliance Dashboard",
    description:
      "Track gas safety, EICR, EPC certificates and stay compliant with MTD, Renters' Rights Act, and EPC C. Free for UK landlords.",
    url: "https://landlordshield.vercel.app",
    siteName: "LandlordShield",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LandlordShield — UK Landlord Compliance Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LandlordShield — UK Landlord Compliance Dashboard",
    description:
      "Track all landlord compliance certificates and deadlines in one dashboard. Free for UK landlords.",
    images: ["/og-image.png"],
  },
  other: {
    "theme-color": "#1E3A5F",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en-GB">
      <body className={`${inter.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#1E3A5F] focus:text-white focus:rounded"
        >
          Skip to main content
        </a>
        <TooltipProvider>{children}</TooltipProvider>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
