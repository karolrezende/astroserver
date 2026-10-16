import {
  deleteCommentController,
  postCommentController,
  putCommentController,
} from "@/controllers/comment.controllers";
import { ensureBodyExists } from "@/middlewares/ensureBodyExists.middleware";
import { ensureBodyUserIsSelf } from "@/middlewares/ensureBodyUserIsSelf.middleware";
import { ensureSchema } from "@/middlewares/ensureSchema.middleware";
import { ensureUserToken } from "@/middlewares/ensureUserToken.middleware";
import {
  commentSchemaRequest,
  commentUpdateSchema,
} from "@/schemas/comment.schema";
import { Router } from "express";

export const commentRoute: Router = Router();

commentRoute.post(
  "/",
  ensureUserToken,
  ensureBodyExists,
  ensureSchema(commentSchemaRequest),
  ensureBodyUserIsSelf,
  postCommentController
);

commentRoute.put(
  "/:id",
  ensureUserToken,
  ensureBodyExists,
  ensureSchema(commentUpdateSchema),
  putCommentController
);

commentRoute.delete("/:id", ensureUserToken, deleteCommentController);
