import { Request, Response } from "express"
import { commentBusiness } from "../business/commentBusiness"
import { CreateCommentsInputDTO, GetCommentInputDTO, LikedislikeCommentInputDTO } from "../dtos/commentDTO"
import { BaseError } from "../error/BaseError"

export class CommentController {
    constructor(
        private commentBusiness: commentBusiness
    ) {}

    public commentsGet = async (req: Request, res: Response) => {
        try {
           const input: GetCommentInputDTO = {
            post_id:req.params.id,
            token: req.headers.authorization
           }
           const output = await this.commentBusiness.commentsGet(input)
           res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public commentsCreate = async (req: Request, res: Response) => {
        try {
            const input: CreateCommentsInputDTO = {
                post_id: req.params.id,
                token: req.headers.authorization,
                content: req.body.content
            }
           
           const output = await this.commentBusiness.commentsCreate(input)

            res.status(201).send(output)
            
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }  
        }
    }

    // public postsEdit = async (req: Request, res: Response) => {
    //     try {
    //         const input: EditPostInputDTO = {
    //             idToEdit: req.params.id,
    //             content: req.body.content,
    //             token: req.headers.authorization
    //         }
    //         await this.postBusiness.postsEdit(input)
    //         res.status(200).end()
            
    //     } catch (error) {
    //         console.log(error)
    //         if (error instanceof BaseError) {
    //             res.status(error.statusCode).send(error.message)
    //         } else {
    //             res.status(500).send("Erro inesperado")
    //         }
            
    //     }
    // }

    // public postsDelete = async (req: Request, res: Response) => {
    //     try {
    //        const input: DeletePostInputDTO = {
    //         idToDelete: req.params.id,
    //         token: req.headers.authorization
    //        }
    //        await this.postBusiness.postsDelete(input)
    //        res.status(200).end()

    //     } catch (error) {
    //         console.log(error)
    //         if (error instanceof BaseError) {
    //             res.status(error.statusCode).send(error.message)
    //         } else {
    //             res.status(500).send("Erro inesperado")
    //         }
    //     }
    // }

    public commentsLikeOrDislike = async (req: Request, res: Response) => {
        try {
            const input:LikedislikeCommentInputDTO = {
                idLikeDislike: req.params.id,
                token: req.headers.authorization,
                like:req.body.like
            }

            await this.commentBusiness.commentsLikeOrDislike(input)
            res.status(200).end()
        
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
            
        }
    }
}