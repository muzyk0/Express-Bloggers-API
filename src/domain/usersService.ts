import { PaginatorOptions } from "../lib/Paginator";
import { usersRepository } from "../respositories/usersRepository";

export const usersService = {
    async findUsers(
        {
            searchNameTerm,
        }: {
            searchNameTerm?: string;
        },
        paginatorOptions?: PaginatorOptions
    ) {
        return usersRepository.getUsers(
            { searchNameTerm, withArchived: false },
            paginatorOptions
        );
    },
};
