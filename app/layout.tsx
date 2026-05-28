import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sargasse Monitor \u2014 Martinique",
  description:
    "Tableau de bord de monitoring environnemental temps r\u00e9el pour le suivi des sargasses et de la m\u00e9t\u00e9o marine en Martinique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
