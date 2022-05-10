import { IBlogger } from "../entity/Blogger";
import { PaginatorOptions, ResponseDataWithPaginator } from "../lib/Paginator";
import { BloggersRepository } from "../respositories/bloggersRepository";

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
    async findBloggerById(id: number): Promise<IBlogger | null> {
        return this.bloggersRepository.getBloggerById(id);
    }
    async createBlogger(name: string, youtubeUrl: string): Promise<IBlogger> {
        const newBlogger: IBlogger = {
            id: +new Date(),
            name,
            youtubeUrl,
        };

        return this.bloggersRepository.createBlogger(newBlogger);
    }
    async updateBlogger(
        id: number,
        blogger: Pick<IBlogger, "name" | "youtubeUrl">
    ): Promise<IBlogger | null> {
        return this.bloggersRepository.updateBlogger(id, blogger);
    }
    async deleteBlogger(id: number): Promise<boolean> {
        return this.bloggersRepository.deleteBloggerById(id, {
            softRemove: false,
        });
    }
}
