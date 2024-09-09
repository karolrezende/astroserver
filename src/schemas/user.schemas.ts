import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      "Invalid mail"
    ),
  description: z.string().nullish(),
  password: z.string(),
  picture: z.string().nullish(),
  astronomers: z.any(),
  access_level: z.enum(["USER", "ADMIN"]),
  createdAt: z.date(),
  deletedAt: z.date().nullish(),
});

export const userRegisterSchema = userSchema.omit({
  id: true,
  access_level: true,
  createdAt: true,
  deletedAt: true,
});
export const userWithoutPasswordSchema = userSchema.omit({ password: true });

export const userRegisterResponseSchema = userSchema.omit({
  id: true,
  password: true,
  access_level: true,
  createdAt: true,
  deletedAt: true,
});

export const userLoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const userPasswordSchema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z.string(),
  confirmPassword: z.string(),
});
