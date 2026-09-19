"use client";

import RecommendMovieModal from "@/components/movie/recommendation/RecommendMovieModal";

import { useUI } from "@/components/context/UIContext";

export default function GlobalModals() {
  const { isRecommendModalOpen, closeRecommendModal } = useUI();

  return (
    <>
      <RecommendMovieModal
        isOpen={isRecommendModalOpen}
        onClose={closeRecommendModal}
      />
    </>
  );
}
