import { AppError } from "@/error";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const ensureUserToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.headers.authorization;

  if (!token) {
    throw new AppError("Token is missing", 401);
  }

  const oToken = token.split(" ")[1];

  jwt.verify(oToken, process.env.SECRET_KEY!, (err: any, decoded: any) => {
    if (err) throw new AppError(err.message, 401);

    res.locals.isAdmin = decoded.isAdmin;
    res.locals.email = decoded.sub;

    next();
  });
};
