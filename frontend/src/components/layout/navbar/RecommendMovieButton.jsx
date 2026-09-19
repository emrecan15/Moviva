import { IoMdAdd } from "react-icons/io";

export default function RecommendMovieButton({ onClick }) {
  return (
    <button
      className="flex items-center justify-center gap-1 w-28 h-10 rounded-full bg-danger text-white p-1 cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_rgba(184,67,31,0.3)] hover:-translate-y-0.5"
      onClick={onClick}
    >
      <IoMdAdd />
      <span>Film Öner</span>
    </button>
  );
}
