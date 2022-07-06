import { IUser, UserAccountDBType, UserDTO } from '../entity/User/User';
import { EntityManager } from '../lib/entityManager';
import { PaginatorOptions, ResponseDataWithPaginator } from '../lib/Paginator';
import { db } from './db';
import { UserModel } from '../entity/User/UserModel';

const usersCollection = db.collection<UserAccountDBType>('users');

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
    ): Promise<ResponseDataWithPaginator<UserDTO>> {
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

        return {
            ...users,
            items: users.items.map(({ accountData: { id, login } }) => ({
                id,
                login,
            })),
        };
    }

    async getUserByLogin(login: string) {
        return usersCollection.findOne({ 'accountData.login': login });
    }

    async getUserByEmail(email: string) {
        return usersCollection.findOne({ 'accountData.email': email });
    }

    async getUserById(id: string) {
        return this.m.findOne<IUser>('users', { 'accountData.id': id });
    }

    async createUser(user: UserAccountDBType) {
        const userWithLoginOrEmail = await usersCollection.findOne({
            $or: [
                { 'accountData.login': user.accountData.login },
                { 'accountData.email': user.accountData.email },
            ],
        });

        if (userWithLoginOrEmail) {
            return null;
        }

        await usersCollection.insertOne(user, {
            forceServerObjectId: true,
        });

        return usersCollection.findOne(
            { 'accountData.id': user.accountData.id },
            { projection: { _id: false, password: false } }
        );
    }

    async deleteUser(id: IUser['id'], options?: { softRemove: boolean }) {
        return this.m.deleteOne('users', {
            id,
            softRemove: options?.softRemove,
        });
    }

    async getUserByConfirmationCode(code: string) {
        return UserModel.findOne({
            'emailConfirmation.confirmationCode': code,
        });
    }

    async setUserIsConfirmed(id: string): Promise<boolean> {
        const result = await UserModel.updateOne(
            { id },
            {
                $set: {
                    'emailConfirmation.isConfirmed': true,
                },
            }
        );

        return result.modifiedCount === 1;
    }

    async updateConfirmationCode({
        id,
        code,
        expirationDate,
    }: {
        id: string;
        code: string;
        expirationDate: Date;
    }) {
        return UserModel.findOneAndUpdate(
            { 'accountData.id': id },
            {
                $set: {
                    'emailConfirmation.confirmationCode': code,
                    'emailConfirmation.expirationDate': expirationDate,
                },
            },
            { returnDocument: 'after' }
        );
    }
}
