import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HAYCARB Market Scout | Environmental & Market Intelligence",
  description: "Real-time environmental and market intelligence platform for HAYCARB. Track opportunities across PFAS, water treatment, gold recovery, and more.",
  keywords: ["HAYCARB", "market intelligence", "environmental opportunities", "activated carbon", "PFAS", "water treatment"],
  authors: [{ name: "HAYCARB" }],
  openGraph: {
    title: "HAYCARB Market Scout",
    description: "Real-time environmental and market intelligence platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="antialiased bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30 min-h-screen">
        {children}
      </body>
    </html>
  );
}