import type React from "react";
import type { Metadata, Viewport } from "next";

import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { ScrollToTop } from "@/components/scroll-to-top";
import CookieConsent from "@/components/cookie-consent";
import TawkChat from "@/components/chat/TawkChat";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/custom-toast";

import {
  Inter,
  Source_Serif_4,
  Inter as V0_Font_Inter,
  Geist_Mono as V0_Font_Geist_Mono,
  Source_Serif_4 as V0_Font_Source_Serif_4,
} from "next/font/google";

// Initialize fonts
const _inter = V0_Font_Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const _geistMono = V0_Font_Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const _sourceSerif_4 = V0_Font_Source_Serif_4({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Technozlife | AI-Powered Life Optimization",
  description:
    "Technozlife leverages AI to optimize your daily habits, enhance wellness, and boost productivity through personalized insights and recommendations.",
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`dark ${inter.variable} ${sourceSerif.variable}`}
    >
      <body className='font-sans antialiased bg-slate-950 text-slate-200 overflow-x-hidden'>
        <AuthProvider>
          <ToastProvider>
            <ScrollToTop />
            {children}
            <CookieConsent />
            <TawkChat />
          </ToastProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
