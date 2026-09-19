"use client";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa6";
import { BiDislike } from "react-icons/bi";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import Rating from "./Rating";
import Poster from "./Poster";
import Genres from "./Genres";
import Avatar from "../ui/Avatar";
import VoteButtons from "./VoteButtons";
import { useState } from "react";
import SaveToMyListModal from "../list/SaveToMyListModal";
import { AUTH_VIEW } from "../auth/constants/auth";
import AuthModal from "../auth/components/AuthModal";

export default function MovieCard({ movie, isLoggedIn }) {
  return (
    <div className="group flex flex-col h-full rounded-3xl overflow-hidden shadow-sm bg-cardbg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_24px_rgba(184,67,31,0.12)]">
      <Link
        href={`/film-detay/${movie.id}`}
        className="flex flex-1 flex-col cursor-pointer"
      >
        <PosterContainer movie={movie} />
        <MovieInfo movie={movie} />
      </Link>

      <div className="px-2 pb-2 mt-auto">
        {/* 1. isLoggedIn prop'unu Actions bileşenine indiriyoruz */}
        <MovieActions movie={movie} isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}

function PosterContainer({ movie }) {
  return (
    <div className="relative overflow-hidden">
      <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
        <Poster poster_path={movie.posterUrl} title={movie.movieName} />
      </div>
      <Rating movie={movie} className="absolute left-2 top-2" />
      <PosterInfo movie={movie} />
    </div>
  );
}

function MovieInfo({ movie }) {
  return (
    <div className="flex flex-1 flex-col justify-center p-2">
      <Genres genres={movie.genres} className="text-[11px]" />
      <RecommendedBy recommendedBy={movie.recommendedBy} />
      <Comment comment={movie.recommenderComment} />
    </div>
  );
}

function RecommendedBy({ recommendedBy }) {
  if (!recommendedBy) return null;

  return (
    <div className="flex items-center gap-2 mt-2">
      <Avatar name={recommendedBy.username} className="w-6 h-6" />
      <span className="text-xs text-gray-600">{recommendedBy.username}</span>
    </div>
  );
}

function Comment({ comment }) {
  if (!comment) return null;
  return <p className="text-xs text-gray-600 my-2 line-clamp-2">"{comment}"</p>;
}

// 2. MovieActions bileşenine isLoggedIn prop'unu ekledik
function MovieActions({ movie, isLoggedIn }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auth Modal State'leri
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authView, setAuthView] = useState(AUTH_VIEW.LOGIN);

  // Listeye Ekle Butonu Kontrolü
  const handleOpenListModal = () => {
    if (!isLoggedIn) {
      setAuthView(AUTH_VIEW.LOGIN);
      setIsLoginModalOpen(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleAuthRequired = () => {
    setAuthView(AUTH_VIEW.LOGIN);
    setIsLoginModalOpen(true);
  };

  return (
    <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
      <VoteButtons
        movie={movie}
        isLoggedIn={isLoggedIn}
        onAuthRequired={handleAuthRequired}
      />

      <AddToListButton onClick={handleOpenListModal} />

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

function AddToListButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="flex items-center gap-1 text-gray-600 hover:text-danger transition-colors duration-200 cursor-pointer"
    >
      <span className="flex items-center justify-center gap-1">
        <MdOutlineBookmarkAdd className="text-sm" />
        <span className="hidden sm:inline text-xs font-medium">
          Listeye Ekle
        </span>
      </span>
    </button>
  );
}

function PosterInfo({ movie }) {
  return (
    <div className="absolute bottom-0 left-0 flex h-14 w-full flex-col justify-end bg-linear-to-t from-black/85 via-black/35 to-transparent p-2">
      <span className="text-[11px] text-white/80">{movie.year}</span>
      <span className="truncate text-sm font-medium text-white">
        {movie.movieName}
      </span>
    </div>
  );
}
