"use client";

import { AUTH_VIEW } from "../constants/auth";
import AuthInput from "./AuthInput";
import { SlClose } from "react-icons/sl";
import { AiOutlineMail } from "react-icons/ai";
import Logo from "../../ui/Logo";
import { useState, useTransition } from "react";
import { resetPasswordAction } from "@/actions/authActions";

export default function ForgotPasswordForm({ setView, onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await resetPasswordAction({ email });

      if (result.success) {
        setSuccess(result.message);
      } else {
        setError(result.error || "Şifre sıfırlama isteği gönderilemedi.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full items-center justify-between">
        <Logo />

        <button
          type="button"
          onClick={onClose}
          className="h-8 w-8 cursor-pointer rounded-full text-3xl transition-all duration-150 hover:text-danger"
        >
          <SlClose />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 rounded-2xl border border-gray-50 bg-white p-4 shadow-sm shadow-amber-800"
      >
        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-center rounded-2xl gap-2">
            <span className="flex py-2 font-sans text-xl font-semibold text-logo">
              Şifremi Unuttum
            </span>
          </div>

          <p className="px-2 text-center text-sm leading-5 text-gray-500">
            Şifrenizi sıfırlamak için hesabınıza kayıtlı e-posta adresinizi
            girin.
          </p>

          <AuthInput
            label="E-posta"
            placeholder="E-posta adresinizi girin"
            type="email"
            icon={AiOutlineMail}
            name="email"
            value={email}
            onChange={handleChange}
          />

          {error && <p className="px-2 text-sm text-danger">{error}</p>}

          {success && <p className="px-2 text-sm text-green-600">{success}</p>}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isPending || !email}
              className="mt-3 h-10 w-36 cursor-pointer rounded-full border border-black text-sm font-semibold transition-all duration-150 hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "E-posta gönderiliyor..." : "E-posta Gönder"}
            </button>
          </div>

          <div className="my-2 h-px w-full bg-gray-300"></div>

          <div className="flex items-center justify-center gap-1 font-sans text-sm">
            <span className="text-gray-500">Şifrenizi hatırladınız mı?</span>

            <button
              type="button"
              onClick={() => setView(AUTH_VIEW.LOGIN)}
              className="cursor-pointer font-semibold text-logo transition-colors duration-150 hover:text-danger"
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
