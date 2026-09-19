import "server-only";
import { cookies } from "next/headers";
import { fetchApi } from "./fetchClient";

export async function getAuthStatus() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        authenticated: false,
        user: null,
      };
    }

    return await fetchApi("/auth/status", {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Auth Status Hatası:", error.message);

    return {
      authenticated: false,
      user: null,
    };
  }
}
