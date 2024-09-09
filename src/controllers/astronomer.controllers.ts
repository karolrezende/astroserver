import { AppError } from "@/error";
import { deleteUserAstronomerService } from "@/services/astronomer/deleteUserAstronomer.services";
import { getAllAstronomersService } from "@/services/astronomer/getAllAstronomers.serivces";
import { postAstronomerService } from "@/services/astronomer/postAstronomer.services";
import { postUserAstronomerService } from "@/services/astronomer/postUserAstronomer.services";
import { Request, Response } from "express";

export const postAstronomerController = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
        const astronomerData = req.body
        const astronomer = await postAstronomerService(astronomerData)
      return res.status(200).json(astronomer);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: "Erro interno" + err  });
    }
  };
  
export const getAllAstronomersController = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
        const astronomer = await getAllAstronomersService()
      return res.status(200).json(astronomer);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: "Erro interno" + err  });
    }
  };
  
export const postUserAstronomerController = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId= req.body.userId
      const astronomerId= req.body.astronomerId
      const astronomer = await postUserAstronomerService(userId,astronomerId)
      return res.status(200).json(astronomer);
    } catch (err: any) {
     if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro interno" + err  });
    }
  };

export const deleteUserAstronomerController = async (
    req: Request,
    res: Response
  ) => {
    try {
      const data= req.body
      await deleteUserAstronomerService(data)
      return res.sendStatus(204);
    } catch (err: any) {
  }}
  