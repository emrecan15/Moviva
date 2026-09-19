"use server";

import { fetchApi } from "@/lib/fetchClient";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginAction(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (response.status === 429) {
      const errorText = await response.text();
      return {
        success: false,
        error: errorText || "Çok fazla deneme yaptınız. Lütfen bekleyin.",
      };
    }

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Giriş başarısız." };
    }

    const userData = await response.json();
    const setCookieHeader = response.headers.get("set-cookie");

    if (setCookieHeader) {
      const tokenMatch = setCookieHeader.match(/token=([^;]+)/);
      if (tokenMatch) {
        const cookieStore = await cookies();
        cookieStore.set("token", tokenMatch[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
          sameSite: "lax",
        });
      }
    }

    return { success: true, user: userData };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Giriş sırasında bir hata oluştu.",
    };
  }
}

export async function registerAction(data) {
  try {
    const userData = await fetchApi("/user/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return { success: true, user: userData };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Kayıt sırasında bir hata oluştu.",
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();

  try {
    await fetchApi("/auth/logout", { method: "POST", cache: "no-store" });
  } catch (error) {
    console.error("Logout Error:", error.message);
  } finally {
    cookieStore.delete("token");
  }

  return { success: true };
}

export async function resetPasswordAction(data) {
  try {
    const responseData = await fetchApi("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return {
      success: true,
      message: responseData.message || "Şifre sıfırlama isteği gönderildi.",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Şifre sıfırlama isteği gönderilemedi.",
    };
  }
}

export async function resetPasswordConfirmAction(data) {
  try {
    const responseText = await fetchApi("/auth/reset-password/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return {
      success: true,
      message: responseText || "Şifre başarıyla sıfırlandı.",
    };
  } catch (error) {
    return { success: false, error: error.message || "Şifre sıfırlanamadı." };
  }
}

export async function changePasswordAction(data) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("token")?.value) {
      return { success: false, error: "Oturum bulunamadı." };
    }

    const responseData = await fetchApi("/user/change-password", {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
    });

    return {
      success: true,
      message: responseData?.message || "Şifre başarıyla değiştirildi.",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Şifre değiştirme sırasında bir hata oluştu.",
    };
  }
}

export async function updateAccountAction(data) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("token")?.value) {
      return { success: false, error: "Oturum süreniz dolmuş." };
    }

    const responseData = await fetchApi("/user/update", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    revalidatePath("/profil");
    revalidatePath("/ayarlar");

    return {
      success: true,
      message: "Hesap bilgileriniz başarıyla güncellendi.",
      data: responseData,
    };
  } catch (error) {
    console.error("HESAP GÜNCELLEME HATASI:", error.message);
    return {
      success: false,
      error: error.message || "Hesap güncelleme başarısız.",
    };
  }
}
