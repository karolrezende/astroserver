import { db } from "@/app";

// Todos os posts do usuário, com o status de moderação calculado
export const getMyPostsService = async (userId: string) => {
  return db.$queryRaw<unknown[]>`
    SELECT
      p.id,
      p.title,
      p.description,
      p.post_type,
      p."createdAt",
      p.rejection_reason,
      p."rejectedAt",
      CASE
        WHEN p.is_accepted THEN 'ACCEPTED'
        WHEN p."rejectedAt" IS NOT NULL THEN 'REJECTED'
        ELSE 'PENDING'
      END as status,
      (SELECT count(*)::int FROM "Like" l WHERE l."postId" = p.id) as "likesCount",
      (SELECT count(*)::int FROM "Comment" c WHERE c."postId" = p.id) as "commentsCount"
    FROM "Post" p
    WHERE p."userId" = ${userId}
    ORDER BY p."createdAt" DESC;
  `;
};
