import { EntityManager } from "../lib/entityManager";
import { PaginatorOptions } from "../lib/Paginator";
import { db } from "./db";
import { User, UserDTO, UserInput, IUser } from "../entity/User";
import { WithId } from "mongodb";

const usersCollection = db.collection("users");

const m = new EntityManager(db);

export class UsersRepository {
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
        const users = await m.find(
            "users",
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
        return m.findOne<IUser>("users", { login: login });
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

    async deleteUser(id: IUser["id"], options?: { softRemove: boolean }) {
        return m.deleteOne("users", {
            id,
            softRemove: options?.softRemove,
        });
    }
}
