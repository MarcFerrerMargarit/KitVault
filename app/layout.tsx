import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { getTranslations } from "@/lib/i18n/server";
import { I18nProvider } from "@/components/I18nProvider";
import "./globals.css";

// Body type — clean and legible
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Display type — condensed, bold, sporty
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KitVault — Your football shirt collection, organized",
  description:
    "Collect, identify and organize your football shirts. AI-powered identification, smart filters, and your own private collection.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, t } = await getTranslations();

  return (
    <html lang={locale} className={`${inter.variable} ${oswald.variable}`}>
      <body className="min-h-screen bg-bg text-ink antialiased">
        <I18nProvider locale={locale} messages={t}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
