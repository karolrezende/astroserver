import { db } from "@/app";
import { AppError } from "@/error";
import { CurrentUser } from "@/utils/currentUser";
import { Access_level } from "@prisma/client";

export const getAllUsersAdminService = async () => {
  return db.$queryRaw<unknown[]>`
    SELECT
      u.id,
      u.name,
      u.email,
      u.access_level,
      u."createdAt",
      (SELECT count(*)::int FROM "Post" p WHERE p."userId" = u.id) as "postsCount",
      (SELECT count(*)::int FROM "Comment" c WHERE c."userId" = u.id) as "commentsCount"
    FROM "User" u
    ORDER BY u.access_level ASC, u.name ASC;
  `;
};

const findTarget = async (id: string) => {
  const users = await db.$queryRaw<{ id: string; access_level: Access_level }[]>`
    SELECT "id", "access_level" FROM "User" WHERE "id" = ${id} LIMIT 1;
  `;
  if (users.length === 0) {
    throw new AppError("User not found", 404);
  }
  return users[0];
};

export const putUserRoleService = async (
  id: string,
  accessLevel: Access_level,
  actor: CurrentUser
) => {
  if (id === actor.id) {
    throw new AppError("Você não pode alterar o seu próprio nível de acesso", 400);
  }
  await findTarget(id);

  await db.$executeRaw`
    UPDATE "User"
    SET "access_level" = ${accessLevel}::"Access_level"
    WHERE "id" = ${id};
  `;
};

export const deleteUserAdminService = async (id: string, actor: CurrentUser) => {
  if (id === actor.id) {
    throw new AppError("Use as configurações para excluir o seu próprio perfil", 400);
  }
  const target = await findTarget(id);
  if (target.access_level === Access_level.ADMIN) {
    throw new AppError("Rebaixe o administrador para usuário antes de excluí-lo", 400);
  }

  // Fatos históricos não são apagados junto: passam para o admin que excluiu.
  // Posts, comentários, curtidas e favoritos caem em cascata.
  await db.$transaction([
    db.$executeRaw`UPDATE "PostHistory" SET "userId" = ${actor.id} WHERE "userId" = ${id};`,
    db.$executeRaw`DELETE FROM "User" WHERE "id" = ${id};`,
  ]);
};
