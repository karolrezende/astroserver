import { db } from "@/app";
import { AppError } from "@/error";
import { userWithoutPasswordSchema } from "@/schemas/user.schemas";
import { userWithoutPassword } from "@/types/user.types";
import { User } from "@prisma/client";

// const getAllAstronomersService = async() => {

//     const astronomers = await db.astronomer.findMany()

//     if(!astronomers){
//         throw new AppError('astronomers not found', 400)
//     }

  

//     return astronomers
// }

// export {getAllAstronomersService}

const getAllAstronomersService = async () => {
  const astronomers = await db.$queryRaw`
      SELECT * FROM "Astronomer";
    `;

  if (!astronomers) {
    throw new AppError("Users not found", 400);
  }


  return astronomers;
};

export { getAllAstronomersService };
