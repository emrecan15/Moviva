import { z } from "zod";

export const updateAccountSchema = z.object({
  username: z
    .string()
    .min(3, "Kullanıcı adı en az 3 karakter uzunluğunda olmalıdır.")
    .max(15, "Kullanıcı adı en fazla 15 karakter uzunluğunda olabilir.")
    .regex(
      /^[A-Za-zÇĞİÖŞÜçğıöşüı0-9_.]+$/,
      "Kullanıcı adı sadece harf, rakam, nokta ve alt çizgi içerebilir.",
    ),
  bio: z
    .string()
    .max(255, "Hakkında kısmı en fazla 255 karakter olabilir.")
    .optional(),
});
