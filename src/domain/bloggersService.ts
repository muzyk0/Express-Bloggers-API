import {
    Blogger,
    bloggersRepository,
} from "../respositories/bloggersRepository";

export const bloggersService = {
    async findBloggers(): Promise<Blogger[]> {
        return bloggersRepository.getBloggers();
    },
    async findBloggerById(id: number): Promise<Blogger | null> {
        return bloggersRepository.getBloggerById(id);
    },
    async createBlogger(name: string, youtubeUrl: string): Promise<Blogger> {
        const newBlogger: Blogger = {
            id: +new Date(),
            name,
            youtubeUrl,
        };

        return bloggersRepository.createBlogger(newBlogger);
    },
    async updateBlogger(
        id: number,
        blogger: Pick<Blogger, "name" | "youtubeUrl">
    ): Promise<Blogger | null> {
        return bloggersRepository.updateBlogger(id, blogger);
    },
    async deleteBlogger(
        id: number,
        options?: { softRemove: boolean }
    ): Promise<boolean> {
        return bloggersRepository.deleteBlogger(id, options);
    },
};
