"use client";

import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPage }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPage) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <nav className="flex w-full justify-center items-center mx-auto rounded-full p-2">
      <div className="flex justify-center mx-auto gap-2 py-2 px-6 rounded-full">
        <PaginationButton
          text={<GrLinkPrevious />}
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        />

        {Array.from({ length: totalPage }, (_, index) => {
          const pageNumber = index + 1;

          return (
            <PaginationButton
              key={pageNumber}
              text={pageNumber}
              isActive={page === pageNumber}
              onClick={() => handlePageChange(pageNumber)}
            />
          );
        })}

        <PaginationButton
          text={<GrLinkNext />}
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPage}
        />
      </div>
    </nav>
  );
}

function PaginationButton({
  text = "",
  isActive = false,
  onClick,
  disabled = false,
}) {
  return (
    <button
      className={`
        flex justify-center items-center
        w-7 md:w-9 lg:w-10 h-7 md:h-9 lg:h-10
        border border-logo
        rounded-xl
        cursor-pointer
        transition duration-150
        ${
          isActive
            ? "bg-danger/70 text-white cursor-default"
            : disabled
              ? "bg-cardbg opacity-50 cursor-not-allowed"
              : "bg-cardbg hover:bg-danger/15"
        }
      `}
      disabled={isActive || disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
