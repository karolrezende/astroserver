import { deletePostService } from "@/services/posts/deletePostService.services";
import { getAllPostService } from "@/services/posts/getAllPost.services";
import { getMyPostsService } from "@/services/posts/getMyPosts.services";
import { toggleLikeService } from "@/services/posts/toggleLike.services";
import { feedQuerySchema } from "@/schemas/post.schema";
import { getCurrentUser } from "@/utils/currentUser";
import { getPostByIdService } from "@/services/posts/getPostById.services";
import { postPostService } from "@/services/posts/postPost.services";
import { putAcceptPostService } from "@/services/posts/putAcceptPost.services";
import { putPostService } from "@/services/posts/putPostService.services";
import { postType } from "@/types/post.types";
import { Request, Response } from "express";

const getPostByIdController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id: string = req.params.id;
    const post: postType = await getPostByIdService(id);
    return res.status(200).json(post);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno" });
  }
};

const getAllPostController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const filters = feedQuerySchema.parse(req.query);
  const viewer = await getCurrentUser(res.locals.email);
  const feed = await getAllPostService(filters, viewer.id);
  return res.status(200).json(feed);
};

const getMyPostsController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const viewer = await getCurrentUser(res.locals.email);
  const posts = await getMyPostsService(viewer.id);
  return res.status(200).json(posts);
};

const toggleLikeController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const viewer = await getCurrentUser(res.locals.email);
  const result = await toggleLikeService(req.params.id, viewer.id);
  return res.status(200).json(result);
};

const postPostController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const searchedPost: postType = await postPostService(req.body);
    return res.status(201).json(searchedPost);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno" });
  }
};

const putPostController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id;
    const editedPost: postType = await putPostService(id, req.body);
    return res.status(201).json(editedPost);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno" });
  }
};
const putAcceptPostController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id;
    await putAcceptPostService(id);
    return res.status(201).json({ message: "Post aceito com sucesso!" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno" });
  }
};

const deletePostController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    await deletePostService(req.params.id);
    return res.status(204).send();
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno" });
  }
};

export {
  postPostController,
  getPostByIdController,
  getAllPostController,
  deletePostController,
  putPostController,
  putAcceptPostController,
  getMyPostsController,
  toggleLikeController,
};
