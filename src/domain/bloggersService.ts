import { IBlogger } from "../entity/Blogger";
import { bloggersRepository } from "../respositories/bloggersRepository";

export const bloggersService = {
    async findBloggers(): Promise<IBlogger[]> {
        return bloggersRepository.getBloggers();
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
    async deleteBlogger(
        id: number,
        options?: { softRemove: boolean }
    ): Promise<boolean> {
        return bloggersRepository.deleteBlogger(id, options);
    },
};
