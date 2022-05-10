import { UsersService } from "./domain/usersService";
import { UsersController } from "./presentation/UsersController";
import { UsersRepository } from "./respositories/usersRepository";
import { BloggersRepository } from "./respositories/bloggersRepository";
import { BloggersService } from "./domain/bloggersService";
import { BloggersController } from "./presentation/BloggersController";
import { PostsRepository } from "./respositories/postsRepository";
import { PostsService } from "./domain/postsService";
import { PostsController } from "./presentation/BloggersController copy";

const usersRepository = new UsersRepository();
const postRepository = new PostsRepository();
const bloggerRepository = new BloggersRepository();

const usersService = new UsersService(usersRepository);
const bloggerService = new BloggersService(bloggerRepository);
const postService = new PostsService(postRepository, bloggerService);

const usersController = new UsersController(usersService);
const postController = new PostsController(bloggerService, postService);
const bloggerController = new BloggersController(bloggerService, postService);

export const ioc = {
    usersController,
    postController,
    bloggerController,
};
