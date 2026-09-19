import { FaStar } from "react-icons/fa";

export default function Rating({ movie, className = "" }) {
  let rawRating = movie?.voteAverage;

  if (typeof rawRating === "string") {
    rawRating = rawRating.replace(",", ".");
  }

  let parsedNumber = Number(rawRating);

  if (isNaN(parsedNumber)) {
    parsedNumber = 0;
  }

  const formattedRating = parsedNumber.toFixed(1);

  return (
    <span
      className={`flex justify-center items-center gap-2 bg-logo/77 px-3 py-1.5 rounded-full text-[11px] font-medium text-rating ${className}`}
    >
      <FaStar />
      <span>{formattedRating}</span>
    </span>
  );
}
