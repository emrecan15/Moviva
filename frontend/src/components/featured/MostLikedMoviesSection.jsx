import AnimatedCard from "../animations/AnimatedCard";
import MoreCard from "../MoreCard";
import MovieGrid from "../movie/MovieGrid";
export default function MostLikedMoviesSection({ movies, isLoggedIn = false }) {
  return (
    <section className="w-full">
      <div className="flex flex-col max-w-7xl mx-auto gap-4 p-2">
        <span className="text-xl text-logo font-semibold font-serif p-2 ">
          En Çok Beğenilenler
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 p-2">
          <MovieGrid movies={movies} isLoggedIn={isLoggedIn} />
          <AnimatedCard index={movies.length}>
            <MoreCard href={"/en-cok-begenilenler"} />
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
}
