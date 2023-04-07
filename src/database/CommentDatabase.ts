import { NotFoundError } from "../error/NotFoundError"
import {  CommentsAndItCreatorDB, CommentsDB, COMMENT_LIKE, LikeDislikeComentsDB, PostsDB, UserModel } from "../types"
import { BaseDatabase } from "./BaseDatabase"
import { PostDatabase } from "./PostDatabase"



export class CommentDatabase extends BaseDatabase {
    public static TABLE_COMMENTS = "comments"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes_comments"
    public static TABLE_USERS = "users"
    
    public getAllCommentIfCreator = async (): Promise<CommentsAndItCreatorDB[]> => {
        const result: CommentsAndItCreatorDB[]= await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .select(
            "comments.id" ,
            "comments.creator_id ",
            "comments.post_id ",
            "comments.content" ,
            "comments.likes",
            "comments.dislikes",
            "comments.created_at",
            "comments.updated_at",
            "users.name As creator_name"
        )
        .join("users","comments.creator_id", "=", "users.id")

        return result
    }

    public getAllComments = async (id:string):Promise<CommentsDB[]> =>{

        return await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
        .where({post_id:id})
    }

    public insert = async (commentDB: CommentsDB): Promise<void> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
        .insert(commentDB)
    }

    public getCommentById = async (id:string):Promise<CommentsDB| undefined> =>{
        const [comment] = await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .where({id})
        return comment
    }

    public getCommentsByPostId = async (id: string): Promise<CommentsDB[]> => {
     
        const result = await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
            .where({ post_id: id })
            return result
            
    }

    public async updateNumberCommments(id: string, value: number): Promise<void> {
        const commentById = await this.getCommentById(id);

        if (!commentById) {
            throw new NotFoundError("Comment não existe");
        }

        const [post]:PostsDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .where({ id: commentById.post_id })

        if (!post) {
            throw new NotFoundError("Post não encontrado");
        }

        const newCommentsCount = post.comments + value;

        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .where({ id: commentById.post_id })
        .update({ comments: newCommentsCount });
    }

   
    public findCommentIfCreatorById = async (commentId:string): Promise< CommentsAndItCreatorDB | undefined >=> {
        const result: CommentsAndItCreatorDB[]= await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .select(
            "comments.id" ,
            "comments.creator_id ",
            "comments.post_id ",
            "comments.content" ,
            "comments.likes",
            "comments.dislikes",
            "comments.created_at",
            "comments.updated_at",
            "users.name As creator_name"
        )
        .join("users","comments.creator_id", "=", "users.id")
        .where("comments.id", commentId)

        return result[0]
    }

    public findLikeDislike  = async (likeDislikeDBToFind: LikeDislikeComentsDB): Promise<COMMENT_LIKE |null> => {
        const [likeDislikeDB]: LikeDislikeComentsDB[] = await BaseDatabase
        .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
        .select()
        .where({
            user_id: likeDislikeDBToFind.user_id,
            comments_id: likeDislikeDBToFind.comments_id
        })

        if(likeDislikeDB) {
            return likeDislikeDB.like === 1? COMMENT_LIKE.ALREADY_LIKED : COMMENT_LIKE.ALREADY_DISLIKED
        }else{
            return null
        }
    }

    public commentsLikeOrDislike = async (likeDislike: LikeDislikeComentsDB): Promise<void> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES)
        .insert(likeDislike)
    }

    public update =  async (id: string, commentDB: CommentsDB): Promise<void> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
        .update(commentDB)
        .where({id})
    }

    public removeLikeDislike = async (likeDislikeDB: LikeDislikeComentsDB): Promise<void> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES)
        .delete()
        .where({
            user_id:likeDislikeDB.user_id,
            comments_id: likeDislikeDB.comments_id
        })   
    }

    public async getUserById(id: string): Promise<UserModel> {
        const result: UserModel[] = await BaseDatabase
          .connection(CommentDatabase.TABLE_USERS)
          .select()
          .where({ id })
        return result[0]
      }

    public updateLikeDislike = async (likeDislikeDB: LikeDislikeComentsDB): Promise<void> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES)
        .update(likeDislikeDB)
        .where({
            user_id:likeDislikeDB.user_id,
            comments_id: likeDislikeDB.comments_id
        })
    }
}

