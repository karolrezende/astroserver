import {
  deletePostController,
  getAllPostController,
  getMyPostsController,
  getPostByIdController,
  postPostController,
  putAcceptPostController,
  putPostController,
  toggleLikeController,
} from "@/controllers/post.controllers";
import { ensureBodyExists } from "@/middlewares/ensureBodyExists.middleware";
import { ensureIsAdm } from "@/middlewares/ensureIsAdm.middleware";
import { ensureSchema } from "@/middlewares/ensureSchema.middleware";
import { ensureUserToken } from "@/middlewares/ensureUserToken.middleware";
import {
  postRegisterSchema,
  putAcceptPostSchema,
  putPostSchema,
} from "@/schemas/post.schema";
import { Router } from "express";

export const postRoute: Router = Router();

postRoute.get("/mine", ensureUserToken, getMyPostsController);
postRoute.get("/:id", ensureUserToken, getPostByIdController);
postRoute.post("/:id/like", ensureUserToken, toggleLikeController);

postRoute.get("/", ensureUserToken, getAllPostController);

postRoute.post(
  "/",
  ensureUserToken,
  ensureBodyExists,
  ensureSchema(postRegisterSchema),
  postPostController
);

postRoute.put(
  "/:id",
  ensureUserToken,
  ensureBodyExists,
  ensureSchema(putPostSchema),
  putPostController
);

postRoute.put(
  "/accept/:id",
  ensureUserToken,
  ensureIsAdm,
  putAcceptPostController
);
postRoute.delete("/:id", ensureUserToken, deletePostController);
