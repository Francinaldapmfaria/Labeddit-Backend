import { CommentsModel } from "../types"

export interface GetCommentInputDTO {
    post_id: string,
    token: string | undefined

}

export type GetCommentOutputDTO = CommentsModel[]

export interface CreateCommentsInputDTO {
    post_id: string,
    token: string |undefined,
    content: unknown
}

export interface EditCommentInputDTO {
    idToEdit: string,
    token: string |undefined,
    content: unknown
}

export interface DeleteCommentInputDTO {
    idToDelete: string,
    token: string |undefined
    
}

export interface LikedislikeCommentInputDTO {
    idLikeDislike: string,
    token: string | undefined,
    like: unknown
}




