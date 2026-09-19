"use client";
import { useState, useTransition } from "react";
import { FiEdit3, FiCheck, FiX } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import UserTag from "@/components/ui/UserTag";
import { updateRecommenderCommentAction } from "@/actions/commentActions";
import { usePathname } from "next/navigation";

export default function RecommenderItem({ movie, currentUser }) {
  const recommender = movie.recommendedBy;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(movie.recommenderComment);
  const [isPending, startTransition] = useTransition();
  const currentPath = usePathname();

  if (!recommender) return null;

  const isOwner =
    currentUser?.authenticated &&
    currentUser?.username === recommender.username;

  const handleUpdate = () => {
    if (!editValue.trim() || editValue === movie.recommenderComment) {
      setIsEditing(false);
      return;
    }

    startTransition(async () => {
      const result = await updateRecommenderCommentAction(
        movie.id,
        editValue,
        currentPath,
      );

      if (result.success) {
        setIsEditing(false);
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <div className="flex w-full flex-col space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={recommender.username} className="h-10 w-10" />
          <span className="font-semibold text-logo">
            {recommender.username}
          </span>
          <UserTag tag={recommender.tag} />
        </div>

        {isOwner && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <FiEdit3 size={14} /> Düzenle
          </button>
        )}
      </div>

      <div className="h-px w-full bg-slogan/10" />

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            disabled={isPending}
            className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm italic outline-none transition focus:border-danger"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditValue(movie.recommenderComment);
              }}
              disabled={isPending}
              className="rounded bg-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-300"
            >
              İptal
            </button>
            <button
              onClick={handleUpdate}
              disabled={isPending}
              className="rounded bg-danger px-3 py-1.5 text-xs font-semibold text-white hover:bg-danger/90 disabled:opacity-50"
            >
              {isPending ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      ) : (
        <div className="font-sans text-sm italic leading-relaxed text-gray-600">
          {movie.recommenderComment}
        </div>
      )}
    </div>
  );
}
