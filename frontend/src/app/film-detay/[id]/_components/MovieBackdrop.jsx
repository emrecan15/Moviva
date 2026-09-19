"use client";

import { motion } from "framer-motion";

export default function MovieBackdrop({ movie }) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <motion.img
        src={`https://image.tmdb.org/t/p/original${movie.backdropUrl}`}
        alt={movie.movieName}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className="h-full w-full object-cover object-top"
      />

      <div className="absolute inset-0 bg-linear-to-r from-cardbg via-cardbg/90 to-transparent" />

      <div className="absolute inset-0 bg-linear-to-t from-cardbg via-cardbg/40 to-transparent" />
    </div>
  );
}
