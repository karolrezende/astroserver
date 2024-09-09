import { db } from "@/app";
import { AppError } from "@/error";
import { userWithoutPasswordSchema } from "@/schemas/user.schemas";
import { userWithoutPassword } from "@/types/user.types";
import { User } from "@prisma/client";

// export const getUserByTokenService = async (
//   email: string
// )=> {
//   const user= await db.user.findUnique({
//     where: {
//       email: email,
//     },
//     include: {
//       astronomers: true
//     }
//   });

//   if(!user){
//     throw new AppError('User not found', 404)
//   }
//   // const userWithoutPassword = userWithoutPasswordSchema.parse(user);

//   return user;
// };

export const getUserByTokenService = async (
  email: string
): Promise<userWithoutPassword> => {
 const users: User[] = await db.$queryRaw<User[]>`
    SELECT "u".*, 
           json_agg("a".*) AS "astronomers"
    FROM "User" AS "u"
    LEFT JOIN "User_astronomers" AS "ua" ON "u"."id" = "ua"."userId"
    LEFT JOIN "Astronomer" AS "a" ON "ua"."astronomerId" = "a"."id"
    WHERE "u"."email" = ${email}
    GROUP BY "u"."id"
    LIMIT 1;
  `;

  const user = users.length > 0 ? users[0] : null;

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const userWithoutPassword = userWithoutPasswordSchema.parse(user);

  return userWithoutPassword;
};
