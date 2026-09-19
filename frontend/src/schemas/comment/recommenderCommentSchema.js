import z from "zod";

export const recommendationSchema = z.object({
  recommenderComment: z
    .string({
      required_error: "Öneri yazısı zorunludur.",
      invalid_type_error: "Öneri yazısı metin formatında olmalıdır",
    })
    .trim()
    .min(10, {
      message: "Öneri yazısı en az 10 karakter uzunluğunda olmalıdır.",
    })
    .max(2000, {
      message: "Öneri yazısı en fazla 2000 karakter uzunluğunda olabilir.",
    }),
});
