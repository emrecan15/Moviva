import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return token ? { Cookie: `token=${token}` } : {};
}

/**
 *
 * @param {string} endpoint
 * @param {object} options
 */
export async function fetchApi(endpoint, options = {}) {
  const headers = await getAuthHeaders();

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (response.status === 429) {
    const errorMessage = await response.text();

    throw {
      status: 429,
      message: errorMessage || "Çok hızlı işlem yapıyorsunuz. Lütfen bekleyin.",
    };
  }

  if (response.ok) {
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  }

  const errorBody = await response.text();
  let parsedError = null;

  try {
    parsedError = JSON.parse(errorBody);
  } catch {
    parsedError = { message: errorBody };
  }

  throw {
    status: response.status,
    message: parsedError?.error || parsedError?.message || "Bilinmeyen hata",
  };
}
