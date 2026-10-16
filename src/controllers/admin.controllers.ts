import { getAllPostsToAproveService } from "@/services/admin/getAllPostsToAprove.services";
import {
  deleteUserAdminService,
  getAllUsersAdminService,
  putUserRoleService,
} from "@/services/admin/manageUsers.services";
import { rejectPostService } from "@/services/admin/rejectPost.services";
import { getCurrentUser } from "@/utils/currentUser";
import { PostType } from "@/types/model.types";
import { Request, Response } from "express";

const getAllPostsToAproveController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const posts: PostType[] | null = await getAllPostsToAproveService();
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno" });
  }
};

const rejectPostController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  await rejectPostService(req.params.id, req.body.reason);
  return res.status(200).json({ message: "Post recusado" });
};

const getAllUsersAdminController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const users = await getAllUsersAdminService();
  return res.status(200).json(users);
};

const putUserRoleController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const actor = await getCurrentUser(res.locals.email);
  await putUserRoleService(req.params.id, req.body.access_level, actor);
  return res.status(200).json({ message: "Nível de acesso atualizado" });
};

const deleteUserAdminController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const actor = await getCurrentUser(res.locals.email);
  await deleteUserAdminService(req.params.id, actor);
  return res.status(204).send();
};

export {
  getAllPostsToAproveController,
  rejectPostController,
  getAllUsersAdminController,
  putUserRoleController,
  deleteUserAdminController,
};
