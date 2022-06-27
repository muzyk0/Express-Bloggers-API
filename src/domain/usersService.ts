import { IUser, UserDTO, UserInput } from '../entity/User';
import { PaginatorOptions } from '../lib/Paginator';
import { UsersRepository } from '../respositories/usersRepository';
import { UserAccountDBType } from '../types/types';
import { v4 } from 'uuid';
import { addDays } from 'date-fns';
import { emailTemplateManager } from './email-template-manager';
import { EmailService } from './email-service';
import { AuthService } from './authService';

export class UsersService {
    constructor(
        private usersRepository: UsersRepository,
        private authService: AuthService,
        private emailService: EmailService
    ) {}

    async findUsers(
        {
            searchNameTerm,
        }: {
            searchNameTerm?: string;
        },
        paginatorOptions?: PaginatorOptions
    ) {
        return this.usersRepository.getUsers(
            { searchNameTerm, withArchived: false },
            paginatorOptions
        );
    }

    async findUserByLogin(login: string) {
        return this.usersRepository.getUserByLogin(login);
    }

    async findUserByEmail(email: string) {
        return this.usersRepository.getUserByEmail(email);
    }

    async findUserById(id: string) {
        return this.usersRepository.getUserById(id);
    }

    async createUser({
        login,
        email,
        password,
    }: UserInput): Promise<UserDTO | null> {
        const passwordHash = await this.authService.generateHashPassword(
            password
        );
        const newUser: UserAccountDBType = {
            accountData: {
                id: v4(),
                login,
                email,
                password: passwordHash,
                createdAt: new Date(),
            },
            loginAttempts: [],
            emailConfirmation: {
                sentEmails: [],
                confirmationCode: v4(),
                expirationDate: addDays(new Date(), 1),
                isConfirmed: false,
            },
        };

        const createdUser = await this.usersRepository.createUser(newUser);

        if (!createdUser) {
            return null;
        }

        try {
            const emailTemplate =
                emailTemplateManager.getEmailConfirmationMessage(newUser);

            await this.emailService.sendEmail(
                email,
                'Confirm your account ✔',
                emailTemplate
            );
        } catch (e) {
            console.error(e);
        }

        const { id, login: userLogin } = createdUser.accountData;

        return {
            id,
            login: userLogin,
        };
    }

    async deleteUser(id: IUser['id']): Promise<boolean> {
        return this.usersRepository.deleteUser(id, { softRemove: false });
    }
}
