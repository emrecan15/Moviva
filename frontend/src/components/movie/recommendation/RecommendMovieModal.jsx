"use client";
import { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import { searchMovies } from "../../../api/movieService";
import { createRecommendation } from "@/actions/movieActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { recommendationSchema } from "@/schemas/comment/recommenderCommentSchema";

export default function RecommendMovieModal({ isOpen, onClose, onSuccess }) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.trim().length < 2 || selectedMovie) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await searchMovies(query.trim(), controller.signal);

        setResults(response.data);
      } catch (error) {
        if (error.name === "CanceledError") {
          return;
        }
        console.error(error);
        setError(
          error.response?.data?.message ||
            "Filmler getirilirken bir hata oluştu.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, selectedMovie]);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setQuery("");
    setResults([]);
    setError("");
  };

  const handleChangeMovie = () => {
    setSelectedMovie(null);
    setComment("");
    setError("");
  };

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setSelectedMovie(null);
    setComment("");
    setError("");

    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMovie?.availableForRecommendation) {
      setError("Bu film zaten sitede mevcut ve tekrar önerilemez.");
      return;
    }

    const validation = recommendationSchema.safeParse({
      recommenderComment: comment,
    });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const recommendation = {
        tmdbId: selectedMovie.tmdbId,

        comment: validation.data.recommenderComment,
      };

      const result = await createRecommendation(recommendation);

      if (!result.success) {
        setError(result.error);
        return;
      }

      handleClose();
      router.refresh();
      toast.success("Film başarıyla önerildi.");
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Film önerilirken bir hata oluştu.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Film Öner">
      <div className="flex flex-col gap-5">
        {!selectedMovie && (
          <>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="movie-search"
                className="text-sm font-medium text-gray-700"
              >
                Film Ara
              </label>

              <input
                id="movie-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Film adı yazın..."
                autoFocus
                className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-danger"
              />
            </div>

            {loading && (
              <p className="text-sm text-gray-500">Filmler aranıyor...</p>
            )}

            {error && <p className="text-sm text-danger">{error}</p>}

            {!loading && results.length > 0 && (
              <div className="flex max-h-80 flex-col overflow-y-auto rounded-xl border border-gray-100">
                {results.map((movie) => {
                  const isAvailable = movie.availableForRecommendation;

                  return (
                    <button
                      key={movie.tmdbId}
                      type="button"
                      onClick={() => handleMovieSelect(movie)}
                      className="flex w-full cursor-pointer gap-3 border-b border-gray-100 p-3 text-left transition-colors last:border-b-0 hover:bg-gray-50"
                    >
                      {/* Poster */}
                      {movie.posterUrl ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${movie.posterUrl}`}
                          alt={movie.movieName}
                          className="h-16 w-11 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-16 w-11 shrink-0 rounded-md bg-gray-200" />
                      )}

                      {/* Bilgiler */}
                      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium text-gray-900">
                            {movie.movieName}
                          </span>

                          {!isAvailable && (
                            <span className="shrink-0 text-xs font-semibold text-danger">
                              Sitede mevcut
                            </span>
                          )}
                        </div>

                        <span className="text-sm text-gray-500">
                          {movie.releaseDate?.slice(0, 4) || "Tarih bilinmiyor"}
                        </span>

                        <span className="text-xs text-gray-400">
                          ★ {movie.voteAverage?.toFixed(1) ?? "N/A"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {!loading &&
              !error &&
              query.trim().length >= 2 &&
              results.length === 0 && (
                <p className="text-sm text-gray-500">Film bulunamadı.</p>
              )}
          </>
        )}

        {selectedMovie && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Film kartı */}
            <div
              className={`flex gap-4 rounded-xl border p-4 ${
                selectedMovie.availableForRecommendation
                  ? "border-gray-200 bg-gray-50"
                  : "border-danger/20 bg-danger/5"
              }`}
            >
              {selectedMovie.posterUrl ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${selectedMovie.posterUrl}`}
                  alt={selectedMovie.movieName}
                  className="h-36 w-24 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="h-36 w-24 shrink-0 rounded-lg bg-gray-200" />
              )}

              <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedMovie.movieName}
                </h3>

                {selectedMovie.originalTitle &&
                  selectedMovie.originalTitle !== selectedMovie.movieName && (
                    <p className="text-sm text-gray-500">
                      {selectedMovie.originalTitle}
                    </p>
                  )}

                <p className="text-sm text-gray-500">
                  {selectedMovie.releaseDate?.slice(0, 4) || "Tarih bilinmiyor"}
                </p>

                <p className="text-sm text-gray-600">
                  ★ {selectedMovie.voteAverage?.toFixed(1) ?? "N/A"}
                </p>

                {!selectedMovie.availableForRecommendation && (
                  <span className="w-fit rounded-md bg-danger/10 px-2 py-1 text-xs font-semibold text-danger">
                    Sitede mevcut
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleChangeMovie}
                  className="mt-1 w-fit text-sm font-medium text-danger hover:underline"
                >
                  Filmi değiştir
                </button>
              </div>
            </div>

            {!selectedMovie.availableForRecommendation ? (
              <div className="rounded-xl border border-danger/20 bg-danger/5 p-4">
                <p className="text-sm font-medium text-danger">
                  Bu film zaten sitede mevcut.
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Aynı filmi tekrar öneremezsiniz. Başka bir film
                  seçebilirsiniz.
                </p>
              </div>
            ) : (
              <>
                {selectedMovie.description && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-semibold text-gray-800">
                      Film Hakkında
                    </h4>

                    <p className="text-sm leading-relaxed text-gray-600">
                      {selectedMovie.description}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="recommendation-comment"
                    className="text-sm font-medium text-gray-700"
                  >
                    Neden Öneriyorsun?
                  </label>

                  <textarea
                    id="recommendation-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Bu filmi neden izlemeliler?"
                    rows={5}
                    maxLength={2000}
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-danger"
                  />

                  <div className="flex justify-end">
                    <span className="text-xs text-gray-400">
                      {comment.length}/2000
                    </span>
                  </div>
                </div>

                {error && <p className="text-sm text-danger">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl bg-danger font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Öneriliyor..." : "Filmi Öner"}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </Modal>
  );
}
