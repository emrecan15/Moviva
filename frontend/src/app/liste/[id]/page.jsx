import { notFound } from "next/navigation";
import Genres from "@/components/movie/Genres";
import { getList, getListMovies } from "@/lib/movieService";
import Link from "next/link";
import { BsStarFill } from "react-icons/bs";
import AddMoviePopup from "@/components/list/AddMoviePopup";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const listId = Number(resolvedParams.id);

  if (!listId) return { title: "Liste Bulunamadı" };

  try {
    const listDetails = await getList(listId);

    if (!listDetails) {
      return {
        title: "Liste Bulunamadı | Moviva",
        robots: { index: false, follow: false },
      };
    }

    return {
      title: `${listDetails.name} | Moviva`,
      description:
        listDetails.description ||
        `${listDetails.ownerUsername} tarafından oluşturulan özel film listesi.`,
      openGraph: {
        title: `${listDetails.name} | Moviva`,
        description:
          listDetails.description ||
          `${listDetails.ownerUsername} tarafından hazırlanan film listesini incele.`,
        type: "website",
      },
    };
  } catch {
    return { title: "Liste Bulunamadı" };
  }
}

export default async function ListDetails({ params }) {
  const resolvedParams = await params;
  const listId = Number(resolvedParams.id);

  if (!listId) {
    notFound();
  }

  let listDetails = null;
  let movies = [];

  try {
    const [fetchedListDetails, fetchedMovies] = await Promise.all([
      getList(listId),
      getListMovies(listId),
    ]);

    listDetails = fetchedListDetails;
    movies = fetchedMovies || [];
  } catch (error) {
    notFound();
  }

  if (!listDetails) {
    notFound();
  }

  return (
    <section className="flex flex-col max-w-7xl w-full mx-auto my-5 gap-3 p-8 bg-gray-50 rounded-xl shadow-sm">
      <div className="flex justify-between py-4 border-b border-gray-300">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <span className="text-xs text-danger">Liste</span>
            <span className="text-xs text-gray-500">
              {listDetails.ownerUsername} tarafından
            </span>
          </div>
          <h1 className="font-bold text-xl md:text-2xl">{listDetails.name}</h1>
          {listDetails.description && (
            <span className="text-sm text-gray-500 font-medium">
              {listDetails.description}
            </span>
          )}
        </div>

        <AddMoviePopup listId={listId} />
      </div>

      <div className="flex gap-3 pb-2 border-b border-gray-300">
        <div className="flex flex-col gap-2 items-center justify-center px-4 border-e border-gray-300">
          <span className="font-semibold text-xl">
            {listDetails.totalMovies}
          </span>
          <span className="text-sm text-gray-500">Film</span>
        </div>

        <div className="flex flex-col gap-2 items-center justify-center px-4 border-e border-gray-300">
          <span className="font-semibold text-xl">
            {listDetails.averageRating}
          </span>
          <span className="text-sm text-gray-500">Ortalama Puan</span>
        </div>

        <div className="flex flex-col gap-2 items-center justify-center px-4">
          <span className="font-semibold text-xl">
            {listDetails.totalRuntime}
          </span>
          <span className="text-sm text-gray-500">Toplam Süre</span>
        </div>
      </div>

      <div className="flex gap-3 items-center justify-between my-4">
        <div className="flex gap-2 p-1 border border-gray-100 bg-cardbg rounded-2xl text-sm shadow-sm">
          <button className="rounded-2xl px-2 py-1 bg-white border border-gray-300">
            Tümü
          </button>
          <button className="rounded-2xl px-2 py-1">İzlendi</button>
          <button className="rounded-2xl px-2 py-1">İzlenmedi</button>
        </div>

        <div className="flex">
          <span className="text-xs">
            Sırala:{" "}
            <button className="text-xs text-black bg-white py-1 px-2 border border-gray-300 rounded-sm cursor-pointer">
              Eklenme Tarihi
            </button>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm text-gray-500">
          {movies.length} film gösteriliyor.
        </span>
        <ListItem movies={movies} />
      </div>
    </section>
  );
}

function ListItem({ movies }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        Bu listede henüz film bulunmuyor.
      </div>
    );
  }

  return movies.map((movie, index) => (
    <Link key={movie.movieId} href={`/film-detay/${movie.movieId}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full border border-gray-100 p-3 gap-3 bg-white rounded-2xl shadow-sm transition-all hover:shadow-md hover:border-gray-200">
        <div className="flex gap-3 w-full md:w-auto overflow-hidden">
          <span
            className={
              index < 3
                ? "flex items-center p-2 md:p-4 text-danger font-medium shrink-0"
                : "flex items-center p-2 md:p-4 text-gray-400 font-medium shrink-0"
            }
          >
            {index + 1}
          </span>

          <img
            src={`${process.env.NEXT_PUBLIC_TMDB_MEDIA_URL}${movie.posterUrl}`}
            alt={movie.movieName}
            className="w-12 h-16 md:w-14 md:h-18 object-cover rounded-xl shrink-0"
          />

          <div className="flex flex-col justify-center gap-1 md:gap-2 p-1 overflow-hidden">
            <div className="flex gap-2 items-center">
              <span className="truncate font-semibold text-gray-900">
                {movie.movieName}
              </span>
              <span className="text-xs text-gray-500 shrink-0">
                {movie.year}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span className="truncate">{movie.director}</span>
              <Genres genres={movie.genres} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto md:min-w-70 shrink-0 pt-3 mt-2 border-t border-gray-100 md:border-t-0 md:pt-0 md:mt-0 md:px-2">
          <span className="text-xs text-gray-500 md:w-12 md:text-right shrink-0">
            {movie.runtime}dk
          </span>

          <div className="flex justify-center items-center md:w-20 shrink-0">
            <BsStarFill className="text-yellow-400" />
            <span className="flex items-center text-xs text-gray-500 ml-1 font-medium">
              {Number(movie.voteAverage || 0).toFixed(1)}
            </span>
          </div>

          <span className="text-xs text-gray-500 md:w-27.5 md:text-right whitespace-nowrap shrink-0">
            {new Date(movie.createdAt).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  ));
}
