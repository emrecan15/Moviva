import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Kullanıcı adı en az 3 karakter uzunluğunda olmalıdır.")
      .max(15, "Kullanıcı adı en fazla 15 karakter uzunluğunda olabilir.")
      .regex(
        /^[A-Za-zÇĞİÖŞÜçğıöşüı0-9_.]+$/,
        "Kullanıcı adı sadece harf, rakam, nokta ve alt çizgi içerebilir.",
      ),

    email: z
      .email("Geçerli bir e-posta adresi girin.")
      .max(254, "E-posta en fazla 254 karakter olabilir."),

    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır.")
      .max(64, "Şifre en fazla 64 karakter olabilir.")
      .regex(/[a-zçğıöşüi]/, "Şifre en az bir küçük harf içermeli.")
      .regex(/[A-ZÇĞİÖŞÜİ]/, "Şifre en az bir büyük harf içermeli.")
      .regex(/\d/, "Şifre en az bir rakam içermeli.")
      .regex(/[\W_]/, "Şifre en az bir özel karakter içermeli."),

    passwordConfirm: z.string().min(1, "Şifre tekrarı boş olamaz."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Şifreler eşleşmiyor.",
    path: ["passwordConfirm"],
  });
