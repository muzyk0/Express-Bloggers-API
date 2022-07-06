import mongoose from 'mongoose';
import { mongooseConnection } from '../../respositories/db';
import {
    EmailConfirmationType,
    IUser,
    LoginAttemptType,
    SentConfirmationEmailType,
    UserAccountDBType,
} from './User';

export const userSchema = new mongoose.Schema<IUser>({
    id: { type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true },
});

export const loginAttemptSchema = new mongoose.Schema<LoginAttemptType>({
    attemptDate: { type: Date, required: true },
    ip: { type: String, required: true },
});

export const sentConfirmationEmailSchema =
    new mongoose.Schema<SentConfirmationEmailType>({
        sentDate: { type: Date, required: true },
    });

export const emailConfirmationSchema =
    new mongoose.Schema<EmailConfirmationType>({
        isConfirmed: { type: Boolean, required: true },
        confirmationCode: { type: String, required: true },
        expirationDate: { type: Date, required: true },
        sentEmails: { type: [sentConfirmationEmailSchema], required: true },
    });

export const userAccountSchema = new mongoose.Schema<UserAccountDBType>({
    accountData: { type: userSchema, required: true },
    loginAttempts: { type: [loginAttemptSchema], required: true },
    emailConfirmation: { type: emailConfirmationSchema, required: true },
});

export const UserModel = mongooseConnection.model<UserAccountDBType>(
    'users',
    userAccountSchema,
    'users'
);
