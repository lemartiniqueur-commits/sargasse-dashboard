import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Geist Sans — interface text
const geistSans = localFont({
  src: [
    { path: "./fonts/Geist-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Geist-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Geist-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Geist-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

// Geist Mono — numerical data, timestamps, coordinates
const geistMono = localFont({
  src: [
    { path: "./fonts/GeistMono-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/GeistMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/GeistMono-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sargasse Monitor — Martinique",
  description: "Tableau de bord de monitoring environnemental temps réel pour le suivi des sargasses et de la météo marine en Martinique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-bg font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
