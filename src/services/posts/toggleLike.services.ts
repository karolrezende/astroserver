import { db } from "@/app";
import { AppError } from "@/error";

export const toggleLikeService = async (postId: string, userId: string) => {
  const posts = await db.$queryRaw<{ id: string }[]>`
    SELECT id FROM "Post" WHERE id = ${postId} AND is_accepted = true LIMIT 1;
  `;

  if (posts.length === 0) {
    throw new AppError("Post not found", 404);
  }

  const removed = await db.$executeRaw`
    DELETE FROM "Like" WHERE "postId" = ${postId} AND "userId" = ${userId};
  `;

  if (removed === 0) {
    await db.$executeRaw`
      INSERT INTO "Like" ("userId", "postId") VALUES (${userId}, ${postId});
    `;
  }

  const [{ likesCount }] = await db.$queryRaw<{ likesCount: number }[]>`
    SELECT count(*)::int AS "likesCount" FROM "Like" WHERE "postId" = ${postId};
  `;

  return { liked: removed === 0, likesCount };
};
