import { db } from "@/app"

// export const deleteUserAstronomerService = async(data:any) => {
//     return await db.user_astronomers.delete({
//         where: {
//             userId_astronomerId: {
//             userId: data.userId,
//             astronomerId: data.astronomerId
//             }
//         }
//     })

// }

export const deleteUserAstronomerService = async (data: any) => {
  await db.$queryRaw`
        DELETE FROM "User_astronomers" 
        WHERE "userId" = ${data.userId} 
        AND "astronomerId" = ${data.astronomerId};
    `;
}