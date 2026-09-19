import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Geçerli bir e-posta adresi girin.")
    .max(254, "E-posta en fazla 254 karakter olabilir."),

  password: z
    .string()
    .min(1, "Şifre zorunludur.")
    .max(100, "Şifre en fazla 100 karakter olabilir."),
});
