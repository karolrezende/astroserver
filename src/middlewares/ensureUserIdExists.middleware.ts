import { db } from "@/app";
import { AppError } from "@/error";
import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const ensureUserIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id: string = req.params.id;
  const user: User | null = await db.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  next();
};
