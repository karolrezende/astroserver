import { z } from "zod";

export const commentSchema = z.object({
  id: z.string(),
  description: z.string(),
  postId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
});

export const commentSchemaRequest = commentSchema.omit({
  id: true,
  createdAt: true,
});

export const commentUpdateSchema = z.object({
  description: z.string().trim().min(1, "O comentário não pode ficar vazio"),
});
