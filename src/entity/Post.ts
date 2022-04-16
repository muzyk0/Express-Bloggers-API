import { IsInt, Length } from "class-validator";
import { ValidationErrors } from "../lib/errorsHelpers";
import { Nullable } from "../types/genericTypes";
import { IBlogger } from "./Blogger";

export interface IPost {
    id: number;
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: IBlogger["id"];
    bloggerName: IBlogger["name"];
}

export type PostInput = Partial<Pick<IPost, "id">> &
    Pick<IPost, "title" | "content" | "shortDescription" | "bloggerId">;

export class Post extends ValidationErrors {
    @IsInt()
    id: Nullable<number> = null;

    @Length(1)
    title: Nullable<string> = null;

    @Length(1)
    shortDescription: Nullable<string> = null;

    @Length(1)
    content: Nullable<string> = null;

    @IsInt()
    bloggerId: Nullable<IBlogger["id"]> = null;

    @Length(1)
    bloggerName: Nullable<IBlogger["name"]> = null;
}
