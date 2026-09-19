"use client";

import { useRouter } from "next/navigation";
import { slugify } from "@/utils/slugify";

export default function GenreFilter({
  genres,
  currentGenre,
  basePath = "/filmler",
}) {
  const router = useRouter();

  const handleGenreClick = (genreName) => {
    if (!genreName || currentGenre === genreName) {
      router.push(basePath);
    } else {
      const urlFriendlyGenre = slugify(genreName);
      router.push(`${basePath}/${urlFriendlyGenre}`);
    }
  };

  return (
    <aside className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger/10">
            <svg
              className="h-5 w-5 text-danger"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 6h18M6 12h12M10 18h4"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-[17px] font-semibold text-gray-900">
              Film Türleri
            </h3>
            <p className="mt-0.5 text-xs text-gray-400">
              Filmleri türe göre keşfet
            </p>
          </div>
        </div>
      </div>

      <div className="p-3">
        <button
          type="button"
          onClick={() => handleGenreClick(null)}
          className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[15px] font-medium transition-all duration-200 cursor-pointer ${
            !currentGenre
              ? "bg-danger text-white shadow-md shadow-danger/20"
              : "text-gray-600 hover:bg-rating hover:text-gray-900"
          }`}
        >
          <span className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                !currentGenre
                  ? "bg-white/15"
                  : "bg-gray-100 group-hover:bg-white"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </span>

            <span>Tüm Filmler</span>
          </span>

          {!currentGenre && (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        <div className="mt-2 space-y-1">
          {genres.map((genre) => {
            const isActive = currentGenre === genre.genreName;

            return (
              <button
                type="button"
                key={genre.genreId}
                onClick={() => handleGenreClick(genre.genreName)}
                className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-rating text-danger"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-danger shadow-[0_0_0_4px_rgba(220,38,38,0.1)]"
                        : "bg-gray-300 group-hover:bg-gray-400"
                    }`}
                  />

                  <span className="truncate text-[15px] font-medium">
                    {genre.genreName}
                  </span>
                </span>

                <span
                  className={`ml-3 shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isActive
                      ? "bg-white/70 text-danger"
                      : "bg-gray-100 text-gray-500 group-hover:bg-white"
                  }`}
                >
                  {genre.genreCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
