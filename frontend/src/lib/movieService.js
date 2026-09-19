import "server-only";
import { fetchApi } from "./fetchClient";
import { cookies } from "next/headers";

export async function getMovieDetails(movieId) {
  try {
    return await fetchApi(`/movies/${movieId}`, { cache: "no-store" });
  } catch (error) {
    if (error.status === 404) return null;
    console.error("getMovieDetails Hatası:", error.message);
    return null;
  }
}

export async function getMovies({ page = 0, size = 10, genre = "" }) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  if (genre) params.append("genre", genre);

  try {
    return await fetchApi(
      `/movies/getRecentlyAddedMovies?${params.toString()}`,
      {
        cache: "no-store",
      },
    );
  } catch (error) {
    console.error("getMovies Hatası:", error.message);

    return { content: [], totalPages: 0, totalElements: 0 };
  }
}

export async function getMostLikedMovies({ page = 0, size = 10, genre = "" }) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  if (genre) params.append("genre", genre);

  try {
    return await fetchApi(`/movies/getMostLikedMovies?${params.toString()}`, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("getMostLikedMovies Hatası:", error.message);
    return { content: [], totalPages: 0, totalElements: 0 };
  }
}

export async function getGenreStats() {
  try {
    return await fetchApi(`/genre-stats`, { cache: "no-store" });
  } catch (error) {
    console.error("getGenreStats Hatası:", error.message);
    return [];
  }
}
/*
export async function getLists({ page = 0, size = 4 }) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  try {
    return await fetchApi(`/lists?${params.toString()}`, { cache: "no-store" });
  } catch (error) {
    console.error("getLists Hatası:", error.message);
    return { content: [], totalPages: 0 };
  }
}
  */

export async function getLists({ page = 0, size = 4 }) {
  const cookieStore = await cookies();
  if (!cookieStore.get("token")?.value) {
    return { content: [], totalPages: 0 };
  }

  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  try {
    return await fetchApi(`/lists?${params.toString()}`, { cache: "no-store" });
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      return { content: [], totalPages: 0 };
    }

    console.error(
      "getLists Hatası:",
      error.message || "Bilinmeyen sunucu hatası",
    );
    return { content: [], totalPages: 0 };
  }
}

export async function getListMovies(listId) {
  try {
    const data = await fetchApi(`/lists/${listId}/movies`, {
      cache: "no-store",
    });
    return data?.content || [];
  } catch (error) {
    console.error("getListMovies Hatası:", error.message);
    return [];
  }
}

export async function searchLocalMovies(query) {
  if (!query || query.trim().length === 0) return [];

  try {
    return await fetchApi(
      `/movies/local-search?query=${encodeURIComponent(query)}`,
      { cache: "no-store" },
    );
  } catch (error) {
    console.error("searchLocalMovies Hatası:", error.message);
    return [];
  }
}

export async function getUserDetails() {
  try {
    return await fetchApi(`/user/userinfo`, { cache: "no-store" });
  } catch (error) {
    if (error.status === 401 || error.status === 403) return null;

    console.error("getUserDetails Hatası:", error.message);
    return null;
  }
}

export async function getList(listId) {
  try {
    return await fetchApi(`/lists/${listId}`, { cache: "no-store" });
  } catch (error) {
    if (error.status === 404) return null;
    console.error("getList Hatası:", error.message);
    return null;
  }
}
