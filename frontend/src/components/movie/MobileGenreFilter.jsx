"use client";

import { useRouter } from "next/navigation";
import { slugify } from "@/utils/slugify";

export default function MobileGenreFilter({
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
    <div className="w-full overflow-x-auto pb-4 pt-2 lg:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <div className="flex gap-2 px-4 w-max">
        <button
          onClick={() => handleGenreClick(null)}
          className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all ${
            !currentGenre
              ? "bg-danger text-white shadow-md scale-105"
              : "bg-gray-100 text-gray-700 border border-gray-200 active:bg-gray-200"
          }`}
        >
          Tüm Filmler
        </button>

        {genres.map((genre) => {
          const isActive = currentGenre === genre.genreName;

          return (
            <button
              key={genre.genreId}
              onClick={() => handleGenreClick(genre.genreName)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-danger text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 border border-gray-200 active:bg-gray-200"
              }`}
            >
              {genre.genreName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
