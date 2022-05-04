import { IBlogger } from "../entity/Blogger";
import { PaginatorOptions, ResponseDataWithPaginator } from "../lib/Paginator";
import { bloggersRepository } from "../respositories/bloggersRepository";

export const bloggersService = {
    async findBloggers(
        searchNameTerm?: string,
        paginatorOptions?: PaginatorOptions
    ): Promise<ResponseDataWithPaginator<IBlogger>> {
        return bloggersRepository.getBloggers(
            { searchNameTerm },
            paginatorOptions
        );
    },
    async findBloggerById(id: number): Promise<IBlogger | null> {
        return bloggersRepository.getBloggerById(id);
    },
    async createBlogger(name: string, youtubeUrl: string): Promise<IBlogger> {
        const newBlogger: IBlogger = {
            id: +new Date(),
            name,
            youtubeUrl,
        };

        return bloggersRepository.createBlogger(newBlogger);
    },
    async updateBlogger(
        id: number,
        blogger: Pick<IBlogger, "name" | "youtubeUrl">
    ): Promise<IBlogger | null> {
        return bloggersRepository.updateBlogger(id, blogger);
    },
    async deleteBlogger(id: number): Promise<boolean> {
        return bloggersRepository.deleteBloggerById(id, { softRemove: false });
    },
};
