"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { AUTH_VIEW } from "../constants/auth";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import authBg from "../../../assets/images/backgrounds/auth-bg.png";

export default function AuthModal({ open, onClose, view, setView }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 px-2"
      onMouseDown={onClose}
    >
      <div
        className="mx-4 w-full max-w-105 rounded-xl bg-cardbg p-8"
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255, 255, 255, 0.70),
              rgba(255, 255, 255, 0.70)
            ),
            url(${authBg.src || authBg}) 
          `,
        }}
      >
        {view === AUTH_VIEW.LOGIN && (
          <LoginForm setView={setView} onClose={onClose} />
        )}

        {view === AUTH_VIEW.REGISTER && (
          <RegisterForm setView={setView} onClose={onClose} />
        )}

        {view === AUTH_VIEW.FORGOT && (
          <ForgotPasswordForm setView={setView} onClose={onClose} />
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
