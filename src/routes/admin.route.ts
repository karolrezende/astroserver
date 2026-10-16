import {
  deleteUserAdminController,
  getAllPostsToAproveController,
  getAllUsersAdminController,
  putUserRoleController,
  rejectPostController,
} from "@/controllers/admin.controllers";
import { ensureBodyExists } from "@/middlewares/ensureBodyExists.middleware";
import { ensureIsAdm } from "@/middlewares/ensureIsAdm.middleware";
import { ensureSchema } from "@/middlewares/ensureSchema.middleware";
import { ensureUserToken } from "@/middlewares/ensureUserToken.middleware";
import { rejectPostSchema } from "@/schemas/post.schema";
import { userRoleSchema } from "@/schemas/user.schemas";
import { Router } from "express";

export const adminRoute: Router = Router();

// Todas as rotas de admin exigem token de um administrador
adminRoute.use(ensureUserToken, ensureIsAdm);

adminRoute.get("/", getAllPostsToAproveController);

adminRoute.put(
  "/posts/:id/reject",
  ensureBodyExists,
  ensureSchema(rejectPostSchema),
  rejectPostController
);

adminRoute.get("/users", getAllUsersAdminController);

adminRoute.patch(
  "/users/:id/role",
  ensureBodyExists,
  ensureSchema(userRoleSchema),
  putUserRoleController
);

adminRoute.delete("/users/:id", deleteUserAdminController);
