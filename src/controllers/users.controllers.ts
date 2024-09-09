import { Request, Response } from "express";
import postUserService from "@/services/users/postUser.services";
import { loginUserService } from "@/services/users/loginUser.services";
import { getAllUsersService } from "@/services/users/getAllUsers.services";
import { getUserByIdService } from "@/services/users/getUserById.services";
import {
  userPassword,
  userRegisterResponse,
  userWithoutPassword,
} from "@/types/user.types";
import { putUserService } from "@/services/users/putUser.services";
import { deleteUserService } from "@/services/users/deleteUser.services";
import { getUserByTokenService } from "@/services/users/getUserByToken.services";
import { passwordUserService } from "@/services/users/passwordUser.services";
import { AppError } from "@/error";

const postUserController = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    const reqBody = req.body;
    const createdUser: userRegisterResponse = await postUserService(reqBody);
    return res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno" });
  }
};

const loginUserController = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    const token: string = await loginUserService(req.body);
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno" });
  }
};

const getAllUsersController = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    const users: userWithoutPassword[] = await getAllUsersService();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno" });
  }
};

const getUserByIdController = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    const id: string = req.params.id;
    const user: userWithoutPassword = await getUserByIdService(id);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno" });
  }
};

const getUserByTokenController = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    const email: string = res.locals.email;
    const user= await getUserByTokenService(email);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno" });
  }
};

const putUserController = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    const user = req.body;
    const id: string = req.params.id;
    const editedUser: userWithoutPassword = await putUserService(id, user);
    return res.status(200).json(editedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno" });
  }
};

const deleteUserController = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    const id: string = req.params.id;
    await deleteUserService(id);
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno" });
  }
};

const passwordUserController = async (
  req: Request,
  res: Response
): Promise<Response<void>> => {
  try {
    const data: userPassword = req.body;
    await passwordUserService(data);
    return res.status(200).json({ message: "Senha alterada com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno" });
  }
};
export {
  postUserController,
  loginUserController,
  getAllUsersController,
  getUserByIdController,
  putUserController,
  deleteUserController,
  getUserByTokenController,
  passwordUserController,
};
