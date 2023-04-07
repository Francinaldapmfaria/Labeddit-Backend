import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreateCommentsInputDTO, GetCommentInputDTO, GetCommentOutputDTO, LikedislikeCommentInputDTO } from "../dtos/commentDTO";
import { BadRequestError } from "../error/BadRequestError";
import { NotFoundError } from "../error/NotFoundError";
import { Comment } from "../models/Comment";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import {  CommentsDB, COMMENT_LIKE, LikeDislikeComentsDB, LikeDislikeCreator, TokenPayload } from "../types";

export class commentBusiness {
    constructor(
        private commentDatabase: CommentDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase

    ) { }

    public commentsGet = async (input: GetCommentInputDTO): Promise<GetCommentOutputDTO> => {
        const { post_id, token } = input

        if (token === undefined) {
            throw new BadRequestError("token não existe")
        }
        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido/errado")
        }

        const commentsWithId: CommentsDB[] = await this.commentDatabase.getAllComments(post_id)

        const getUsers = await this.userDatabase.getAllUsers()

        const getcommentary = commentsWithId.map((comment) => {
            const userSearch = getUsers.find((user) => user.id === comment.creator_id)

            if (!userSearch) {
                throw new NotFoundError("Usuário não encontrado")
            }
            const userComentary: TokenPayload = {
                id: userSearch.id,
                name: userSearch.name,
                role: userSearch.role
            }
            const comments = new Comment(
                comment.id,
                comment.content,
                comment.likes,
                comment.dislikes,
                comment.created_at,
                comment.updated_at,
                comment.post_id,
                userComentary
            )
            return comments.toBusinessModel()
        })
        const output: GetCommentOutputDTO = getcommentary

        return output
    }

    public commentsCreate = async (input: CreateCommentsInputDTO): Promise<void> => {
        const { post_id, token, content } = input
        if (typeof post_id !== "string") {
            throw new BadRequestError("'post_id' não é uma string")
        }
        if (!token) {
            throw new BadRequestError("'token' precisa ser informado")
        }
        if (typeof content !== "string") {
            throw new BadRequestError("'content' não é uma string")
        }
        if (token === undefined) {
            throw new BadRequestError("token não existe")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }

        const searchPostById = await this.postDatabase.findId(post_id)

        if (!searchPostById) {
            throw new BadRequestError("'Post' não encontrado")
        }

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()

        const comment = new Comment(
            id,
            content,
            0,
            0,
            createdAt,
            updatedAt,
            post_id,
            payload
        )
        const commentDB = comment.toDBModel()
        await this.commentDatabase.insert(commentDB)
        await this.commentDatabase.updateNumberCommments(id, 1)

    }

    public getCommentsByPostId = async (input: GetCommentInputDTO): Promise<{}[]> => {

        const { post_id, token } = input
       
        if (token === undefined) {
            throw new BadRequestError(" Enviar um token.")
        }

        const tokenValid = this.tokenManager.getPayload(token)

        if (tokenValid === null) {
            throw new BadRequestError(" Token inválido.")
        }

        const commentsByPostIdDB = await this.commentDatabase.getCommentsByPostId(post_id)

        let userWithComments : {}[] = []

        for (const comment of commentsByPostIdDB) {
            const userDB = await this.commentDatabase.getUserById(comment.creator_id)
            const styleGetComment = {
                id: comment.id,
                creatorName: userDB.name,
                comment: comment.content,
                likes: comment.likes,
                dislikes: comment.dislikes,
            }
            userWithComments.push(styleGetComment)
        }
        return userWithComments

        
    }

    public commentsLikeOrDislike = async (input: LikedislikeCommentInputDTO): Promise<void> => {
        const { idLikeDislike, token, like } = input

        if (token === undefined) {
            throw new BadRequestError("token não existe")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("token inválido")
        }
        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser boolean")
        }

        const commentWithCreatorDB = await this.commentDatabase.findCommentIfCreatorById(idLikeDislike)

        if (!commentWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id
        const likeSQlite = like ? 1 : 0
        const role = payload.role
        const name = payload.name

        const likeDislikeDB: LikeDislikeComentsDB = {
            user_id: creatorId,
            comments_id: commentWithCreatorDB.id,
            like: likeSQlite
        }

        const creator: LikeDislikeCreator = {
            id: creatorId,
            name,
            role
        }

        const comment = new Comment(
            commentWithCreatorDB.id,
            commentWithCreatorDB.content,
            commentWithCreatorDB.likes,
            commentWithCreatorDB.dislikes,
            commentWithCreatorDB.created_at,
            commentWithCreatorDB.updated_at,
            commentWithCreatorDB.post_id,
            creator
        )
        const likedislikeExists = await this.commentDatabase
            .findLikeDislike(likeDislikeDB)

        if (likedislikeExists === COMMENT_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB)
                comment.removeLike()
            } else {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB)
                comment.removeLike()
                comment.addDislike()
            }
        } else if (likedislikeExists === COMMENT_LIKE.ALREADY_DISLIKED) {
            if (like) {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB)
                comment.removeDislike()
                comment.addLike()
            } else {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB)
                comment.removeDislike()
            }
        } else {
            await this.commentDatabase.commentsLikeOrDislike(likeDislikeDB)
            if (like) {
                comment.addLike()
            } else {
                comment.addDislike()
            }
        }
        const updateCommentDB = comment.toDBModel()
        await this.commentDatabase.update(idLikeDislike, updateCommentDB)

    }
}