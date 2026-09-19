"use client";

import { useEffect, useState } from "react";
import {
  FiFilm,
  FiLock,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Link from "next/link";
import { getListsAction } from "@/actions/movieActions";

const PAGE_SIZE = 4;

export default function AllListsModal({ initialTotalElements }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lists, setLists] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(initialTotalElements / PAGE_SIZE),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchLists = async () => {
      setLoading(true);

      try {
        const response = await getListsAction(page, PAGE_SIZE);

        setLists(response?.content || []);
        setTotalPages(response?.totalPages || 1);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [isOpen, page]);

  const handleOpen = () => {
    setPage(0);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="mt-5 w-full rounded-full border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-danger hover:text-danger"
      >
        Tüm Listelerimi Gör
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onMouseDown={handleClose}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl sm:p-6"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Listelerim</h2>

                <p className="mt-1 text-sm text-gray-500">
                  Oluşturduğun tüm film listeleri
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label="Kapat"
              >
                <FiX />
              </button>
            </div>

            {loading ? (
              <div className="flex min-h-60 items-center justify-center">
                <p className="text-sm text-gray-500">Listeler yükleniyor...</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  {lists.map((list) => (
                    <Link
                      key={list.id}
                      href={`/liste/${list.id}`}
                      onClick={handleClose}
                      className="group rounded-xl border border-gray-100 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md"
                    >
                      <div className="grid h-28 grid-cols-3 divide-x divide-gray-200 overflow-hidden rounded-lg bg-gray-100">
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

                          {!list.isPublic && (
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

                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    disabled={page === 0}
                    onClick={() => setPage((current) => current - 1)}
                    className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiChevronLeft />
                    Önceki
                  </button>

                  <span className="text-sm text-gray-500">
                    {page + 1} / {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((current) => current + 1)}
                    className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Sonraki
                    <FiChevronRight />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
