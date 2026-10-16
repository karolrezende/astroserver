import { Router } from "express";

import {
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  getUserByTokenController,
  loginUserController,
  passwordUserController,
  postUserController,
  putUserController,
} from "@/controllers/users.controllers";

import { ensureSchema } from "@/middlewares/ensureSchema.middleware";

import { ensureBodyExists } from "@/middlewares/ensureBodyExists.middleware";
import { ensureOwner } from "@/middlewares/ensureOwner.middleware";
import { ensureUserIdExists } from "@/middlewares/ensureUserIdExists.middleware";
import { ensureUserToken } from "@/middlewares/ensureUserToken.middleware";
import {
  userLoginSchema,
  userPasswordSchema,
  userRegisterSchema,
} from "@/schemas/user.schemas";

export const userRoute: Router = Router();

userRoute.get("", ensureUserToken, getAllUsersController);
userRoute.get(
  "/user/:id",
  ensureUserToken,
  ensureUserIdExists,
  getUserByIdController
);
userRoute.get("/token", ensureUserToken, getUserByTokenController);

userRoute.post("", ensureSchema(userRegisterSchema), postUserController);

userRoute.post(
  "/login",
  ensureBodyExists,
  ensureSchema(userLoginSchema),
  loginUserController
);

userRoute.put(
  "/:id",
  ensureBodyExists,
  ensureUserToken,
  ensureOwner,
  ensureUserIdExists,
  putUserController
);

userRoute.delete(
  "/:id",
  ensureUserToken,
  ensureOwner,
  ensureUserIdExists,
  deleteUserController
);

userRoute.post(
  "/password",
  ensureUserToken,
  ensureBodyExists,
  ensureSchema(userPasswordSchema),
  passwordUserController
);
