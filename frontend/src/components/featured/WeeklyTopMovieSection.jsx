"use client";
import MovieCard from "../movie/MovieCard";
import { BsTrophyFill } from "react-icons/bs";
import Rating from "../movie/Rating";
import Button from "../ui/Button";
import Poster from "../movie/Poster";
import Genres from "../movie/Genres";
import Avatar from "../ui/Avatar";
import Link from "next/link";

import { motion } from "framer-motion";

export default function WeeklyTopMovieSection({ movies }) {
if (!movies || movies.length === 0) {
    return null;
  }
  const movie = movies[0];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.4,
        ease: "easeOut",
      }}
      className="
        w-[calc(100%-2rem)]
        max-w-7xl
        mx-auto
        mt-8

        flex
        flex-col-reverse
        gap-2
        rounded-2xl
        border
        border-navbarbg
        bg-white
        p-5
        shadow-md
        transition-all
        duration-300
        hover:border-danger
        hover:shadow-2xl

        md:flex-row
        md:items-center
        md:justify-between
        md:gap-6

        cursor-pointer
      "
    >
      <Link href={`/film-detay/${movie.id}`} className="contents">
        <LeftSection movie={movie} />
        <RightSection movie={movie} />
      </Link>
    </motion.section>
  );
}

function LeftSection({ movie }) {
  const genres = movie.genres;
  return (
    <div className="flex flex-1 min-w-0 flex-col text-center md:text-left gap-2 p-4">
      <div className="flex gap-1 text-sm text-gray-600 items-center mb-2 justify-center md:justify-start">
        <BsTrophyFill className="text-xl text-yellow-500" />
        <span className="text-danger font-sans">
          Haftanın En Beğenilen Filmi
        </span>
      </div>
      <div className="flex flex-col justify-center gap-4 items-center md:items-start">
        <span className="flex items-center text-3xl font-bold gap-2">
          {movie.movieName}
          <span className="text-xl text-gray-400 font-medium">
            {movie.year}
          </span>
        </span>

        <div className="flex gap-2 items-center">
          <Rating movie={movie} />
          <Genres genres={movie.genres} className="text-sm" />
        </div>

        <div className="flex items-center justify-center gap-2 md:justify-start">
          <Avatar name={movie.recommendedBy.username} className="w-8 h-8" />
          <span>{movie.recommendedBy.username}</span>
        </div>
        <p className="text-sm text-gray-400 max-w-sm line-clamp-3">
          "{movie.recommenderComment}"
        </p>

        <span className="flex items-center gap-2 px-6 h-10 rounded-full border border-danger font-semibold cursor-pointer transition-all duration-300 hover:bg-danger hover:text-white">
          Filmi Keşfet
        </span>
      </div>
    </div>
  );
}

function RightSection({ movie }) {
  return (
    <div className="mx-auto shrink-0 md:mx-0">
      <Poster
        poster_path={movie.posterUrl}
        title={movie.movieName}
        className="w-52 rounded-2xl shadow-lg"
      />
    </div>
  );
}
