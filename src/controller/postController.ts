import { Request, Response } from "express"
import { postBusiness } from "../business/postBusiness"
import { CreatePostsInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostInputDTO, LikedislikeInputDTO } from "../dtos/userDTO"
import { BaseError } from "../error/BaseError"

export class PostController {
    constructor(
        private postBusiness: postBusiness
    ) {}

    public postsGet = async (req: Request, res: Response) => {
        try {
           const input: GetPostInputDTO = {
            token: req.headers.authorization
           }
           const output = await this.postBusiness.postsGet(input)
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

    public postsCreate = async (req: Request, res: Response) => {
        try {
            const input: CreatePostsInputDTO = {
                token: req.headers.authorization,
                content: req.body.content
            }
           
            await this.postBusiness.postsCreate(input)
            console.log("NATALLLLLLLLLLLLL",input)

            res.status(201).end()
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }  
        }
    }

    public postsEdit = async (req: Request, res: Response) => {
        try {
            const input: EditPostInputDTO = {
                idToEdit: req.params.id,
                content: req.body.content,
                token: req.headers.authorization
            }
            await this.postBusiness.postsEdit(input)
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

    public postsDelete = async (req: Request, res: Response) => {
        try {
           const input: DeletePostInputDTO = {
            idToDelete: req.params.id,
            token: req.headers.authorization
           }
           await this.postBusiness.postsDelete(input)
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

    public postsLikeOrDislike = async (req: Request, res: Response) => {
        try {
            const input:LikedislikeInputDTO = {
                idLikeDislike: req.params.id,
                token: req.headers.authorization,
                like:req.body.like
            }

            await this.postBusiness.postsLikeOrDislike(input)
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