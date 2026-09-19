"use client";

import { useState } from "react";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import AuthModal from "../auth/components/AuthModal";
import authBg from "@/assets/images/backgrounds/auth-bg.png";
import { AUTH_VIEW } from "../auth/constants/auth";
import GlobalModals from "../ui/GlobalModals";
import ToastProvider from "../ui/ToastProvider";

export default function ClientLayout({ children, auth }) {
  const [showAuth, setShowAuth] = useState(false);
  const [view, setView] = useState(AUTH_VIEW.LOGIN);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onLoginClick={() => setShowAuth(true)}
        setView={setView}
        auth={auth}
      />

      <main
        className="flex-1 flex flex-col"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255, 255, 255, 0.70),
              rgba(255, 255, 255, 0.70)
            ),
            url(${authBg.src}) 
          `,
        }}
      >
        {children}
      </main>

      <Footer />

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        view={view}
        setView={setView}
      />
      <GlobalModals />

      <ToastProvider />
    </div>
  );
}
