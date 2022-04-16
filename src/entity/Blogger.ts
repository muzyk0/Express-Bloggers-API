import { IsInt, Length, Matches } from "class-validator";
import { ValidationErrors } from "../lib/errorsHelpers";
import { Nullable } from "../types/genericTypes";

export const youtubeURLPattern =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/;

export interface IBlogger {
    id: number;

    name: string;

    youtubeUrl: string;
}

export class Blogger extends ValidationErrors {
    @IsInt()
    id: Nullable<number> = null;

    @Length(1)
    name: Nullable<string> = null;

    @Length(1)
    @Matches(youtubeURLPattern)
    youtubeUrl: Nullable<string> = null;
}
