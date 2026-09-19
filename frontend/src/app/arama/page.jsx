import { searchLocalMovies } from "@/lib/movieService";
import MovieGrid from "@/components/movie/MovieGrid";
import { getAuthStatus } from "@/lib/auth";

export default async function SearchPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams.q || "";

  const [auth, movies] = await Promise.all([
    getAuthStatus(),
    searchLocalMovies(searchQuery),
  ]);

  return (
    <section className="w-full py-8">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-logo">
          "{searchQuery}" için arama sonuçları
        </h1>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <MovieGrid movies={movies} isLoggedIn={auth?.authenticated} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-cardbg rounded-2xl border border-gray-100">
            <span className="text-xl font-bold text-logo">Film bulunamadı</span>
            <span className="text-sm mt-2 text-gray-500">
              Farklı kelimelerle tekrar aramayı deneyebilirsiniz.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
