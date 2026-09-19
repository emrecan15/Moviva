"use client";

import { AiOutlineGlobal } from "react-icons/ai";
import { motion } from "framer-motion";
import { useState } from "react";

import RecommendMovieButton from "@/components/layout/navbar/RecommendMovieButton";
import AuthModal from "@/components/auth/components/AuthModal";
import { AUTH_VIEW } from "../auth/constants/auth";
import { useUI } from "../context/UIContext";

export default function HeroSection({ auth }) {
  const isAuthenticated = auth?.authenticated ?? false;

  const { openRecommendModal } = useUI();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState(AUTH_VIEW.LOGIN);

  const handleRecommendClick = () => {
    if (!isAuthenticated) {
      setAuthView(AUTH_VIEW.LOGIN);
      setIsAuthModalOpen(true);
      return;
    }

    openRecommendModal();
  };

  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden bg-background">
      <div className="absolute -top-40 left-1/2 -z-10 h-125 w-125 -translate-x-1/2 rounded-full bg-danger/15 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-7xl flex-col items-center justify-center space-y-8 p-4">
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-2 rounded-full border border-danger/20 bg-danger/5 px-4 py-2 text-sm font-medium text-danger"
        >
          <AiOutlineGlobal />
          TOPLULUK DESTEKLİ
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="text-center font-serif text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
        >
          Sinema Severlerin <br />
          <span className="text-danger">Ortak Hafızası</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: "easeOut",
          }}
          className="max-w-2xl text-center font-sans text-xs leading-tight text-slogan md:text-sm lg:text-xl"
        >
          Her film, onu önerenin sesiyle birlikte burada yaşar. Bir filmi
          izledin, izlettirmek istiyorsun — öner.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: "easeOut",
          }}
        >
          <RecommendMovieButton onClick={handleRecommendClick} />
        </motion.div>
      </div>

      {isAuthModalOpen && (
        <AuthModal
          open={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          view={authView}
          setView={setAuthView}
        />
      )}
    </section>
  );
}
