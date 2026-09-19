import { getMostLikedMovies, getMovies } from "@/lib/movieService";
import MostLikedMoviesSection from "@/components/featured/MostLikedMoviesSection";
import RecentMovies from "@/components/featured/RecentMovies";
import WeeklyTopMovieSection from "@/components/featured/WeeklyTopMovieSection";
import HeroSection from "@/components/hero/HeroSection";
import { getAuthStatus } from "@/lib/auth";

export const metadata = {
  title: "Moviva - Kişiselleştirilmiş Film Önerileri ve Keşif Platformu",
  description:
    "Zevkine uygun en iyi film önerilerini keşfet. Topluluğun en çok beğendiği yapımlar, haftanın öne çıkanları, detaylı incelemeler ve benzer film tavsiyeleri tek platformda.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Moviva - Film Önerileri & Keşif Platformu",
    description:
      "Zevkine uygun en iyi filmleri keşfet. Haftanın öne çıkanları ve en çok beğenilenler Moviva'da.",
    url: "/",
    siteName: "Moviva",
    type: "website",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Moviva Film Platformu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moviva - Kişiselleştirilmiş Film Önerileri",
    description: "Zevkine uygun en kaliteli film önerilerini keşfet.",
    images: ["/og-default.jpg"],
  },
};

export default async function Home() {
  const [auth, recentMovies, mostLikedMovies] = await Promise.all([
    getAuthStatus(),
    getMovies({ page: 0, size: 9 }),
    getMostLikedMovies({ page: 0, size: 9 }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://moviva.com/#website",
        name: "Moviva",
        url: "https://moviva.com",
        description: "Kişiselleştirilmiş film öneri ve keşif platformu.",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://moviva.com/filmler?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "ItemList",
        name: "Öne Çıkan ve En Çok Beğenilen Filmler",
        itemListElement: (mostLikedMovies?.content || []).map(
          (movie, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: movie.movieName,
            url: `https://moviva.com/movies/${movie.id}`,
          }),
        ),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSection auth={auth} />

      <WeeklyTopMovieSection movies={mostLikedMovies?.content || []} />

      <RecentMovies
        movies={recentMovies?.content || []}
        isLoggedIn={auth?.authenticated ?? false}
      />

      <MostLikedMoviesSection
        movies={mostLikedMovies?.content || []}
        isLoggedIn={auth?.authenticated ?? false}
      />
    </>
  );
}
