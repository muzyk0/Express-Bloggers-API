import { WithId } from 'mongodb';
import { IUser } from '../entity/User';
import { EntityManager } from '../lib/entityManager';
import { PaginatorOptions } from '../lib/Paginator';
import { db } from './db';

const usersCollection = db.collection('users');

export class UsersRepository {
    constructor(private m: EntityManager) {}
    async getUsers(
        {
            searchNameTerm,
            withArchived,
        }: {
            searchNameTerm?: string;
            withArchived?: boolean;
        },
        paginatorOptions?: PaginatorOptions
    ) {
        const users = await this.m.find(
            'users',
            {
                ...(searchNameTerm
                    ? { title: { $regex: searchNameTerm } }
                    : {}),
                withArchived,
            },
            paginatorOptions
        );

        return users;
    }

    async getUserByLogin(login: string) {
        return this.m.findOne<IUser>('users', { login: login });
    }

    async getUserById(id: string) {
        return this.m.findOne<IUser>('users', { id });
    }

    async createUser(user: WithId<IUser>) {
        await usersCollection.insertOne(user, {
            forceServerObjectId: true,
        });

        return usersCollection.findOne(
            { id: user.id },
            { projection: { _id: false, password: false } }
        );
    }

    async deleteUser(id: IUser['id'], options?: { softRemove: boolean }) {
        return this.m.deleteOne('users', {
            id,
            softRemove: options?.softRemove,
        });
    }
}
