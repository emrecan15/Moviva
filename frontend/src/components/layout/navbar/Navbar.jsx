"use client";

import { useState } from "react";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import MobileMenu from "./MobileMenu";

export default function Navbar({ onLoginClick, setView, auth }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="flex sticky z-50 top-0 w-full h-16 bg-navbarbg/80 backdrop-blur-md border-b-gray-100 ">
      <DesktopNavbar
        onLoginClick={onLoginClick}
        setView={setView}
        auth={auth}
      />
      <MobileNavbar onToggleMenu={() => setIsMenuOpen((prev) => !prev)} />
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onLoginClick={onLoginClick}
        setView={setView}
        auth={auth}
      />
    </nav>
  );
}
