import { PostDatabase } from "../database/PostDatabase";
import { CreatePostsInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostInputDTO, GetPostOutputDTO, LikedislikeInputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../error/BadRequestError";
import { NotFoundError } from "../error/NotFoundError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { LikeDislikePostsDB, PostsAndItCreatorDB, PostsDB, POST_LIKE, USER_ROLES } from "../types";

export class postBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
       
    ) {}

    public postsGet = async (input: GetPostInputDTO): Promise<GetPostOutputDTO> => {
        const {token} = input

        if(token === undefined) {
            throw new BadRequestError("token não existe")
        }
        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token inválido")
        }

        const postsAndItsCreatorsDB: PostsAndItCreatorDB []= 
        await this.postDatabase.getPostIfCreator()

        const posts= postsAndItsCreatorsDB.map((postAndCreatorDB) =>{
            const post = new Post(
                postAndCreatorDB.id,
                postAndCreatorDB.content,
                postAndCreatorDB.likes,
                postAndCreatorDB.dislikes,
                postAndCreatorDB.comments,
                postAndCreatorDB.created_at,
                postAndCreatorDB.updated_at,
                postAndCreatorDB.creator_id,
                postAndCreatorDB.creator_name,
            )
                return post.toBusinessModel()
        })
        const output: GetPostOutputDTO = posts
        return output
    }
    public postsCreate = async (input: CreatePostsInputDTO): Promise<void> => {
        const {token, content} = input

        if(token === undefined) {
            throw new BadRequestError("token não existe")
        }
        const payload = this.tokenManager.getPayload(token)
 
        if(payload === null) {
            throw new BadRequestError("token inválido")
        }
        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()
        const creatorId = payload.id
        const creatorName = payload.name
       

         const post = new Post(
            id,
            content,
            0,
            0,
            0,
            createdAt,
            updatedAt,
            creatorId,
            creatorName
        )

        const postDB = post.toDBModel()

        await this.postDatabase.insert(postDB)
    }

    public postsEdit = async (input: EditPostInputDTO): Promise<void> => {
        const {idToEdit, token, content} = input

        if(token === undefined) {
            throw new BadRequestError("token não existe")
        }
        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token inválido")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("content deve ser string")
        }

        const postDB = await this.postDatabase.findId(idToEdit)

        if(!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

       if(postDB.creator_id !== creatorId){
        throw new BadRequestError("Edição realizada somente pelo criador")
       }
        const creatorName = payload.name

         const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.comments,
            postDB.created_at,
            postDB.updated_at,
            creatorId,
            creatorName
        )

        post.setContent(content)
        post.setUpdateAt(new Date().toISOString())

        const toUpdatePostDB = post.toDBModel()
        await this.postDatabase.update(idToEdit,toUpdatePostDB)
    }

    public postsDelete = async (input: DeletePostInputDTO): Promise<void> => {
        const {idToDelete, token} = input

        if(token === undefined) {
            throw new BadRequestError("token não existe")
        }
        const payload = this.tokenManager.getPayload(token)
 
        if(payload === null) {
            throw new BadRequestError("token inválido")

        }

        const postDB = await this.postDatabase.findId(idToDelete)

        if(!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

       if(
        payload.role !== USER_ROLES.ADMIN && 
        postDB.creator_id !== creatorId

        ){
        throw new BadRequestError("Só pode ser deletado pelo criador ")
       }

        await this.postDatabase.delete(idToDelete)
    }
    public postsLikeOrDislike = async (input: LikedislikeInputDTO ): Promise<void> => {
        const {idLikeDislike, token, like} = input

        if(token === undefined) {
            throw new BadRequestError("token não existe")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("token inválido")
        }

        if(typeof like !== "boolean"){
            throw new BadRequestError("'like' deve ser boolean")
        }
        const postWithCreatorDB = await this.postDatabase.findPostIfCreatorById(idLikeDislike)

        if(!postWithCreatorDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id
        const likeSQlite = like?1: 0

        const likeDislikeDB: LikeDislikePostsDB = {
            user_id: creatorId,
            post_id:postWithCreatorDB.id,
            like: likeSQlite
        }

        const post= new Post(
                
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.comments,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.creator_name,
    )
        const likedislikeExists = await this.postDatabase
        .findLikeDislike(likeDislikeDB)

        if(likedislikeExists === POST_LIKE.ALREADY_LIKED){
        
            if(like){
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()
            }else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()
            }

        }else if (likedislikeExists === POST_LIKE.ALREADY_DISLIKED) {
            if(like){
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeDislike()
                post.addLike()
            }else {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislike()
              
            }

        } else {
            await this.postDatabase.postsLikeOrDislike(likeDislikeDB)

            if(like){
                post.addLike()
            }else{
                post.addDislike()
            }
        }
        const updatePostDB =post.toDBModel()
        await this.postDatabase.update(idLikeDislike,updatePostDB)
       
    } 
}