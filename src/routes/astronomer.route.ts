import { deleteUserAstronomerController, getAllAstronomersController, postAstronomerController, postUserAstronomerController } from "@/controllers/astronomer.controllers";
import { ensureBodyExists } from "@/middlewares/ensureBodyExists.middleware";
import { ensureIsAdm } from "@/middlewares/ensureIsAdm.middleware";
import { ensureUserToken } from "@/middlewares/ensureUserToken.middleware";
import { Router } from "express";

export const astronomerRoute: Router = Router();

astronomerRoute.post(
  "/",
  ensureUserToken,
  ensureBodyExists,
  ensureIsAdm,
  postAstronomerController
);

astronomerRoute.post(
  "/user",
  ensureUserToken,
  ensureBodyExists,
  postUserAstronomerController
);

astronomerRoute.get(
  "/",
  ensureUserToken,
  getAllAstronomersController
);

astronomerRoute.delete(
  "/user",
  ensureUserToken,
  deleteUserAstronomerController
);

