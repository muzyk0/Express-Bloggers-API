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

    async createUser(user: WithId<IUser>): Promise<IUser> {
        await usersCollection.insertOne(user, {
            forceServerObjectId: true,
        });

        return user;
    }

    async deleteUser(id: IUser["id"], options?: { softRemove: boolean }) {
        return m.deleteOne("users", {
            id,
            softRemove: options?.softRemove,
        });
    }
}
