import { getListMovies, getLists, getUserDetails } from "@/lib/movieService";
import Link from "next/link";
import {
  FiEdit3,
  FiHeart,
  FiStar,
  FiFilm,
  FiMessageCircle,
  FiPlus,
  FiLock,
} from "react-icons/fi";
import { getAuthStatus } from "@/lib/auth";
import { redirect } from "next/navigation";
import CreateListButton from "./_components/CreateListButton";
import AllListsModal from "./_components/AllListModal";

const favoriteMovies = [
  {
    id: 1,
    title: "Interstellar",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    rating: 9.2,
  },
  {
    id: 2,
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    rating: 9.0,
  },
  {
    id: 3,
    title: "Inception",
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    rating: 8.8,
  },
  {
    id: 4,
    title: "Fight Club",
    poster: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
    rating: 8.7,
  },
];

export default async function Profile() {
  let authStatus;
  let listsResponse;

  try {
    const [auth, fetchedLists] = await Promise.all([
      getAuthStatus(),
      getLists({ page: 0, size: 4 }),
    ]);

    authStatus = auth;
    listsResponse = fetchedLists;
  } catch (error) {
    throw new Error("Profil bilgileri yüklenirken sunucu hatası oluştu.");
  }

  if (!authStatus?.authenticated) {
    redirect("/");
  }

  const lists = listsResponse?.content || [];

  const listWithPreviewMovies = await Promise.all(
    lists.map(async (list) => {
      try {
        const movies = await getListMovies(list.id);
        const moviesArray =
          movies?.content || (Array.isArray(movies) ? movies : []);

        const previewMovies = moviesArray
          .slice(0, 3)
          .map((movie) => movie.posterUrl);

        return { ...list, previewMovies };
      } catch (error) {
        return { ...list, previewMovies: [] };
      }
    }),
  );

  const user = await getUserDetails();

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="h-32 bg-linear-to-r from-navbarbg via-navbarbg to-danger/70 sm:h-40" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-danger text-3xl font-bold text-white shadow-md sm:h-28 sm:w-28">
                  {user.username.charAt(0).toUpperCase()}
                </div>

                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.username}
                  </h1>

                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <Link
                href="/ayarlar"
                type="button"
                className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-danger px-5 text-sm font-semibold text-danger transition-colors hover:bg-danger hover:text-white sm:w-auto"
              >
                <FiEdit3 />
                Profili Düzenle
              </Link>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600">
              {user?.bio || ""}
            </p>
            <p className="flex mt-2 text-xs text-gray-400 gap-1">
              <span>
                {new Date(user.createdAt).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              tarihinde katıldı
            </p>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={FiFilm}
            value={user.recommendedMovieCount}
            label="Önerilen Film"
          />

          <StatCard icon={FiStar} value={user.voteCount} label="Verilen Oy" />

          <StatCard icon={FiHeart} value="16" label="Favori Film" />

          <StatCard
            icon={FiMessageCircle}
            value={user.commentCount}
            label="Yorum"
          />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Listelerim</h2>

                <p className="mt-1 text-sm text-gray-500">
                  Filmlerini kendi listelerinde organize et
                </p>
              </div>

              <CreateListButton />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {listWithPreviewMovies.slice(0, 4).map((list) => (
                <Link
                  href={`liste/${list.id}`}
                  key={list.id}
                  className="group rounded-xl border border-gray-100 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md"
                >
                  <div className="grid grid-cols-3 h-28 overflow-hidden rounded-lg bg-gray-100 divide-x divide-gray-200">
                    {[...(list.previewMovies || []), null, null, null]
                      .slice(0, 3)
                      .map((movie, index) => (
                        <div
                          key={index}
                          className="flex h-full w-full items-center justify-center overflow-hidden bg-gray-100"
                        >
                          {movie ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_TMDB_MEDIA_URL}${movie}`}
                              alt={`Film Posteri ${index + 1}`}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <FiFilm className="text-2xl text-gray-300" />
                          )}
                        </div>
                      ))}
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold text-gray-900">
                        {list.name}
                      </h3>

                      {list.private && (
                        <FiLock className="shrink-0 text-xs text-gray-400" />
                      )}
                    </div>

                    <p className="mt-1 truncate text-sm text-gray-500">
                      {list.description}
                    </p>

                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-gray-400">
                      <FiFilm />
                      {list.count} film
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            {listsResponse?.totalElements > 4 && (
              <AllListsModal
                initialTotalElements={listsResponse.totalElements}
              />
            )}
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Favorilerim</h2>

                <p className="mt-1 text-sm text-gray-500">
                  En sevdiğin filmler
                </p>
              </div>

              <FiHeart className="text-danger" />
            </div>

            <div className="flex flex-col">
              {favoriteMovies.map((movie, index) => (
                <button
                  key={movie.id}
                  type="button"
                  className={`group flex items-center gap-3 py-3 text-left ${
                    index !== favoriteMovies.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="h-16 w-11 shrink-0 overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-gray-800">
                      {movie.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-1">
                      <FiStar className="text-xs text-danger" />

                      <span className="text-xs font-medium text-gray-500">
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="mt-4 w-full rounded-full border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-danger hover:text-danger"
            >
              Tüm Favorileri Gör
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-danger">
        <Icon />
      </div>

      <p className="text-2xl font-bold text-gray-900">{value}</p>

      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}
