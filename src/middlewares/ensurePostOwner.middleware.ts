import { db } from "@/app";
import { AppError } from "@/error";
import { Access_level } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

// Só o autor do post ou um admin pode editar/excluir
export const ensurePostOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const post = await db.post.findUnique({
    where: { id: req.params.id },
    select: { user: { select: { email: true } } },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  if (
    res.locals.isAdmin !== Access_level.ADMIN &&
    post.user.email !== res.locals.email
  ) {
    throw new AppError("Not allowed", 403);
  }

  next();
};
