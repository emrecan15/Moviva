"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    router.push(`/arama?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-danger" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Film Ara..."
        className="bg-white rounded-full border border-danger px-4 pl-8 h-10 w-64 focus:border-search-border-focus focus:outline-hidden focus:ring-1 focus:ring-danger"
      />
    </form>
  );
}
