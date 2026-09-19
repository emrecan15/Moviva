"use client";

import { useState, useTransition } from "react";
import Avatar from "../ui/Avatar";
import { addComment } from "@/actions/commentActions";

export default function CommentForm({ movieId, username }) {
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    startTransition(async () => {
      const result = await addComment(movieId, comment);

      if (result.success) {
        setComment("");
      } else {
        alert(result.error || "Yorum gönderilirken bir sorun oluştu.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 mb-6"
    >
      <Avatar name={username} className="w-10 h-10 shrink-0" />

      <div className="flex flex-col w-full gap-3">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isPending}
          placeholder="Bu film hakkında ne düşünüyorsun?"
          className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-danger focus:ring-1 focus:ring-danger resize-none h-20 transition-all disabled:opacity-50"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!comment.trim() || isPending}
            className="px-6 py-2 bg-danger text-white text-sm font-semibold rounded-full hover:bg-danger/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isPending ? "Gönderiliyor..." : "Yorum Yap"}
          </button>
        </div>
      </div>
    </form>
  );
}
