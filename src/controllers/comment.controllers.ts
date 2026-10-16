import { postCommentService } from "@/services/comment/postComment.services";
import {
  deleteCommentService,
  putCommentService,
} from "@/services/comment/manageComment.services";
import { getCurrentUser } from "@/utils/currentUser";
import { CommentType } from "@/types/model.types";
import { Request, Response } from "express";

export const postCommentController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const commentData: CommentType = await postCommentService(req.body!);
    return res.status(201).json(commentData);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno" });
  }
};

export const putCommentController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = await getCurrentUser(res.locals.email);
  const comment = await putCommentService(
    req.params.id,
    req.body.description,
    user
  );
  return res.status(200).json(comment);
};

export const deleteCommentController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const user = await getCurrentUser(res.locals.email);
  await deleteCommentService(req.params.id, user);
  return res.status(204).send();
};
