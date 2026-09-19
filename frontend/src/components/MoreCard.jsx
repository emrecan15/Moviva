import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

export default function MoreCard({ href = "" }) {
  return (
    <Link
      href={href}
      className="
        group
        flex flex-col
        w-full h-full
        items-center
        justify-center
        rounded-xl
        border
        border-white/10
        bg-surface
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-danger
      "
    >
      <div className="flex h-full flex-col items-center justify-center gap-5">
        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            bg-danger
            text-2xl
            text-white
            transition-transform
            group-hover:translate-x-1
          "
        >
          <FaArrowRight />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold">Daha Fazlası</h3>

          <p className="mt-2 text-sm text-text-secondary">
            Tüm filmleri keşfet
          </p>
        </div>
      </div>
    </Link>
  );
}
