import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/providers";
import { Navbar, Footer } from "@/components";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RentNest — Rental Property Marketplace",
  description:
    "Discover, rent, and manage rental properties seamlessly with RentNest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-full flex-col font-sans antialiased`}
      >
        <AppProviders>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
