import type React from "react"
import type { Metadata, Viewport } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { ScrollToTop } from "@/components/scroll-to-top"
import { AuthProvider } from "@/lib/auth-context"
import { ToastProvider } from "@/components/ui/custom-toast"

import { Inter, Source_Serif_4, Inter as V0_Font_Inter, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _inter = V0_Font_Inter({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "Technozlife | Bio-Digital Fusion Platform",
  description:
    "Where Humanity Converges with Tomorrow. Transform your life with cutting-edge technology that seamlessly integrates with human potential.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${sourceSerif.variable}`}>
      <body className="font-sans antialiased bg-slate-950 text-slate-200 overflow-x-hidden">
        <AuthProvider>
          <ToastProvider>
            <ScrollToTop />
            {children}
          </ToastProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
