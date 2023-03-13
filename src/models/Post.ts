import { PostsDB, PostsModel } from "../types"

export class Post {
    constructor(
        private id: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private comments: number,
        private createdAt: string,
        private updatedAt: string,
        private creatorId: string,
        private creatorName: string
        ) {}

    public getId(): string {
        return this.id
    }

    public setId(value: string): void {
        this.id = value
    }

    public getContent(): string {
        return this.content
    }

    public setContent(value: string): void {
        this.content = value
    }

    public getLikes(): number {
        return this.likes
    }

    public setLikes(value: number): void {
        this.likes = value
    }

    public addLike(){
        this.likes +=1
    }

    public removeLike(){
        this.likes -= 1
    }

    public addDislike(){
        this.dislikes +=1
    }

    public removeDislike(){
        this.dislikes -= 1
    }


    public getDislikes(): number {
        return this.dislikes
    }

    public setDislikes(value: number): void {
        this.dislikes = value
    }

    public getComments(): number {
        return this.dislikes
    }

    public setComments(value: number): void {
        this.dislikes = value
    }

    public getCreatedAt(): string {
        return this.createdAt
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value
    }
    public getUpdateAt(): string {
        return this.updatedAt
    }

    public setUpdateAt(value: string): void {
        this.updatedAt = value
    }

    public getCreatorId(): string {
        return this.creatorId
        }
    
        public setCreatorId(value: string): void {
            this.creatorId = value
        }

        public getCreatorName(): string {
            return this.creatorName
            }
        
            public setCreatorName(value: string): void {
                this.creatorName = value
            } 
            
            public toDBModel(): PostsDB{
                return {
                    id: this.id,
                    creator_id: this.creatorId,
                    content :this.content,
                    likes: this.likes,
                    dislikes:this.dislikes,
                    comments: this.comments,
                    created_at:this.createdAt,
                    updated_at:this.updatedAt
                } 
            }
        
            public toBusinessModel():PostsModel {
                return {
                    id: this.id,
                    content: this.content,
                    likes: this.likes,
                    dislikes: this.dislikes,
                    comments: this.comments,
                    createdAt: this.createdAt,
                    updatedAt: this.updatedAt,
                    creator: {
                        id: this.id,
                        name: this.creatorName
                    }
                }
            }
}