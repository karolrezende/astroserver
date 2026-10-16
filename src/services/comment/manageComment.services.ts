import { db } from "@/app";
import { AppError } from "@/error";
import { CurrentUser, isAdminUser } from "@/utils/currentUser";
import { Comment } from "@prisma/client";

// Só o autor do comentário ou um admin pode alterá-lo
const ensureCanManageComment = async (id: string, user: CurrentUser) => {
  const comments = await db.$queryRaw<Pick<Comment, "id" | "userId">[]>`
    SELECT "id", "userId" FROM "Comment" WHERE "id" = ${id} LIMIT 1;
  `;

  if (comments.length === 0) {
    throw new AppError("Comment not found", 404);
  }

  if (comments[0].userId !== user.id && !isAdminUser(user)) {
    throw new AppError("Not allowed", 403);
  }
};

export const putCommentService = async (
  id: string,
  description: string,
  user: CurrentUser
): Promise<Comment> => {
  await ensureCanManageComment(id, user);

  const comments = await db.$queryRaw<Comment[]>`
    UPDATE "Comment"
    SET "description" = ${description},
        "updatedAt" = NOW()
    WHERE "id" = ${id}
    RETURNING *;
  `;

  return comments[0];
};

export const deleteCommentService = async (
  id: string,
  user: CurrentUser
): Promise<void> => {
  await ensureCanManageComment(id, user);

  await db.$executeRaw`
    DELETE FROM "Comment" WHERE "id" = ${id};
  `;
};
