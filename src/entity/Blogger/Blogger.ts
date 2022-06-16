import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ValidationErrors } from '../../lib/ValidationErrors';
import { Nullable } from '../../types/genericTypes';

export const youtubeURLPattern =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/;

export interface IBlogger {
    id: string;

    name: string;

    youtubeUrl: string;
}

export class Blogger extends ValidationErrors {
    @IsString()
    id: Nullable<string> = null;

    @Length(1, 15)
    @IsNotEmpty()
    name: Nullable<string> = null;

    @Length(0, 100)
    @Matches(youtubeURLPattern)
    youtubeUrl: Nullable<string> = null;
}
