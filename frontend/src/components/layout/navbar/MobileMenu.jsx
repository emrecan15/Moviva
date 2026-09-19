import RecommendMovieButton from "./RecommendMovieButton";
import SearchBar from "./SearchBar";
import AuthSection from "./AuthSection";
import { navbarLinks } from "./navbarLinks";
import NavLinks from "./NavLinks";
import { useUI } from "@/components/context/UIContext";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MobileMenu({
  isOpen,
  onClose,
  onLoginClick,
  setView,
  auth,
}) {
  const isAuthenticated = auth?.authenticated ?? false;
  const { openRecommendModal } = useUI();
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]);

  const handleRecommendClick = () => {
    openRecommendModal();
    onClose();
  };

  return (
    <div
      className={`lg:hidden flex flex-col items-center absolute top-16 gap-4 p-4 z-50 left-0 w-full bg-navbarbg shadow-lg transition-all duration-300 ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <NavLinks
        links={navbarLinks}
        className="flex flex-col gap-4 items-center"
        onLinkClick={onClose}
      />

      {isAuthenticated && (
        <RecommendMovieButton onClick={handleRecommendClick} />
      )}

      <SearchBar />

      <AuthSection auth={auth} onLoginClick={onLoginClick} setView={setView} />
    </div>
  );
}
