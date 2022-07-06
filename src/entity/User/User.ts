import { IsDate, IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ValidationErrors } from '../../lib/ValidationErrors';
import { Nullable } from '../../types/genericTypes';

export type UserAccountDBType = {
    accountData: IUser;
    loginAttempts: LoginAttemptType[];
    emailConfirmation: EmailConfirmationType;
};
export type EmailConfirmationType = {
    isConfirmed: boolean;
    confirmationCode: string;
    expirationDate: Date;
    sentEmails: SentConfirmationEmailType[];
};

export type SentConfirmationEmailType = {
    sentDate: Date;
};
export type LoginAttemptType = {
    attemptDate: Date;
    ip: string;
};

export interface IUser {
    id: string;
    login: string;
    email: string;
    password: string;
    createdAt: Date;
}

export type UserInput = Pick<IUser, 'login' | 'email' | 'password'>;
export type UserDTO = Pick<IUser, 'id' | 'login'>;

export class User extends ValidationErrors {
    @IsString()
    id: Nullable<string> = null;

    @Length(3, 10)
    @IsNotEmpty()
    login: Nullable<string> = null;

    @IsEmail()
    @IsNotEmpty()
    email: Nullable<string> = null;

    @Length(6, 20)
    password: Nullable<string> = null;

    @IsDate()
    @IsNotEmpty()
    createdAt: Nullable<Date> = null;
}

export class ValidationEmailConfirmationCode extends ValidationErrors {
    @IsString()
    code: Nullable<string> = null;
}
