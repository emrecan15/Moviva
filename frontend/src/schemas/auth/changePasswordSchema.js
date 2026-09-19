import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifre zorunludur."),

    newPassword: z
      .string()
      .min(1, "Yeni şifre zorunludur.")
      .min(8, "Şifre 8 ile 64 karakter arasında olmalı.")
      .max(64, "Şifre 8 ile 64 karakter arasında olmalı.")
      .regex(/[a-zçğıöşüi]/, "Şifre en az bir küçük harf içermeli.")
      .regex(/[A-ZÇĞİÖŞÜİ]/, "Şifre en az bir büyük harf içermeli.")
      .regex(/\d/, "Şifre en az bir rakam içermeli.")
      .regex(/[\W_]/, "Şifre en az bir özel karakter içermeli."),

    newPasswordConfirm: z.string().min(1, "Şifre tekrarı zorunludur."),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "Yeni şifreler eşleşmiyor.",
    path: ["newPasswordConfirm"],
  });
