import { postPostController } from "@/controllers/post.controllers"
import { ensureBodyExists } from "@/middlewares/ensureBodyExists.middleware"
import { ensureSchema } from "@/middlewares/ensureSchema.middleware"
import { postRegisterSchema } from "@/schemas/post.schema"
import { Router } from "express"

export const postRoute: Router = Router()


postRoute.get('/')

postRoute.post('/', ensureSchema(postRegisterSchema), postPostController)

postRoute.put('/')
