"use client";

import { useEffect, useState, useTransition } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { BiDislike, BiSolidDislike } from "react-icons/bi";

import { voteMovieAction } from "@/actions/movieActions";

export default function VoteButtons({ movie, isLoggedIn, onAuthRequired }) {
  const [likes, setLikes] = useState(movie.likes ?? 0);
  const [dislikes, setDislikes] = useState(movie.dislikes ?? 0);

  const [liked, setLiked] = useState(movie.likedByUser ?? false);
  const [disliked, setDisliked] = useState(movie.dislikedByUser ?? false);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLikes(movie.likes ?? 0);
    setDislikes(movie.dislikes ?? 0);
    setLiked(movie.likedByUser ?? false);
    setDisliked(movie.dislikedByUser ?? false);
  }, [movie]);

  const handleVote = (type) => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }

    if (isPending) return;

    startTransition(async () => {
      const result = await voteMovieAction(movie.id, type);

      if (!result.success) {
        console.error(result.error);
        return;
      }

      const data = result.data;

      setLikes(data.likes);
      setDislikes(data.dislikes);
      setLiked(data.liked);
      setDisliked(data.disliked);
    });
  };

  return (
    <div className="flex items-center justify-around gap-4">
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleVote("like")}
        className={`
          flex items-center gap-1 text-sm
          transition-colors duration-200
          cursor-pointer
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${liked ? "text-danger" : "text-gray-600 hover:text-danger"}
        `}
      >
        {liked ? (
          <FaHeart className="text-lg" />
        ) : (
          <FaRegHeart className="text-lg" />
        )}

        <span className="text-xs font-medium">{likes}</span>
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={() => handleVote("dislike")}
        className={`
          flex items-center gap-1 text-sm
          transition-colors duration-200
          cursor-pointer
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${disliked ? "text-danger" : "text-gray-600 hover:text-danger"}
        `}
      >
        {disliked ? <BiSolidDislike /> : <BiDislike />}

        <span className="text-xs font-medium">{dislikes}</span>
      </button>
    </div>
  );
}
