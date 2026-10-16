import { db } from "@/app";
import { AppError } from "@/error";
import { userPassword } from "@/types/user.types";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

// export const passwordUserService = async (
//   data: userPassword
// ): Promise<void> => {
//   const user: User | null = await db.user.findUnique({
//     where: {
//       email: data.email,
//     },
//   });

//   if (!user) {
//     throw new AppError("Usuário não encontrado", 404);
//   }

//   const password = await bcrypt.hash(data.password, 8);

//   await db.user.update({
//     where: {
//       id: user.id,
//     },
//     data: {
//       password: password,
//     },
//   });
// };

// A senha alterada é sempre a do dono do token (tokenEmail) e só muda
// se a senha atual estiver correta.
export const passwordUserService = async (
  tokenEmail: string,
  data: userPassword
): Promise<void> => {
  if (data.email && data.email !== tokenEmail) {
    throw new AppError("Not allowed", 403);
  }

  const users = await db.$queryRaw<User[]>`
    SELECT * FROM "User" WHERE "email" = ${tokenEmail} LIMIT 1;
  `;

  const user = users.length > 0 ? users[0] : null;

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    data.currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    throw new AppError("Senha atual incorreta", 401);
  }

  const hashedPassword = await bcrypt.hash(data.password, 8);

  await db.$executeRaw`
    UPDATE "User" 
    SET "password" = ${hashedPassword} 
    WHERE "id" = ${user.id};
  `;
};
