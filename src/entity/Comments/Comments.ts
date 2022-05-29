import { IsDate, IsNotEmpty, IsString, Length } from "class-validator";
import { ValidationErrors } from "../../lib/ValidationErrors";
import { Nullable } from "../../types/genericTypes";

export interface CommentInput {
    content: string;
}

export interface CommentDTO {
    id: string;
    content: string;
    userId: string;
    userLogin: string;
    addedAt: Date;
}

export interface IComment {
    id: string;
    content: string;
    userId: string;
    userLogin: string;
    addedAt: Date;
    postId: string;
}

export class Comment extends ValidationErrors {
    @IsString()
    id: Nullable<string> = null;

    @Length(20, 300)
    @IsNotEmpty()
    content: Nullable<string> = null;

    @IsString()
    userId: Nullable<string> = null;

    @IsString()
    userLogin: Nullable<string> = null;

    @IsDate()
    addedAt: Nullable<string> = null;

    @IsString()
    postId: Nullable<string> = null;
}
