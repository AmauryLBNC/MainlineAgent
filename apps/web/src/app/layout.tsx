import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Base/Header";
import { AppProviders } from "@/components/providers/AppProviders";

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
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="QYjx0K-HZ-A-fmMmvaMKnFSFjizjs6KscTJFuV81Rkg"
        />
      </head>
      <body className="antialiased">
        <AppProviders>
          <Header />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
