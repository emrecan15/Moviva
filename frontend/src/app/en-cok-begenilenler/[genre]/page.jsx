import { getMostLikedMovies, getGenreStats } from "@/lib/movieService";
import MovieGrid from "@/components/movie/MovieGrid";
import GenreFilter from "@/components/movie/GenreFilter";
import Pagination from "@/components/Pagination";
import { slugify } from "@/utils/slugify";
import { getAuthStatus } from "@/lib/auth";
import { notFound } from "next/navigation";
import MobileGenreFilter from "@/components/movie/MobileGenreFilter";

export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const urlSlug = resolvedParams?.genre
    ? decodeURIComponent(resolvedParams.genre)
    : null;

  const page = Number(resolvedSearchParams.page ?? 1);

  let currentGenreName = null;

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
      currentGenreName = null;
    }
  }

  const pageSuffix = page > 1 ? ` - Sayfa ${page}` : "";
  const title = currentGenreName
    ? `En Çok Beğenilen ${currentGenreName} Filmleri${pageSuffix} | Moviva`
    : `En Çok Beğenilen Filmler${pageSuffix} | Moviva`;

  const description = currentGenreName
    ? `Kullanıcılar tarafından en yüksek puanları alan ve en çok beğenilen ${currentGenreName} filmleri listesi. IMDb puanları ve öneriler.${pageSuffix}`
    : `Moviva topluluğu tarafından en çok beğenilen, yüksek puanlı popüler filmleri keşfet.${pageSuffix}`;

  const canonicalPath = urlSlug
    ? `/en-cok-begenilenler/${urlSlug}`
    : "/en-cok-begenilenler";
  const canonicalUrl =
    page > 1 ? `${canonicalPath}?page=${page}` : canonicalPath;

  return {
    title,
    description,
    keywords: [
      "en çok beğenilen filmler",
      "en popüler filmler",
      "en iyi filmler",
      currentGenreName ? `${currentGenreName} film önerileri` : null,
      currentGenreName ? `en iyi ${currentGenreName} filmleri` : null,
      "moviva",
    ].filter(Boolean),
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

export default async function MostLikedMovies({ params, searchParams }) {
  const auth = await getAuthStatus();
  const isLoggedIn = auth?.authenticated ?? false;

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const urlSlug = resolvedParams?.genre
    ? decodeURIComponent(resolvedParams.genre)
    : null;

  const page = Number(resolvedSearchParams.page ?? 1);
  const apiPage = page > 0 ? page - 1 : 0;

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

  const moviesPage = await getMostLikedMovies({
    page: apiPage,
    size: 24,
    genre: currentGenre,
  });

  const pageTitle = currentGenre
    ? `En Çok Beğenilen ${currentGenre} Filmleri`
    : "En Çok Beğenilen Filmler";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: `${currentGenre || "Genel"} kategorisinde en çok beğenilen film listesi.`,
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
              currentGenre={currentGenre}
              basePath="/en-cok-begenilenler"
            />
          </aside>
        </div>
        <Pagination totalPage={moviesPage?.totalPages || 1} />
      </div>
    </section>
  );
}
