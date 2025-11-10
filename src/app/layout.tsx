import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const interThin = Inter({
  variable: "--font-inter-thin",
  subsets: ["latin"],
  weight: "100",
  display: "swap",
});

const interRegular = Inter({
  variable: "--font-inter-regular",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Degn | One-Tap Meme Coin Trading",
  description:
    "Degn delivers seamless, one-tap meme coin trading with intuitive tools, unified wallets, and powerful AI-driven insights.",
  icons: {
    icon: [
      { url: "/images/favicon.ico" },
      { url: "/images/logo.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Degn | One-Tap Meme Coin Trading",
    description:
      "Join the Degn waitlist and experience effortless meme coin trading with smart automation and real-time insights.",
    url: "https://degn.app",
    siteName: "Degn",
    images: [
      {
        url: "/images/heroimage.png",
        width: 1600,
        height: 900,
        alt: "Degn trading interface preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Degn | One-Tap Meme Coin Trading",
    description:
      "Trade meme coins in one tap with Degn. Smart automation, unified wallets, and powerful insights.",
    images: ["/images/heroimage.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${interThin.variable} ${interRegular.variable} antialiased`}
      >
        <Header />
        <div className="mx-auto max-w-[1600px] px-6">
          {children}
        </div>
        
        {/* Global glow effects */}
        <div className="pointer-events-none fixed -bottom-40 left-10 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-3xl z-0" />
      </body>
    </html>
  );
}
