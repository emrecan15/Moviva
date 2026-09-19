"use client";

import AuthInput from "@/components/auth/components/AuthInput";
import { changePasswordSchema } from "@/schemas/auth/changePasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import SaveButton from "./SaveButton";
import SettingsCard from "./SettingsCard";

export default function SecuritySettings() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),

    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const onSubmit = (data) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await changePasswordAction({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (result.success) {
        setSuccess(result.message || "Şifreniz başarıyla güncellendi.");

        reset();
      } else {
        setError(
          result.error || "Şifre değiştirme işleminde bir hata meydana geldi.",
        );
      }
    });
  };

  const onInvalid = () => {
    setError("");
    setSuccess("");
  };

  return (
    <SettingsCard
      title="Güvenlik"
      description="Şifrenizi ve hesap güvenliğinizi yönetin."
    >
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div className="space-y-5">
          <AuthInput
            label="Mevcut Şifre"
            type="password"
            placeholder="Mevcut şifrenizi girin"
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />

          <AuthInput
            label="Yeni Şifre"
            type="password"
            placeholder="Yeni şifrenizi girin"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />

          <AuthInput
            label="Yeni Şifre Tekrar"
            type="password"
            placeholder="Yeni şifrenizi tekrar girin"
            error={errors.newPasswordConfirm?.message}
            {...register("newPasswordConfirm")}
          />
        </div>

        <div className="mt-4 rounded-xl bg-gray-50 p-4">
          <p className="text-xs leading-5 text-gray-500">
            Şifreniz en az 8 karakter olmalı ve büyük harf, küçük harf, rakam ve
            özel karakter içermelidir.
          </p>
        </div>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        {success && <p className="mt-4 text-sm text-green-600">{success}</p>}

        <SaveButton text="Şifreyi Güncelle" loading={isPending} />
      </form>
    </SettingsCard>
  );
}
