import { db } from "@/app";
import { AppError } from "@/error";
import { Access_level } from "@prisma/client";

export type CurrentUser = {
  id: string;
  name: string;
  access_level: Access_level;
};

// O token guarda o e-mail no "sub"; aqui resolvemos o usuário completo
export const getCurrentUser = async (email: string): Promise<CurrentUser> => {
  const users = await db.$queryRaw<CurrentUser[]>`
    SELECT "id", "name", "access_level"
    FROM "User"
    WHERE "email" = ${email}
    LIMIT 1;
  `;

  if (users.length === 0) {
    throw new AppError("User not found", 401);
  }

  return users[0];
};

export const isAdminUser = (user: CurrentUser) =>
  user.access_level === Access_level.ADMIN;
