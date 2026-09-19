import { notFound } from "next/navigation";
import Avatar from "../../../components/ui/Avatar";
import Poster from "../../../components/movie/Poster";
import Rating from "../../../components/movie/Rating";
import Genres from "../../../components/movie/Genres";
import { getMovieDetails } from "@/lib/movieService";
import BackButton from "@/components/ui/BackButton";
import FilmActions from "@/components/movie/FilmActions";
import CommentForm from "@/components/movie/CommentForm";
import Reveal from "@/components/animations/Reveal";
import { getAuthStatus } from "@/lib/auth";
import UserTag from "@/components/ui/UserTag";
import MovieBackdrop from "./_components/MovieBackdrop";
import AnimatedSection from "./_components/AnimatedSection";
import CommentItem from "@/components/movie/CommentItem";
import RecommenderItem from "./_components/RecommenderItem";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  let movie = null;

  try {
    movie = await getMovieDetails(resolvedParams.id);
  } catch {
    return {
      title: "Film Detayları",
    };
  }

  if (!movie || movie.error || movie.message === "Not Found") {
    return {
      title: "Film Bulunamadı",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${movie.movieName} (${movie.year}) Konusu, Oyuncuları ve İncelemesi`;
  const description =
    movie.description && movie.description.trim().length > 0
      ? movie.description.slice(0, 155) + "..."
      : `${movie.movieName} filminin konusu, yönetmeni, kullanıcı yorumları ve benzer film tavsiyeleri Moviva'da.`;

  const genreNames = Array.isArray(movie.genres)
    ? movie.genres.map((g) => (typeof g === "object" ? g.name : g))
    : [];

  const posterImage = movie.posterUrl || "/og-default.jpg";

  return {
    title,
    description,
    keywords: [
      movie.movieName,
      movie.originalTitle,
      `${movie.movieName} izle`,
      `${movie.movieName} konusu`,
      `${movie.movieName} benzeri filmler`,
      movie.director,
      ...genreNames,
      "film önerileri",
    ].filter(Boolean),
    alternates: {
      canonical: `/movies/${resolvedParams.id}`,
    },
    openGraph: {
      title,
      description,
      type: "video.movie",
      url: `/movies/${resolvedParams.id}`,
      siteName: "Moviva",
      images: [
        {
          url: posterImage,
          width: 800,
          height: 1200,
          alt: `${movie.movieName} Afişi`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [posterImage],
    },
  };
}

export default async function MovieDetails({ params }) {
  const resolvedParams = await params;

  let movie;
  let authStatus;

  try {
    const [fetchedMovie, fetchedAuthStatus] = await Promise.all([
      getMovieDetails(resolvedParams.id),
      getAuthStatus(),
    ]);

    movie = fetchedMovie;
    authStatus = fetchedAuthStatus;
  } catch (error) {
    throw new Error(
      "Film detayları yüklenirken sunucu ile bağlantı kurulamadı.",
    );
  }

  if (!movie || movie.error || movie.message === "Not Found") {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.movieName,
    alternateName: movie.originalTitle,
    image: movie.posterUrl,
    description: movie.description,
    dateCreated: movie.year ? `${movie.year}-01-01` : undefined,
    director: movie.director
      ? {
          "@type": "Person",
          name: movie.director,
        }
      : undefined,
    genre: Array.isArray(movie.genres)
      ? movie.genres.map((g) => (typeof g === "object" ? g.name : g))
      : undefined,
    ...(movie.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: movie.rating,
        bestRating: "10",
        ratingCount: movie.ratingCount || movie.comments?.length || 1,
      },
    }),
  };

  return (
    <section className="w-full bg-cardbg flex-1 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative w-full bg-cardbg">
        <MovieBackdrop movie={movie} />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:py-16">
          <div className="w-full">
            <BackButton />
          </div>

          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <Reveal direction="left" delay={0.1} className="w-fit shrink-0">
              <MovieHeroLeftSection movie={movie} />
            </Reveal>

            <Reveal direction="up" delay={0.3} className="w-full">
              <MovieHeroRightSection
                movie={movie}
                isLoggedIn={authStatus?.authenticated ?? false}
              />
            </Reveal>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <Reveal direction="up" delay={0.1}>
          <MovieInfo movie={movie} />
        </Reveal>

        <AnimatedSection>
          <RecommenderItem movie={movie} currentUser={authStatus} />
        </AnimatedSection>

        <Reveal direction="up" delay={0.3}>
          <Comments movie={movie} authStatus={authStatus} />
        </Reveal>
      </div>
    </section>
  );
}

function MovieHeroLeftSection({ movie }) {
  return (
    <div className="flex shrink-0">
      <Poster
        poster_path={movie.posterUrl}
        title={movie.movieName}
        className="w-56 rounded-lg shadow-2xl md:w-72"
      />
    </div>
  );
}

function MovieHeroRightSection({ movie, isLoggedIn }) {
  return (
    <div className="flex w-full flex-col gap-6 py-2 text-gray-900 md:py-8">
      <div className="flex flex-col gap-2 text-center md:text-left">
        <h1 className="font-sans text-4xl font-bold">
          {movie.movieName}{" "}
          <span className="font-normal text-gray-500">({movie.year})</span>
        </h1>

        <div className="flex items-center justify-center gap-4 font-sans text-3xl font-bold md:justify-start">
          <Rating movie={movie} />

          <Genres genres={movie.genres} className="text-sm text-gray-600" />
        </div>
      </div>

      <MovieDescription movie={movie} />

      <FilmActions movie={movie} isLoggedIn={isLoggedIn} />
    </div>
  );
}

function MovieDescription({ movie }) {
  return (
    <div className="mt-4 flex flex-col gap-3 text-center md:text-left">
      {movie.tagline && (
        <span className="text-xl font-bold italic text-gray-500">
          {movie.tagline}
        </span>
      )}

      <span className="mt-2 text-xl font-bold text-gray-900">Özet</span>

      <span className="max-w-4xl font-sans text-base leading-relaxed text-gray-700">
        {movie.description}
      </span>
    </div>
  );
}

function MovieInfo({ movie }) {
  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4">
        <MovieInfoItem label="Orijinal Adı" value={movie.originalTitle} />

        <MovieInfoItem label="Yönetmen" value={movie.director} />

        <MovieInfoItem label="Yıl" value={movie.year} />

        <MovieInfoItem label="Ülke" value={movie.country} />
      </div>
    </div>
  );
}

function MovieInfoItem({ label, value }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-wider text-slogan/70">
        {label}
      </span>

      <span className="truncate text-sm font-semibold text-slogan">
        {value || "-"}
      </span>
    </div>
  );
}

{
  /* 
function RecommenderSection({ movie }) {
  const recommender = movie.recommendedBy;

  if (!recommender) {
    return null;
  }

  return (
    <div className="flex w-full flex-col space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar name={recommender.username} className="h-10 w-10" />

        <span className="font-semibold text-logo">{recommender.username}</span>

        <UserTag tag={recommender.tag} />
      </div>

      <div className="h-px w-full bg-slogan/10" />

      <div className="font-sans text-sm italic leading-relaxed text-gray-600">
        {movie.recommenderComment}
      </div>
    </div>
  );
}
*/
}

function Comments({ movie, authStatus }) {
  const comments = movie.comments || [];

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <span className="text-xl font-bold text-logo/80">
        Yorumlar ({comments.length})
      </span>

      {authStatus?.authenticated && (
        <CommentForm movieId={movie.id} username={authStatus.username} />
      )}

      <div className="flex flex-col gap-4">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <CommentItem
              key={comment.id ?? index}
              comment={comment}
              currentUser={authStatus}
            />
          ))
        ) : (
          <span className="py-4 text-center text-sm text-gray-400">
            Henüz yorum yapılmamış.
          </span>
        )}
      </div>
    </div>
  );
}
{
  /*
function Comment({ name = "", comment = "" }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
      <div className="flex items-center gap-3">
        <Avatar name={name} className="h-8 w-8" />

        <span className="text-sm font-semibold">{name}</span>
      </div>

      <div>
        <span className="font-sans text-sm leading-relaxed text-gray-700">
          {comment}
        </span>
      </div>
    </div>
  );
}
*/
}
