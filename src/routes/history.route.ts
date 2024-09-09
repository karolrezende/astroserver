import {
  deleteHistoryController,
  getAllHistoryController,
  postHistoryController,
  putHistoryController,
} from "@/controllers/history.controllers";
import { putPostController } from "@/controllers/post.controllers";
import { ensureBodyExists } from "@/middlewares/ensureBodyExists.middleware";
import { ensureIsAdm } from "@/middlewares/ensureIsAdm.middleware";
import { ensureUserToken } from "@/middlewares/ensureUserToken.middleware";
import { Router } from "express";

export const historyRoute: Router = Router();

historyRoute.get("/", ensureUserToken, getAllHistoryController);

historyRoute.post(
  "/",
  ensureUserToken,
  ensureBodyExists,
  ensureIsAdm,
  postHistoryController
);

historyRoute.put(
  "/:id",
  ensureUserToken,
  ensureBodyExists,
  putHistoryController
);

historyRoute.delete("/:id", ensureUserToken, deleteHistoryController);
