import { db } from "@/app";
import { AppError } from "@/error";
import { postType, putPostType } from "@/types/post.types";

export const putPostService = async (
  id: string,
  reqBody: putPostType
): Promise<postType> => {
  // Editar um post recusado o devolve para a fila de aprovação
  const post = await db.$queryRaw<postType[]>`
    UPDATE "Post"
    SET "title" = ${reqBody.title},
        "description" = ${reqBody.description},
        "rejectedAt" = NULL,
        "rejection_reason" = NULL
    WHERE "id" = ${id}
    RETURNING *;
  `;

  if (!post || post.length === 0) {
    throw new AppError("Post not found", 404);
  }

  return post[0];
};
