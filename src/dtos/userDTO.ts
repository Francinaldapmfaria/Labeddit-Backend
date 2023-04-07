import {PostsModel} from '../types'

export interface SignupInputDTO {
    name:unknown,
    email: unknown,
    password: unknown
}

export interface SignupOutputDTO{
    token: string
}

export interface LoginInputDTO {
    email: unknown,
    password: unknown
}

export interface LoginOutputDtO {
    token: string
}

export interface GetPostInputDTO {
    token: string | undefined
}

export type GetPostOutputDTO = PostsModel[]

export interface CreatePostsInputDTO {
    token: string |undefined,
    content: unknown
}

export interface EditPostInputDTO {
    idToEdit: string,
    token: string |undefined,
    content: unknown
}

export interface DeletePostInputDTO {
    idToDelete: string,
    token: string |undefined
}

export interface LikedislikeInputDTO {
    idLikeDislike: string,
    token: string | undefined,
    like: unknown
}

export interface getPostByIdInputDTO{
    id: string,
    token: string | undefined
}

export interface getPostByIdInputDTO{
    id: string,
    token: string | undefined
}




