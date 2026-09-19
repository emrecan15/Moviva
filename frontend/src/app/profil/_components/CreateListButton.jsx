"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import CreateListModal from "@/components/list/CreateListModal";

export default function CreateListButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        type="button"
        className="flex h-9 items-center gap-2 rounded-full bg-danger px-4 text-sm font-semibold text-white transition-colors hover:bg-danger/90 cursor-pointer"
      >
        <FiPlus />
        <span className="hidden sm:inline">Yeni Liste</span>
      </button>

      <CreateListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </>
  );
}
