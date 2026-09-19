import z from "zod";

export const commentSchema = z.object({
  comment: z
    .string({
      required_error: "Yorum alanı zorunludur.",
      invalid_type_error: "Yorum metin formatında olmalıdır.",
    })
    .trim()
    .min(2, { message: "Yorum en az 2 karakter olmalıdır." })
    .max(500, { message: "Yorum en fazla 500 karakter olabilir." }),
});
