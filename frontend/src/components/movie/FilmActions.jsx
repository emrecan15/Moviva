"use client";

import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { BiDislike, BiSolidDislike } from "react-icons/bi";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { useState, useTransition } from "react";
import { voteMovieAction } from "@/actions/movieActions";
import SaveToMyListModal from "../list/SaveToMyListModal";
import { AUTH_VIEW } from "../auth/constants/auth";
import AuthModal from "../auth/components/AuthModal";

export default function FilmActions({ movie, isLoggedIn }) {
  const [likes, setLikes] = useState(movie.likes ?? 0);
  const [dislikes, setDislikes] = useState(movie.dislikes ?? 0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authView, setAuthView] = useState(AUTH_VIEW.LOGIN);

  const [isLiked, setIsLiked] = useState(movie.likedByUser ?? false);
  const [isDisliked, setIsDisliked] = useState(movie.dislikedByUser ?? false);

  const [isPending, startTransition] = useTransition();

  const handleVote = (type) => {
    if (!isLoggedIn) {
      setAuthView(AUTH_VIEW.LOGIN);
      setIsLoginModalOpen(true);
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
      setIsLiked(data.liked);
      setIsDisliked(data.disliked);
    });
  };

  const handleOpenListModal = () => {
    if (!isLoggedIn) {
      setAuthView(AUTH_VIEW.LOGIN);
      setIsLoginModalOpen(true);
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <div className="flex items-center gap-6 mt-6 border-t border-gray-200 pt-6">
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleVote("like")}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all cursor-pointer disabled:opacity-50 ${
          isLiked
            ? "bg-danger/10 text-danger"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {isLiked ? (
          <FaHeart className="text-lg" />
        ) : (
          <FaRegHeart className="text-lg" />
        )}
        <span>{likes}</span>
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={() => handleVote("dislike")}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all cursor-pointer disabled:opacity-50 ${
          isDisliked
            ? "bg-danger/10 text-danger"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {isDisliked ? (
          <BiSolidDislike className="text-lg" />
        ) : (
          <BiDislike className="text-lg" />
        )}
        <span>{dislikes}</span>
      </button>

      <button
        onClick={handleOpenListModal}
        type="button"
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium transition-all hover:bg-gray-200 cursor-pointer ml-auto md:ml-0"
      >
        <MdOutlineBookmarkAdd className="text-lg" />
        <span className="hidden sm:inline">Listeme Ekle</span>
      </button>

      <SaveToMyListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movieId={movie.id}
        movieName={movie.movieName}
      />

      <AuthModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        view={authView}
        setView={setAuthView}
      />
    </div>
  );
}
