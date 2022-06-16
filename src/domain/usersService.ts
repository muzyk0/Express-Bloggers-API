import bcrypt from 'bcrypt';
import { ObjectId, WithId } from 'mongodb';
import { v4 } from 'uuid';
import { IUser, UserInput } from '../entity/User';
import { PaginatorOptions } from '../lib/Paginator';
import { UsersRepository } from '../respositories/usersRepository';

export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

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

    async findUserById(id: string) {
        return this.usersRepository.getUserById(id);
    }

    async createUser({ login, password }: UserInput) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user: WithId<IUser> = {
            _id: new ObjectId(),
            id: v4(),
            login,
            password: hashedPassword,
        };

        return this.usersRepository.createUser(user);
    }

    async deleteUser(id: IUser['id']): Promise<boolean> {
        return this.usersRepository.deleteUser(id, { softRemove: false });
    }
}
