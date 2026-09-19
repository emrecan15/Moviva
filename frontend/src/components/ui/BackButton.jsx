"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function BackButton({ fallbackHref = "/" }) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <Button
      text="Geri Dön"
      className="text-danger"
      icon={<IoMdArrowRoundBack />}
      onClick={handleBack}
    />
  );
}
