import type { Metadata } from "next";
import { Cormorant_Garamond, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import Header from "@/components/Base/Header";
import { AppProviders } from "@/components/providers/AppProviders";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MainAgent",
  description: "AI learning suite for modern investors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <header><meta name="google-site-verification" content="QYjx0K-HZ-A-fmMmvaMKnFSFjizjs6KscTJFuV81Rkg" /></header>
      <body
        className={`${libreBaskerville.variable} ${cormorantGaramond.variable} antialiased`}
      >
        <AppProviders>
          <Header />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
