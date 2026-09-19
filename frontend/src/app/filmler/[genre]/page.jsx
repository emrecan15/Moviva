import MovieGrid from "@/components/movie/MovieGrid";
import GenreFilter from "@/components/movie/GenreFilter";
import MobileGenreFilter from "@/components/movie/MobileGenreFilter";
import Pagination from "@/components/Pagination";
import { getMovies, getGenreStats } from "@/lib/movieService";
import { slugify } from "@/utils/slugify";
import { getAuthStatus } from "@/lib/auth";
import { notFound } from "next/navigation";

export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const urlSlug = resolvedParams.genre
    ? decodeURIComponent(resolvedParams.genre)
    : null;

  const currentPage = Number(resolvedSearchParams.page) || 1;

  let currentGenreName = "Tüm";

  if (urlSlug) {
    try {
      const genres = await getGenreStats();
      const matched = genres.find((g) => slugify(g.genreName) === urlSlug);

      if (!matched) {
        return {
          title: "Kategori Bulunamadı",
          robots: { index: false, follow: false },
        };
      }
      currentGenreName = matched.genreName;
    } catch {
      currentGenreName = "Film";
    }
  }

  const pageSuffix = currentPage > 1 ? ` - Sayfa ${currentPage}` : "";
  const title = `${currentGenreName} Filmleri${pageSuffix} | En İyiler ve Tavsiyeler`;
  const description = `${currentGenreName} türündeki en popüler, en beğenilen ve yeni çıkan filmleri keşfedin. IMDb puanları ve benzer film tavsiyeleri Moviva'da.${pageSuffix}`;

  const canonicalPath = urlSlug ? `/genres/${urlSlug}` : "/movies";
  const canonicalUrl =
    currentPage > 1 ? `${canonicalPath}?page=${currentPage}` : canonicalPath;

  return {
    title,
    description,
    keywords: [
      `${currentGenreName} filmleri`,
      `${currentGenreName} film önerileri`,
      `en iyi ${currentGenreName} filmleri`,
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

export default async function GenreMovies({ params, searchParams }) {
  const auth = await getAuthStatus();
  const isLoggedIn = auth?.authenticated ?? false;

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const urlSlug = resolvedParams.genre
    ? decodeURIComponent(resolvedParams.genre)
    : null;

  const currentPage = Number(resolvedSearchParams.page) || 1;
  const apiPage = currentPage > 0 ? currentPage - 1 : 0;

  const genres = await getGenreStats();

  let currentGenre = null;
  if (urlSlug) {
    const matchedCategory = genres.find(
      (g) => slugify(g.genreName) === urlSlug,
    );

    if (!matchedCategory) {
      notFound();
    }
    currentGenre = matchedCategory ? matchedCategory.genreName : null;
  }

  const moviesPage = await getMovies({
    page: apiPage,
    size: 24,
    genre: currentGenre,
  });

  const pageTitle = currentGenre ? `${currentGenre} Filmleri` : "Tüm Filmler";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: `${currentGenre || "Tüm"} kategorisindeki film listesi ve önerileri.`,
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
            currentGenre={currentGenre}
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
                currentGenre={currentGenre}
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
