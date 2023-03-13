import express  from "express"
import { commentBusiness } from "../business/commentBusiness"
import { CommentController } from "../controller/commentController"
import { CommentDatabase } from "../database/commentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const commentsRouter = express.Router()

const commentController =  new CommentController(
    new commentBusiness(
        new CommentDatabase,
        new IdGenerator(),
        new TokenManager(),
        new PostDatabase(),
        new UserDatabase()
    )
) 

commentsRouter.get("/:id", commentController.commentsGet )
commentsRouter.post("/:id", commentController.commentsCreate )
// commentsRouter.put("/:id", commentController.postsEdit )
// commentsRouter.delete("/:id", commentController.postsDelete)
commentsRouter.put("/:id/like", commentController.commentsLikeOrDislike)