import { LikeDislikeComentsDB } from "../types"

export class LikeDislikeComment {
    constructor(
        private userId: string,
        private commentId: string,
        private like: number
    ) { }

    public toDBModel(): LikeDislikeComentsDB{
        return {
            user_id: this.userId,
            comments_id: this.commentId,
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
        return this.commentId
    }

    public setPostId(value: string): void {
        this.commentId = value
    }

    public getLike(): number {
        return this.like
    }

    public setLike(value: number): void {
        this.like = value
    }
}