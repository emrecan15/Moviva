"use client";
import { useState, useTransition } from "react";
import { FiEdit2, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import { usePathname } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import {
  deleteCommentAction,
  updateCommentAction,
} from "@/actions/commentActions";

export default function CommentItem({ comment, currentUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.comment);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const isOwner =
    currentUser?.authenticated && currentUser?.username === comment.username;

  const handleUpdate = () => {
    if (!editValue.trim() || editValue === comment.comment) {
      setIsEditing(false);
      return;
    }

    startTransition(async () => {
      const result = await updateCommentAction(comment.id, editValue, pathname);

      if (result.success) {
        setIsEditing(false);
      } else {
        alert(result.error);
      }
    });
  };

  const handleDelete = () => {
    if (confirm("Yorumunuzu silmek istediğinize emin misiniz?")) {
      startTransition(async () => {
        const result = await deleteCommentAction(comment.id, pathname);

        if (!result.success) {
          alert(result.error);
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={comment.username} className="h-8 w-8" />
          <span className="text-sm font-semibold">{comment.username}</span>
        </div>

        {isOwner && !isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 transition hover:text-gray-800"
              title="Düzenle"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 transition hover:text-danger"
              title="Sil"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <div>
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              disabled={isPending}
              className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none transition focus:border-danger"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditValue(comment.comment);
                }}
                disabled={isPending}
                className="flex items-center gap-1 rounded bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-300"
              >
                <FiX size={14} /> İptal
              </button>
              <button
                onClick={handleUpdate}
                disabled={isPending}
                className="flex items-center gap-1 rounded bg-danger px-3 py-1.5 text-xs font-semibold text-white hover:bg-danger/90 disabled:opacity-50"
              >
                <FiCheck size={14} /> {isPending ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        ) : (
          <span className="font-sans text-sm leading-relaxed text-gray-700">
            {comment.comment}
          </span>
        )}
      </div>
    </div>
  );
}
