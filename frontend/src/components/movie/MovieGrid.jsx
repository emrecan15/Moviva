import Link from "next/link";
import MovieCard from "./MovieCard";
import AnimatedCard from "../animations/AnimatedCard";

export default function MovieGrid({ movies, isLoggedIn }) {
  return movies.map((movie, index) => (
    <AnimatedCard key={movie.id} index={index}>
      <MovieCard movie={movie} isLoggedIn={isLoggedIn} />
    </AnimatedCard>
  ));
}
