import { db } from "@/app";
import { Prisma, Type_post_enum } from "@prisma/client";

export type FeedFilters = {
  page: number;
  limit: number;
  search?: string;
  type?: Type_post_enum;
};

export type FeedPage<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export const getAllPostService = async (
  filters: FeedFilters,
  viewerId: string
): Promise<FeedPage<unknown>> => {
  const { page, limit, search, type } = filters;
  const offset = (page - 1) * limit;

  // Busca no título, na descrição e no nome do autor
  const searchFilter = search
    ? Prisma.sql`AND (
        p.title ILIKE ${`%${search}%`}
        OR p.description ILIKE ${`%${search}%`}
        OR u.name ILIKE ${`%${search}%`}
      )`
    : Prisma.empty;

  const typeFilter = type
    ? Prisma.sql`AND p.post_type = ${type}::"Type_post_enum"`
    : Prisma.empty;

  const where = Prisma.sql`
    WHERE p.is_accepted = true
    ${searchFilter}
    ${typeFilter}
  `;

  const [{ total }] = await db.$queryRaw<{ total: number }[]>`
    SELECT count(*)::int AS total
    FROM "Post" p
    JOIN "User" u ON u.id = p."userId"
    ${where};
  `;

  const items = await db.$queryRaw<unknown[]>`
    SELECT
      p.id,
      p.title,
      p.description,
      p.is_accepted,
      p.picture,
      p.post_type,
      p."userId",
      p."createdAt",
      json_build_object(
        'id', u.id,
        'name', u.name
      ) as user,
      (SELECT count(*)::int FROM "Like" l WHERE l."postId" = p.id) as "likesCount",
      EXISTS (
        SELECT 1 FROM "Like" l WHERE l."postId" = p.id AND l."userId" = ${viewerId}
      ) as "likedByMe",
      (
        SELECT json_agg(
          json_build_object(
            'id', c.id,
            'description', c.description,
            'user', json_build_object(
              'id', uc.id,
              'name', uc.name
            ),
            'createdAt', c."createdAt",
            'updatedAt', c."updatedAt"
          )
          ORDER BY c."createdAt"
        )
        FROM "Comment" c
        JOIN "User" uc ON uc.id = c."userId"
        WHERE c."postId" = p.id
      ) as comments
    FROM "Post" p
    JOIN "User" u ON u.id = p."userId"
    ${where}
    ORDER BY p."createdAt" DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

  return {
    items,
    total,
    page,
    limit,
    hasMore: offset + items.length < total,
  };
};
