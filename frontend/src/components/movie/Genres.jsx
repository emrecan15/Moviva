export default function Genres({ genres=[], className = "" }) {
  const genreNames = genres.map((genre) => genre.name ?? genre);

  const visibleGenres = genreNames.slice(0, 3);
  const hiddenCount = genreNames.length - visibleGenres.length;

  return (
    <p className={`truncate text-slogan ${className}`}>
      {visibleGenres.join(" • ")}
      {hiddenCount > 0 && ` • +${hiddenCount}`}
    </p>
  );
}
