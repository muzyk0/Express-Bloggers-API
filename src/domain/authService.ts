import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../constants';
import { UsersRepository } from '../respositories/usersRepository';
import { addDays, isAfter } from 'date-fns';
import { v4 } from 'uuid';
import { emailTemplateManager } from './email-template-manager';
import { EmailService } from './email-service';

export interface UserAccessTokenPayload {
    userId: string;
    login: string;
}

export interface AuthData {
    login: string;
    password: string;
}

export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private emailService: EmailService
    ) {}
    createJWT(payload: UserAccessTokenPayload) {
        const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
            expiresIn: '1h',
        });
        return token;
    }
    async checkCredentialWithBearerToken(token: string) {
        const userId = this.getUserIdByToken(token);

        if (!userId) {
            return null;
        }

        return this.usersRepository.getUserById(userId);
    }
    getUserIdByToken(token: string): string | null {
        try {
            const result: any = jwt.verify(token, ACCESS_TOKEN_SECRET);
            return result.userId;
        } catch (error) {
            return null;
        }
    }
    decodeBaseAuth(token: string): AuthData {
        const buff = Buffer.from(token, 'base64');

        const decodedString = buff.toString('ascii');

        const loginAndPassword = decodedString.split(':');

        return {
            login: loginAndPassword[0],
            password: loginAndPassword[1],
        };
    }
    async login({ login, password }: AuthData): Promise<string | null> {
        const user = await this.usersRepository.getUserByLogin(login);

        if (!user) {
            return null;
        }

        const {
            password: userPassword,
            id,
            login: userLogin,
        } = user.accountData;

        const isEqual = await this.comparePassword(password, userPassword);

        if (!isEqual) {
            return null;
        }

        const token = this.createJWT({ userId: id, login: userLogin });

        return token;
    }
    async comparePassword(password: string, userPassword: string) {
        try {
            return bcrypt.compare(password, userPassword);
        } catch {
            return false;
        }
    }
    async generateHashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }
    async confirmAccount(code: string): Promise<boolean> {
        const user = await this.usersRepository.getUserByConfirmationCode(code);
        if (!user || user.emailConfirmation.isConfirmed) {
            return false;
        }

        const isExpired = isAfter(
            new Date(),
            user.emailConfirmation.expirationDate
        );

        if (isExpired) {
            return false;
        }

        if (code !== user.emailConfirmation.confirmationCode) {
            return false;
        }

        return this.usersRepository.setUserIsConfirmed(user.accountData.id);
    }
    async resendConfirmationCode(email: string): Promise<boolean> {
        let user = await this.usersRepository.getUserByEmail(email);

        if (!user || user.emailConfirmation.isConfirmed) {
            return false;
        }

        let updatedUser = await this.usersRepository.updateConfirmationCode({
            id: user.accountData.id,
            code: v4(),
            expirationDate: addDays(new Date(), 1),
        });

        if (!updatedUser) {
            return false;
        }

        let emailTemplate =
            emailTemplateManager.getEmailConfirmationMessage(updatedUser);

        await this.emailService.sendEmail(
            updatedUser.accountData.email,
            'Confirm your account ✔',
            emailTemplate
        );
        return true;
    }
}
