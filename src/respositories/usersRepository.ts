import { EntityManager } from "../lib/entityManager";
import { PaginatorOptions } from "../lib/Paginator";
import { db } from "./db";

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
        const users = await m.find("users", { withArchived });

        return users;
    }
}
