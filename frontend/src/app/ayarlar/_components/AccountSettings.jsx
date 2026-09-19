"use client";
import { updateAccountAction } from "@/actions/authActions";
import AuthInput from "@/components/auth/components/AuthInput";
import { updateAccountSchema } from "@/schemas/auth/updateAccountSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import SaveButton from "./SaveButton";
import SettingsCard from "./SettingsCard";
import { FiEdit3, FiX } from "react-icons/fi";

export default function AccountSettings({ user }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateAccountSchema),

    values: {
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  });

  const onSubmit = (data) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await updateAccountAction({
        username: data.username,
        bio: data.bio,
      });

      if (result.success) {
        setSuccess(result.message || "Bilgileriniz güncellendi.");
        setIsEditing(false);
      } else {
        setError(
          result.error || "Güncelleme sırasında bir hata meydana geldi.",
        );
      }
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setSuccess("");
    reset();
  };

  return (
    <SettingsCard
      title="Hesap Bilgileri"
      description="Profil bilgilerinizde değişiklik yapın."
    >
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div className="grid gap-5 sm:grid-cols-2">
          <AuthInput
            label="Kullanıcı Adı"
            type="text"
            disabled={!isEditing}
            error={errors.username?.message}
            {...register("username")}
          />

          <AuthInput
            label="E-posta"
            type="email"
            disabled={true}
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Hakkında
          </label>
          <textarea
            rows="4"
            disabled={!isEditing}
            {...register("bio")}
            className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-1 disabled:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed disabled:text-gray-500 ${
              errors.bio
                ? "border-danger focus:border-danger focus:ring-danger"
                : "border-gray-200 focus:border-danger focus:ring-danger"
            }`}
          />
          {errors.bio && (
            <p className="mt-1 text-xs text-danger">{errors.bio.message}</p>
          )}
        </div>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}
        {success && <p className="mt-4 text-sm text-green-600">{success}</p>}

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setSuccess("");
              }}
              className="flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
            >
              <FiEdit3 />
              Bilgileri Düzenle
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 ">
              <button
                type="button"
                onClick={handleCancel}
                className="flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <FiX />
                İptal
              </button>
              <SaveButton text="Değişiklikleri Kaydet" loading={isPending} />
            </div>
          )}
        </div>
      </form>
    </SettingsCard>
  );

  function onInvalid() {
    setError("");
    setSuccess("");
  }
}
