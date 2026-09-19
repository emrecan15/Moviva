"use client";

import { useState, useEffect } from "react";
import { IoMdAdd, IoMdClose } from "react-icons/io";

import { addMovieToList, searchMoviesAction } from "@/actions/movieActions";

export default function AddMoviePopup({ listId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchMoviesAction(searchQuery);

        setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Arama hatası:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleAddToMyList = async (movie) => {
    console.log(
      `${movie.movieName} filmi ${listId} ID'li listeye ekleniyor...`,
    );

    console.log("Movie ID Değeri:", movie.id);

    try {
      await addMovieToList(listId, movie.id);
    } catch (error) {
      console.log("Film listeye eklenirken bir hata oluştu.");
    }

    setIsOpen(false);
    setSearchQuery("");
    setResults([]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 h-8 px-4 bg-danger hover:bg-red-700 transition-colors rounded-sm text-white cursor-pointer"
      >
        <IoMdAdd />
        <span className="text-sm">Film Ekle</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
            {/* Popup Başlığı */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0">
              <h3 className="font-semibold text-lg">Listeye Film Ekle</h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSearchQuery("");
                  setResults([]);
                }}
                className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="p-4 flex flex-col flex-1 overflow-hidden">
              <input
                type="text"
                placeholder="Film adı ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-danger transition-all mb-4 shrink-0"
                autoFocus
              />

              <div className="flex-1 overflow-y-auto min-h-50">
                {isSearching ? (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    Aranıyor...
                  </div>
                ) : results.length > 0 ? (
                  <div className="flex flex-col gap-2 pr-1">
                    {results.map((movie) => (
                      <div
                        key={movie.tmdbId}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 border border-transparent hover:border-gray-100 rounded-lg transition-colors group cursor-pointer"
                        onClick={() => handleAddToMyList(movie)}
                      >
                        <div className="flex items-center gap-3">
                          {/* Küçük Afiş */}
                          <div className="w-10 h-14 bg-gray-200 rounded overflow-hidden shrink-0">
                            {movie.posterUrl && (
                              <img
                                src={`${process.env.NEXT_PUBLIC_TMDB_MEDIA_URL || ""}${movie.posterUrl}`}
                                alt={movie.movieName}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 group-hover:text-danger transition-colors line-clamp-1">
                              {movie.movieName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {movie.releaseDate
                                ? movie.releaseDate.substring(0, 4)
                                : "Bilinmiyor"}
                            </span>
                          </div>
                        </div>

                        <button className="text-xs bg-gray-100 group-hover:bg-danger group-hover:text-white text-gray-700 px-4 py-1.5 rounded-full transition-colors font-medium shrink-0 cursor-pointer">
                          Ekle
                        </button>
                      </div>
                    ))}
                  </div>
                ) : searchQuery.length > 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    "{searchQuery}" ile eşleşen film bulunamadı.
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                    Aramak için film adını yazın...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
