import { Type_post_enum } from "@prisma/client";
import { z } from "zod";

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  is_accepted: z.boolean(),
  picture: z.string().nullish(),
  post_type: z.nativeEnum(Type_post_enum).nullish(),
  userId: z.string(),
  createdAt: z.date(),
  deletedAt: z.date().nullish(),
});

export const postRegisterSchema = postSchema.omit({
  id: true,
  is_accepted: true,
  createdAt: true,
  deletedAt: true,
});
export const putPostSchema = postSchema
  .omit({
    id: true,
    is_accepted: true,
    createdAt: true,
    deletedAt: true,
  })
  .partial();

export const putAcceptPostSchema = postSchema.omit({
  id: true,
  title: true,
  description: true,
  picture: true,
  post_type: true,
  userId: true,
  createdAt: true,
  deletedAt: true,
});

// Query string do feed: GET /posts?page=1&limit=10&search=lua&type=EVENTO
export const feedQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
  type: z
    .union([z.nativeEnum(Type_post_enum), z.literal("")])
    .optional()
    .transform((value) => value || undefined),
});

export const rejectPostSchema = z.object({
  reason: z.string().trim().min(3, "Explique o motivo da recusa").max(500),
});
