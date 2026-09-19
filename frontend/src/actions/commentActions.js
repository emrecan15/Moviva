"use server";

import { fetchApi } from "@/lib/fetchClient";
import { commentSchema } from "@/schemas/comment/commentSchema";
import { recommendationSchema } from "@/schemas/comment/recommenderCommentSchema";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function addComment(movieId, commentText) {
  try {
    const validation = commentSchema.safeParse({ comment: commentText });

    if (!validation.success) {
      return { success: false, error: validation.error.issues[0].message };
    }

    const cookieStore = await cookies();
    if (!cookieStore.get("token")?.value) {
      return { success: false, error: "Yorum yapmak için giriş yapmalısınız." };
    }

    await fetchApi(`/comments/`, {
      method: "POST",
      body: JSON.stringify({
        movieId,
        comment: validation.data.comment,
        containsSpoiler: false,
      }),
    });

    revalidatePath(`/film-detay/${movieId}`);
    return { success: true };
  } catch (error) {
    console.error("ADD COMMENT ERROR:", error);
    return {
      success: false,
      error: error.message || "Yorum eklenirken bir hata oluştu.",
    };
  }
}

export async function updateCommentAction(commentId, commentText, currentPath) {
  try {
    const validation = commentSchema.safeParse({ comment: commentText });
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0].message };
    }

    const cookieStore = await cookies();
    if (!cookieStore.get("token")?.value) {
      return {
        success: false,
        error: "Oturum süreniz dolmuş, lütfen tekrar giriş yapın.",
      };
    }

    await fetchApi(`/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({ comment: validation.data.comment }),
    });

    revalidatePath(currentPath);
    return { success: true };
  } catch (error) {
    console.error("Update Action Error:", error);

    if (error.status === 403)
      return { success: false, error: "Bu yorumu değiştirme yetkiniz yok." };
    if (error.status === 400)
      return { success: false, error: "Geçersiz veri gönderildi." };

    return {
      success: false,
      error:
        error.message ||
        "Yorum güncellenirken sistemsel bir hata meydana geldi.",
    };
  }
}

export async function deleteCommentAction(commentId, currentPath) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("token")?.value) {
      return {
        success: false,
        error: "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.",
      };
    }

    await fetchApi(`/comments/${commentId}`, {
      method: "DELETE",
    });

    revalidatePath(currentPath);
    return { success: true };
  } catch (error) {
    console.error("Delete Action Error:", error);

    if (error.status === 403)
      return { success: false, error: "Bu yorumu silme yetkiniz yok." };

    return { success: false, error: error.message || "Yorum silinemedi." };
  }
}

export async function updateRecommenderCommentAction(
  movieId,
  commentText,
  currentPath,
) {
  try {
    const validation = recommendationSchema.safeParse({
      recommenderComment: commentText,
    });
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0].message };
    }

    const cookieStore = await cookies();
    if (!cookieStore.get("token")?.value) {
      return {
        success: false,
        error: "Oturum süreniz dolmuş, lütfen tekrar giriş yapın.",
      };
    }

    await fetchApi(`/recommendations/${movieId}`, {
      method: "PUT",
      body: JSON.stringify({
        recommenderComment: validation.data.recommenderComment,
      }),
    });

    revalidatePath(currentPath);
    return { success: true };
  } catch (error) {
    console.error("Update Recommendation Action Error:", error);

    if (error.status === 403)
      return { success: false, error: "Bu öneriyi değiştirme yetkiniz yok." };
    if (error.status === 400)
      return { success: false, error: "Geçersiz metin gönderildi." };

    return {
      success: false,
      error:
        error.message || "Tavsiye güncellenirken sistemsel bir hata oluştu.",
    };
  }
}
