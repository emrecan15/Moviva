"use client";

import { AUTH_VIEW } from "../constants/auth";
import AuthInput from "./AuthInput";
import { SlClose } from "react-icons/sl";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import Logo from "../../ui/Logo";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginAction } from "@/actions/authActions";
import { loginSchema } from "@/schemas/auth/loginSchema";

export default function LoginForm({ setView, onClose }) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    setError("");

    startTransition(async () => {
      const result = await loginAction(data);

      if (result.success) {
        onClose();
        router.refresh();
      } else {
        setError(result.error || "E-posta veya şifre hatalı.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full justify-between items-center">
        <Logo />

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full cursor-pointer text-3xl transition-all duration-150 hover:text-danger"
        >
          <SlClose />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 p-4 rounded-2xl bg-white border border-gray-50 shadow-sm shadow-amber-800"
      >
        <div className="flex justify-center w-full rounded-2xl gap-2">
          <span className="text-xl font-semibold flex py-2 text-logo font-sans">
            Giriş Yap
          </span>
        </div>

        {error && (
          <div className="text-danger text-sm text-center font-semibold mb-2">
            {error}
          </div>
        )}

        <AuthInput
          label="E-posta"
          placeholder="E-posta adresinizi girin"
          type="email"
          icon={AiOutlineMail}
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthInput
          label="Şifre"
          placeholder="Şifrenizi girin"
          type="password"
          icon={RiLockPasswordLine}
          error={errors.password?.message}
          {...register("password")}
        />

        <button
          type="button"
          onClick={() => setView(AUTH_VIEW.FORGOT)}
          className="underline text-left font-sans text-sm transition-colors duration-150 hover:text-danger cursor-pointer px-2"
        >
          Şifremi Unuttum
        </button>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-30 h-10 mt-3 float-right rounded-full cursor-pointer border border-black font-semibold hover:border-danger hover:text-danger transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPending}
          >
            {isPending ? "Giriş..." : "Giriş Yap"}
          </button>
        </div>
      </form>

      <div className="h-px w-full gap-4 bg-gray-300"></div>

      <div className="flex items-center justify-center gap-1 text-sm font-sans">
        <span className="text-gray-500">Hesabınız yok mu?</span>

        <button
          type="button"
          onClick={() => setView(AUTH_VIEW.REGISTER)}
          className="font-semibold text-logo transition-colors duration-150 hover:text-danger cursor-pointer"
        >
          Kayıt Ol
        </button>
      </div>
    </div>
  );
}
