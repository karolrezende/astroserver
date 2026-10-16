import { db } from "@/app";
import { AppError } from "@/error";
import { NextFunction, Request, Response } from "express";

// O userId enviado no corpo precisa ser o do dono do token,
// para ninguém criar conteúdo em nome de outra pessoa
export const ensureBodyUserIsSelf = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = await db.user.findUnique({
    where: { email: res.locals.email },
    select: { id: true },
  });

  if (!user || req.body.userId !== user.id) {
    throw new AppError("Not allowed", 403);
  }

  next();
};
