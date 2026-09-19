import SearchBar from "./SearchBar";
import AuthSection from "./AuthSection";
import RecommendMovieButton from "./RecommendMovieButton";
import Logo from "../../ui/Logo";
import { navbarLinks } from "./navbarLinks";
import NavLinks from "./NavLinks";
import { useUI } from "@/components/context/UIContext";

export default function DesktopNavbar({ onLoginClick, setView, auth }) {
  return (
    <div className="hidden lg:flex max-w-7xl w-full mx-auto px-4 justify-between items-center">
      <LeftSection />
      <RightSection auth={auth} onLoginClick={onLoginClick} setView={setView} />
    </div>
  );
}

function LeftSection() {
  return (
    <div className="flex shrink-0 gap-10">
      <Logo />
      <NavLinks links={navbarLinks} />
    </div>
  );
}

function RightSection({ auth, onLoginClick, setView }) {
  const isAuthenticated = auth?.authenticated ?? false;
  const { openRecommendModal } = useUI();

  return (
    <div className="flex items-center justify-center gap-4">
      {isAuthenticated && <RecommendMovieButton onClick={openRecommendModal} />}
      <SearchBar />
      <AuthSection auth={auth} onLoginClick={onLoginClick} setView={setView} />
    </div>
  );
}
