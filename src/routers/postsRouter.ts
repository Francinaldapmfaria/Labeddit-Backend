import express  from "express"
import { postBusiness } from "../business/postBusiness"
import { PostController } from "../controller/postController"
import { PostDatabase } from "../database/PostDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const postsRouter = express.Router()

const postController =  new PostController(
    new postBusiness(
        new PostDatabase,
        new IdGenerator(),
        new TokenManager()
    )
) 

postsRouter.get("/", postController.postsGet )
postsRouter.get("/:id", postController.postsByIdGet )
postsRouter.post("/", postController.postsCreate )
postsRouter.put("/:id", postController.postsEdit )
postsRouter.delete("/:id", postController.postsDelete)
postsRouter.put("/:id/like", postController.postsLikeOrDislike)