import { db } from "@/app";
import { AppError } from "@/error";

// export async function postUserAstronomerService(userId: string, astronomerId: string) {
//   const verifyUserAstronomer = await db.user_astronomers.findMany({
//     where: {
//       userId: userId
//     }
//   })

//   if(verifyUserAstronomer.length === 3) {
//     throw new AppError('User cannot have more than 3 astronomers', 422)
//   }
//     const existingAstronomer = await db.user_astronomers.findUnique({
//     where: {
//       userId_astronomerId: {
//         userId: userId,
//         astronomerId: astronomerId,
//       },
//     },
//   });

//   if (existingAstronomer) {
//     throw new AppError('User already on astronomer', 409);

//   } 

//   const newAstronomer = await db.user_astronomers.create({
//     data: {
//        userId: userId,
//        astronomerId: astronomerId
//     }
//   })

//   return newAstronomer
// }


export async function postUserAstronomerService(userId: string, astronomerId: string) {

  const verifyUserAstronomer = await db.$queryRaw<
    { count: number }[]
  >`SELECT COUNT(*) as count FROM "User_astronomers" WHERE "userId" = ${userId}`;

  if (verifyUserAstronomer[0].count === 3) {
    throw new AppError('User cannot have more than 3 astronomers', 422);
  }

  const existingAstronomer = await db.$queryRaw<
    { userId: string, astronomerId: string }[]
  >`SELECT * FROM "User_astronomers" WHERE "userId" = ${userId} AND "astronomerId" = ${astronomerId} LIMIT 1`;

  if (existingAstronomer.length > 0) {
    throw new AppError('User already on astronomer', 409);
  }


  const newAstronomer = await db.$executeRaw`
    INSERT INTO "User_astronomers" ("userId", "astronomerId")
    VALUES (${userId}, ${astronomerId})
  `;

  return { userId, astronomerId };
}