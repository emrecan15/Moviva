"use client";

import { useState, useTransition } from "react";
import AuthInput from "@/components/auth/components/AuthInput";
import { resetPasswordConfirmAction } from "@/actions/authActions";

export default function ResetPasswordForm({ token }) {
  const [formData, setFormData] = useState({
    newPassword: "",
    newPasswordConfirm: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Geçersiz şifre sıfırlama bağlantısı.");
      return;
    }

    if (formData.newPassword !== formData.newPasswordConfirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    startTransition(async () => {
      const result = await resetPasswordConfirmAction({
        token,
        newPassword: formData.newPassword,
        newPasswordConfirm: formData.newPasswordConfirm,
      });

      if (result.success) {
        setSuccess(result.message);

        setFormData({
          newPassword: "",
          newPasswordConfirm: "",
        });
      } else {
        setError(result.error || "Şifre sıfırlama sırasında bir hata oluştu.");
      }
    });
  };

  if (!token) {
    return (
      <p className="text-center text-sm text-danger">
        Geçersiz şifre sıfırlama bağlantısı.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <AuthInput
        label="Yeni Şifre"
        placeholder="Yeni şifrenizi girin"
        type="password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleChange}
      />

      <AuthInput
        label="Şifre Tekrar"
        placeholder="Yeni şifrenizi tekrar girin"
        type="password"
        name="newPasswordConfirm"
        value={formData.newPasswordConfirm}
        onChange={handleChange}
      />

      <div className="mt-1 rounded-xl bg-gray-50 px-4 py-3">
        <p className="text-xs font-medium text-gray-600">
          Şifreniz en az 8 karakter olmalı ve büyük harf, küçük harf, rakam ve
          özel karakter içermelidir.
        </p>
      </div>

      <button
        type="submit"
        disabled={
          isPending || !formData.newPassword || !formData.newPasswordConfirm
        }
        className="mt-2 h-11 w-full cursor-pointer rounded-full border border-danger text-sm font-semibold text-danger transition-all duration-200 hover:bg-danger hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Şifreniz Güncelleniyor..." : "Şifreyi Güncelle"}
      </button>

      {error && <p className="text-sm text-danger">{error}</p>}

      {success && <p className="text-sm text-green-600">{success}</p>}
    </form>
  );
}
