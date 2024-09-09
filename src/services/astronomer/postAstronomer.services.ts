import { db } from "@/app";

// export const postAstronomerService = async (
//   astronomerData: any
// ) => {
//     const astronomer = await db.astronomer.create({
//         data: {
//             name: astronomerData.name,
//             description:astronomerData.name,
//             birthday: new Date(astronomerData.birthday)
//         }
//     })
//   return astronomer;
// };

export const postAstronomerService = async (astronomerData: any) => {
 
    const astronomer:any[] = await db.$queryRaw`
      INSERT INTO "Astronomer" ("id","name", "description", "birthday")
      VALUES (gen_random_uuid(),${astronomerData.name}, ${astronomerData.description}, ${new Date(astronomerData.birthday)})
      RETURNING *;
    `;
  
  return astronomer[0];
};