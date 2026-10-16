import { db } from "@/app";
import { PostType } from "@/types/model.types";

// export const getAllPostsToAproveService = async (): Promise<
//   PostType[] | null
// > => {
//   return await db.post.findMany({
//     where: {
//       is_accepted: false,
//     },
//     include: {
//       user: true,
//     },
//   });
// };

export const getAllPostsToAproveService = async (): Promise<
  PostType[] | null
> => {
  const posts = await db.$queryRaw<PostType[]>`
    SELECT 
      p.*,
      json_build_object(
        'id', u.id,
        'name', u.name
      ) as user
    FROM "Post" p
    JOIN "User" u ON p."userId" = u."id"
    WHERE p."is_accepted" = false AND p."rejectedAt" IS NULL
    ORDER BY p."createdAt" ASC;
  `;

  return posts.length > 0 ? posts : [];
};
