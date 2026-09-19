"use client";

import { useState } from "react";
import { AUTH_VIEW } from "../constants/auth";
import AuthInput from "./AuthInput";
import { SlClose } from "react-icons/sl";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import Logo from "../../ui/Logo";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "@/schemas/auth/registerSchema";
import { registerAction } from "@/actions/authActions";
import SuccessBox from "./SuccessBox";

export default function RegisterForm({ setView, onClose }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const handleRegister = async (data) => {
    setError("");

    try {
      const { passwordConfirm, ...registerData } = data;

      const result = await registerAction(registerData);

      if (!result.success) {
        setError(result.error || "Kayıt sırasında bir hata oluştu.");
        return;
      }

      setSuccess(true);

      console.log("Kayıt başarılı:", result.user);
    } catch (error) {
      console.error(error);
      setError("Kayıt sırasında bir hata oluştu.");
    }
  };

  if (success) {
    return <SuccessBox onClose={onClose} />;
  }

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
        onSubmit={handleSubmit(handleRegister)}
        className="flex flex-col gap-2 rounded-2xl border border-gray-50 bg-white p-4 shadow-sm shadow-amber-800"
      >
        <div className="flex w-full justify-center gap-2 rounded-2xl">
          <span className="flex py-2 font-sans text-xl font-semibold text-logo">
            Kayıt Ol
          </span>
        </div>

        {error && <p className="text-center text-sm text-danger">{error}</p>}

        <AuthInput
          {...register("username")}
          label="Kullanıcı Adı"
          placeholder="Kullanıcı adınızı girin"
          type="text"
          icon={FaRegUserCircle}
          error={errors.username?.message}
        />

        <AuthInput
          {...register("email")}
          label="E-posta"
          placeholder="E-posta adresinizi girin"
          type="email"
          icon={AiOutlineMail}
          error={errors.email?.message}
        />

        <AuthInput
          {...register("password")}
          label="Şifre"
          placeholder="Şifrenizi girin"
          type="password"
          icon={RiLockPasswordLine}
          error={errors.password?.message}
        />

        <AuthInput
          {...register("passwordConfirm")}
          label="Şifre Tekrar"
          placeholder="Şifrenizi tekrar girin"
          type="password"
          icon={RiLockPasswordLine}
          error={errors.passwordConfirm?.message}
        />

        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-3 h-10 w-30 cursor-pointer rounded-full border border-black font-semibold transition-all duration-150 hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Kayıt oluyor..." : "Kayıt Ol"}
          </button>
        </div>

        <div className="my-2 h-px w-full bg-gray-300" />

        <div className="flex items-center justify-center gap-1 font-sans text-sm">
          <span className="text-gray-500">Zaten hesabınız var mı?</span>

          <button
            type="button"
            onClick={() => setView(AUTH_VIEW.LOGIN)}
            className="cursor-pointer font-semibold text-logo transition-colors duration-150 hover:text-danger"
          >
            Giriş Yap
          </button>
        </div>
      </form>
    </div>
  );
}
