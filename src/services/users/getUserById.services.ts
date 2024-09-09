import { db } from "@/app";
import { AppError } from "@/error";
import { userWithoutPasswordSchema } from "@/schemas/user.schemas";
import { userWithoutPassword } from "@/types/user.types";
import { User } from "@prisma/client";

// const getUserByIdService = async(id: string):Promise<userWithoutPassword> => {

//     const user: User | null = await db.user.findUnique({
//         where:{
//             id:id
//         },
//         include: {
//           astronomers:true
//         }
//     })

//     const userWithoutPassword = userWithoutPasswordSchema.parse(user)

//     return userWithoutPassword
// }

// export {getUserByIdService}

const getUserByIdService = async (id: string): Promise<userWithoutPassword> => {
  const users = await db.$queryRaw<User[]>`
      SELECT "u".*, 
           json_agg("a".*) AS "astronomers"
    FROM "User" AS "u"
    LEFT JOIN "User_astronomers" AS "ua" ON "u"."id" = "ua"."userId"
    LEFT JOIN "Astronomer" AS "a" ON "ua"."astronomerId" = "a"."id"
    WHERE "u"."id" = ${id}
    GROUP BY "u"."id"
    LIMIT 1;
  `;

  if (users.length === 0) {
    throw new AppError("User not found", 404);
  }

  const user = users[0]; // Extraindo o primeiro (e único) usuário do array

  // Validação e parsing usando o schema `userWithoutPasswordSchema`
  const userWithoutPassword = userWithoutPasswordSchema.parse(user);

  return userWithoutPassword;
};
export { getUserByIdService };
