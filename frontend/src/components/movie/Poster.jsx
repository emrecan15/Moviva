export default function Poster({ poster_path, title, className = "" }) {
  return (
    <img
      src={`https://image.tmdb.org/t/p/w500${poster_path}`}
      alt={title}
      className={`aspect-2/3 object-cover ${className}`}
    />
  );
}
