import { IsInt, IsNotEmpty, IsString, Length } from "class-validator";
import { ValidationErrors } from "../lib/ValidationErrors";
import { Nullable } from "../types/genericTypes";
import { IBlogger } from "./Blogger";

export interface IPost {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: IBlogger["id"];
    bloggerName: IBlogger["name"];
}

export type PostInput = Partial<Pick<IPost, "id">> &
    Pick<IPost, "title" | "content" | "shortDescription" | "bloggerId">;

export class Post extends ValidationErrors {
    @IsString()
    id: Nullable<string> = null;

    @Length(1, 30)
    @IsNotEmpty()
    title: Nullable<string> = null;

    @Length(0, 100)
    shortDescription: Nullable<string> = null;

    @Length(1, 1000)
    content: Nullable<string> = null;

    @IsString()
    bloggerId: Nullable<IBlogger["id"]> = null;

    @Length(1)
    bloggerName: Nullable<IBlogger["name"]> = null;
}
