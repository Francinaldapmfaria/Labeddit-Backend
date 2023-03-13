import { LikeDislikePostsDB } from "../types"

export class LikeDislikePost {
    constructor(
        private userId: string,
        private postId: string,
        private like: number
    ) { }

    public toDBModel(): LikeDislikePostsDB{
        return {
            user_id: this.userId,
            post_id: this.postId,
            like: this.like
        } 
    }

    public getUserId(): string {
        return this.userId
    }

    public setUserId(value: string): void {
        this.userId = value
    }

    public getPostId(): string {
        return this.postId
    }

    public setPostId(value: string): void {
        this.postId = value
    }

    public getLike(): number {
        return this.like
    }

    public setLike(value: number): void {
        this.like = value
    }
}
