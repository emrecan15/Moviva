"use server";

import { fetchApi } from "@/lib/fetchClient";
import { getLists, searchLocalMovies } from "@/lib/movieService";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function voteMovieAction(movieId, type) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("token")?.value) {
      return { success: false, error: "Oy vermek için giriş yapmalısınız." };
    }

    const data = await fetchApi(`/movies/${movieId}/${type}`, {
      method: "POST",
      cache: "no-store",
    });

    return { success: true, data };
  } catch (error) {
    console.error("VOTE ACTION ERROR:", error);
    return {
      success: false,
      error: error.message || "Oy işlemi sırasında bir hata oluştu.",
    };
  }
}

export async function createRecommendation(data) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("token")?.value) {
      return { success: false, error: "Film önermek için giriş yapmalısınız." };
    }

    await fetchApi(`/recommendations`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    return { success: true };
  } catch (error) {
    console.error("CREATE RECOMMENDATION ERROR:", error);
    return {
      success: false,
      error: error.message || "Film önerilirken bir hata oluştu.",
    };
  }
}

export async function searchMoviesAction(query) {
  try {
    const data = await searchLocalMovies(query);
    return data || [];
  } catch (error) {
    console.error("Server Action Hatası:", error);
    return [];
  }
}

export async function addMovieToList(listId, movieId) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("token")?.value) {
      return {
        success: false,
        error: "Listeye film eklemek için giriş yapmalısınız.",
      };
    }

    await fetchApi(`/lists/${listId}/movies/${movieId}`, {
      method: "POST",
    });

    revalidatePath(`/liste/${listId}`);
    return { success: true };
  } catch (error) {
    console.error("ADD MOVIE TO LIST ERROR:", error);
    return {
      success: false,
      error: error.message || "Film eklenirken bir hata oluştu.",
    };
  }
}
/*
export async function fetchUserListsAction() {
  try {
    const response = await getLists({ page: 0, size: 50 });
    return response?.content || [];
  } catch (error) {
    console.error("Listeler çekilirken hata:", error);
    return [];
  }
}
  */

export async function fetchUserListsAction() {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("token")?.value) {
      return [];
    }

    const response = await fetchApi(`/lists?page=0&size=50`, {
      cache: "no-store",
    });

    return response?.content || [];
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      return [];
    }

    console.error("fetchUserListsAction Hatası:", error.message || error);
    return [];
  }
}

export async function createUserListAction(name, isPublic = true) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("token")?.value) {
      return {
        success: false,
        error: "Liste oluşturmak için giriş yapmalısınız.",
      };
    }

    const data = await fetchApi(`/lists`, {
      method: "POST",
      body: JSON.stringify({ name, isPublic }),
    });

    return { success: true, data };
  } catch (error) {
    console.error("CREATE LIST ERROR:", error);
    return {
      success: false,
      error: error.message || "Sunucu bağlantı hatası.",
    };
  }
}

export async function getListsAction(page = 0, size = 4) {
  try {
    const cookieStore = await cookies();

    if (!cookieStore.get("token")?.value) {
      return {
        content: [],
        totalPages: 0,
        totalElements: 0,
      };
    }

    const response = await fetchApi(`/lists?page=${page}&size=${size}`, {
      cache: "no-store",
    });

    const lists = response?.content || [];

    const listsWithPreviewMovies = await Promise.all(
      lists.map(async (list) => {
        try {
          const moviesResponse = await fetchApi(
            `/lists/${list.id}/movies?page=0&size=3`,
            {
              cache: "no-store",
            },
          );

          const previewMovies = (moviesResponse?.content || [])
            .slice(0, 3)
            .map((movie) => movie.posterUrl);

          return {
            ...list,
            previewMovies,
          };
        } catch {
          return {
            ...list,
            previewMovies: [],
          };
        }
      }),
    );

    return {
      ...response,
      content: listsWithPreviewMovies,
    };
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      return {
        content: [],
        totalPages: 0,
        totalElements: 0,
      };
    }

    console.error("getListsAction Hatası:", error.message || error);

    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
    };
  }
}
