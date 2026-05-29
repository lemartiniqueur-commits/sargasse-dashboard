import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sargasse Monitor — Martinique",
  description:
    "Tableau de bord de monitoring environnemental temps réel pour le suivi des sargasses et de la météo marine en Martinique",
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
