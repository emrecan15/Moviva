import "./globals.css";
import { AuthProvider } from "@/components/context/AuthProvider";
import { UIProvider } from "@/components/context/UIContext";
import ClientLayout from "@/components/layout/ClientLayout";
import { getAuthStatus } from "@/lib/auth";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://moviva.com",
  ),

  title: {
    default: "Moviva - Kişiselleştirilmiş Film Önerileri & Keşif Platformu",
    template: "%s | Moviva",
  },
  description:
    "Zevkine uygun en popüler ve kaliteli film önerilerini keşfet. Benzer filmler, IMDb puanları ve detaylı incelemeler tek platformda.",
  keywords: [
    "film önerileri",
    "ne izlesem",
    "film tavsiyeleri",
    "en iyi filmler",
    "kişiselleştirilmiş film önerisi",
    "imdb yüksek filmler",
  ],
  authors: [{ name: "Emre Can" }],
  creator: "Moviva",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "Moviva",
    title: "Moviva - Film Öneri Platformu",
    description: "Zevkine uygun en kaliteli film önerilerini keşfet.",
    images: [
      {
        url: "/og-default.jpg", // public/ klasörüne 1200x630 bir varsayılan afiş/logo koyun
        width: 1200,
        height: 630,
        alt: "Moviva Film Önerileri",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Moviva - Film Öneri Platformu",
    description: "Zevkine uygun en kaliteli film önerilerini keşfet.",
    images: ["/og-default.jpg"],
  },

  // 4. Standart Canonical linki
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({ children }) {
  const auth = await getAuthStatus();

  return (
    <html lang="tr">
      <body className="flex flex-col min-h-screen">
        <UIProvider>
          <ClientLayout auth={auth}>{children}</ClientLayout>
        </UIProvider>
      </body>
    </html>
  );
}
