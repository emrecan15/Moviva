import { getMostLikedMovies, getGenreStats } from "@/lib/movieService";
import MovieGrid from "@/components/movie/MovieGrid";
import GenreFilter from "@/components/movie/GenreFilter";
import Pagination from "@/components/Pagination";
import { getAuthStatus } from "@/lib/auth";
import MobileGenreFilter from "@/components/movie/MobileGenreFilter";

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? 1);

  const pageSuffix = page > 1 ? ` - Sayfa ${page}` : "";
  const title = `En Çok Beğenilen Filmler${pageSuffix} | Moviva`;
  const description = `Moviva topluluğu tarafından en çok beğenilen, yüksek puanlı ve popüler tüm filmleri keşfedin.${pageSuffix}`;
  const canonicalUrl =
    page > 1 ? `/en-cok-begenilenler?page=${page}` : "/en-cok-begenilenler";

  return {
    title,
    description,
    keywords: [
      "en çok beğenilen filmler",
      "en popüler filmler",
      "en iyi filmler",
      "yüksek puanlı filmler",
      "film tavsiyeleri",
      "moviva",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "Moviva",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function MostLikedMovies({ searchParams }) {
  const auth = await getAuthStatus();
  const isLoggedIn = auth?.authenticated ?? false;

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? 1);
  const apiPage = page > 0 ? page - 1 : 0;

  const [genres, moviesPage] = await Promise.all([
    getGenreStats(),
    getMostLikedMovies({
      page: apiPage,
      size: 24,
      genre: null,
    }),
  ]);

  const pageTitle = "En Çok Beğenilen Filmler";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description:
      "Moviva topluluğu tarafından en çok beğenilen popüler film listesi.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: (moviesPage?.content || []).map((movie, index) => ({
        "@type": "ListItem",
        position: apiPage * 24 + index + 1,
        name: movie.movieName,
        url: `https://moviva.com/movies/${movie.id}`,
      })),
    },
  };

  return (
    <section className="w-full py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col gap-3 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-logo px-4">{pageTitle}</h1>

        <div className="block md:hidden">
          <MobileGenreFilter
            genres={genres}
            currentGenre={null}
            basePath="/en-cok-begenilenler"
          />
        </div>

        <div className="flex items-start gap-6 max-w-7xl mx-auto w-full">
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 p-4">
            <MovieGrid
              movies={moviesPage?.content || []}
              isLoggedIn={isLoggedIn}
            />
          </div>

          <aside className="hidden md:block w-64 shrink-0 bg-cardbg rounded-2xl overflow-hidden shadow-sm h-fit">
            <GenreFilter
              genres={genres}
              currentGenre={null}
              basePath="/en-cok-begenilenler"
            />
          </aside>
        </div>
        <Pagination totalPage={moviesPage?.totalPages || 1} />
      </div>
    </section>
  );
}
