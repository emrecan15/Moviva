import api from "./axiosInstance";

// Backend'in gerçek adresi (Sadece Server tarafında kullanılacak)
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.50:8080/api";

// ============================================================================
// 1. KISIM: SUNUCUDA (SERVER COMPONENTS) ÇALIŞANLAR -> Native Fetch
// Sayfa ilk yüklenirken (örn: page.jsx) çağrılan fonksiyonlar. CORS'a takılmazlar.
// ============================================================================

export async function getMovieDetails(movieId) {
  const response = await fetch(`${BASE_URL}/movies/${movieId}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Film detayları alınamadı");
  return response.json();
}

export async function getMovies({ page = 0, size = 10, genre = "" }) {
  // Fetch ile parametre gönderirken URLSearchParams kullanmak en temiz yoldur
  const params = new URLSearchParams({ page, size });
  if (genre) params.append("genre", genre);

  const response = await fetch(
    `${BASE_URL}/movies/getRecentlyAddedMovies?${params}`,
    {
      cache: "no-store",
    },
  );
  if (!response.ok) throw new Error("Filmler alınamadı");
  return response.json();
}

export async function getMostLikedMovies({ page = 0, size = 10, genre = "" }) {
  const params = new URLSearchParams({ page, size });
  if (genre) params.append("genre", genre);

  const response = await fetch(
    `${BASE_URL}/movies/getMostLikedMovies?${params}`,
    {
      cache: "no-store",
    },
  );
  if (!response.ok) throw new Error("En beğenilen filmler alınamadı");
  return response.json();
}

export async function getGenreStats() {
  const response = await fetch(`${BASE_URL}/genre-stats`, {
    cache: "no-store", // İleride bunu { next: { revalidate: 3600 } } yapıp 1 saatte bir güncellenmesini sağlayabilirsin
  });
  if (!response.ok) throw new Error("Kategori istatistikleri alınamadı");
  return response.json();
}

// ============================================================================
// 2. KISIM: TARAYICIDA (CLIENT) ÇALIŞANLAR -> Axios ile Proxy üzerinden
// Kullanıcı yazı yazarken veya butona basarken çalışan fonksiyonlar.
// ============================================================================

// Canlı arama yaparken (Kullanıcı klavyeden tuşa basarken) iptal etme (signal)
// özelliği kullanıldığı için Axios olarak kalması çok doğru bir karar.
export const searchMovies = (query, signal) => {
  return api.get("/movies/search", {
    params: { query },
    signal: signal, // AbortController için gerekli
  });
};

// Bu işlem de tarayıcıdan (Kullanıcı form doldurduğunda) tetikleneceği için
// şimdilik Axios'ta kalabilir. İleride Server Action'a çevirebilirsin.
export const createRecommendation = (data) => {
  return api.post("/recommendations", data);
};
