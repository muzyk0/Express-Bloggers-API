import { IBlogger } from "../entity/Blogger";
import { PaginatorOptions, ResponseDataWithPaginator } from "../lib/Paginator";
import { BloggersRepository } from "../respositories/bloggersRepository";
import { v4 } from "uuid";

export class BloggersService {
    constructor(private bloggersRepository: BloggersRepository) {}

    async findBloggers(
        searchNameTerm?: string,
        paginatorOptions?: PaginatorOptions
    ): Promise<ResponseDataWithPaginator<IBlogger>> {
        return this.bloggersRepository.getBloggers(
            { searchNameTerm },
            paginatorOptions
        );
    }
    async findBloggerById(id: IBlogger["id"]): Promise<IBlogger | null> {
        return this.bloggersRepository.getBloggerById(id);
    }
    async createBlogger(name: string, youtubeUrl: string): Promise<IBlogger> {
        const newBlogger: IBlogger = {
            id: v4(),
            name,
            youtubeUrl,
        };

        return this.bloggersRepository.createBlogger(newBlogger);
    }
    async updateBlogger(
        id: IBlogger["id"],
        blogger: Pick<IBlogger, "name" | "youtubeUrl">
    ): Promise<IBlogger | null> {
        return this.bloggersRepository.updateBlogger(id, blogger);
    }
    async deleteBlogger(id: IBlogger["id"]): Promise<boolean> {
        return this.bloggersRepository.deleteBloggerById(id, {
            softRemove: false,
        });
    }
}
