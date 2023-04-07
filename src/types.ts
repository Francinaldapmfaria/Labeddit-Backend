export interface UserDB {
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLES,
    created_at: string
}

export interface PostsDB {
    id: string,
    creator_id: string,
    content :string,
    likes:number,
    dislikes:number,
    comments: number,
    created_at:string,
    updated_at:string
}

export interface CommentsDB {
    id: string,
    creator_id: string,
    post_id: string
    content :string,
    likes:number,
    dislikes:number,
    created_at:string,
    updated_at:string
}
export interface LikeDislikePostsDB{
    user_id: string,
    post_id:string,
    like:number
}

export interface LikeDislikeComentsDB{
    user_id: string,
    comments_id:string,
    like:number
}

export interface LikeDislikeCreator{
    id: string,
   name:string,
   role:USER_ROLES
}

export interface PostsAndItCreatorDB extends PostsDB {
   
    creator_name: string
}

export interface PostsAndItCreatorDB extends CommentsDB {
   
    creator_name: string
}

export interface CommentsAndItCreatorDB extends CommentsDB {
   
    creator_name: string
}

export interface UserModel {
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLES,
    createdAt: string
}


export interface PostsModel{
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    comments: number,
    updatedAt: string,
    creator: {
        id: string,
        name: string
    }
}

export interface CommentsModel{
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    postId:string,
    creator: {
        id: string,
        name: string
    }
}


export enum POST_LIKE {
    ALREADY_LIKED = "jÁ CURTI",
    ALREADY_DISLIKED = "JÁ DISCURTI"
}

export enum COMMENT_LIKE {
    ALREADY_LIKED = "jÁ CURTI",
    ALREADY_DISLIKED = "JÁ DISCURTI"
}

export enum USER_ROLES {
    USUARIO= "Usuário",
    ADMIN = "Admin"
}

export interface TokenPayload {
    id: string,
    name:string,
    role: USER_ROLES
}