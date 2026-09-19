import MovieGrid from "@/components/movie/MovieGrid";
import GenreFilter from "@/components/movie/GenreFilter";
import MobileGenreFilter from "@/components/movie/MobileGenreFilter";
import Pagination from "@/components/Pagination";
import { getMovies, getGenreStats } from "@/lib/movieService";
import { getAuthStatus } from "@/lib/auth";

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;

  const pageSuffix = currentPage > 1 ? ` - Sayfa ${currentPage}` : "";
  const title = `Tüm Filmler${pageSuffix} | Popüler ve Yeni Film Önerileri`;
  const description = `Moviva film arşivindeki tüm yapımları keşfedin. IMDb puanları, tür filtreleri, detaylı incelemeler ve kişiselleştirilmiş öneriler.${pageSuffix}`;
  const canonicalUrl =
    currentPage > 1 ? `/filmler?page=${currentPage}` : "/filmler";

  return {
    title,
    description,
    keywords: [
      "tüm filmler",
      "film arşivi",
      "film önerileri",
      "en iyi filmler",
      "film listesi",
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

export default async function AllMoviesPage({ searchParams }) {
  const auth = await getAuthStatus();
  const isLoggedIn = auth?.authenticated ?? false;

  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const apiPage = currentPage > 0 ? currentPage - 1 : 0;

  const [genres, moviesPage] = await Promise.all([
    getGenreStats(),
    getMovies({
      page: apiPage,
      size: 24,
      genre: null,
    }),
  ]);

  const pageTitle = "Tüm Filmler";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: "Moviva üzerindeki tüm filmlerin yer aldığı katalog listesi.",
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
            basePath="/filmler"
          />
        </div>

        <div className="flex items-start gap-6 max-w-7xl mx-auto w-full">
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 p-4">
            <MovieGrid
              movies={moviesPage?.content || []}
              isLoggedIn={isLoggedIn}
            />
          </div>

          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-cardbg rounded-2xl shadow-sm overflow-hidden">
              <GenreFilter
                genres={genres}
                currentGenre={null}
                basePath="/filmler"
              />
            </div>
          </aside>
        </div>

        <Pagination totalPage={moviesPage?.totalPages || 1} />
      </div>
    </section>
  );
}
