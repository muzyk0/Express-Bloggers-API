import { PaginatorOptions } from "../lib/Paginator";
import { UsersRepository } from "../respositories/usersRepository";

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
}
