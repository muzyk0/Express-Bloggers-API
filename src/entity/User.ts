import { IsInt, IsNotEmpty, IsString, Length } from "class-validator";
import { ValidationErrors } from "../lib/ValidationErrors";
import { Nullable } from "../types/genericTypes";
import { IBlogger } from "./Blogger";

export interface IUser {
    id: string;
    login: string;
    password: string;
}

export type UserInput = Pick<IUser, "login" | "password">;
export type UserDTO = Pick<IUser, "id" | "login">;

export class User extends ValidationErrors {
    @IsString()
    id: Nullable<string> = null;

    @Length(1, 30)
    @IsNotEmpty()
    login: Nullable<string> = null;

    @Length(0, 100)
    password: Nullable<string> = null;
}
