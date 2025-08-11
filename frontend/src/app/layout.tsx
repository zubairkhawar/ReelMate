import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ReelMate - AI-Powered UGC Video Generation Platform",
  description: "Scale your AI UGC agency with unlimited high-converting ads. Generate, test, and deploy content that converts.",
  keywords: ["AI", "UGC", "video generation", "ecommerce", "shopify", "social media", "advertising"],
  authors: [{ name: "ReelMate Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
