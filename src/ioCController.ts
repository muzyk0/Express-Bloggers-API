import { UsersService } from "./domain/usersService";
import { UsersController } from "./presentation/UsersController";
import { UsersRepository } from "./respositories/usersRepository";
import { BloggersRepository } from "./respositories/bloggersRepository";
import { BloggersService } from "./domain/bloggersService";
import { BloggersController } from "./presentation/BloggersController";
import { PostsRepository } from "./respositories/postsRepository";
import { PostsService } from "./domain/postsService";
import { PostsController } from "./presentation/PostsController";
import { AuthService } from "./domain/authService";
import { AuthController } from "./presentation/AuthController";
import { EntityManager } from "./lib/entityManager";
import { db } from "./respositories/db";
import { CommentsRepository } from "./respositories/commentsRepository";
import { CommentsService } from "./domain/commentsService";

const m = new EntityManager(db);

const usersRepository = new UsersRepository(m);
const postRepository = new PostsRepository(m);
const bloggerRepository = new BloggersRepository(m);
const commentsRepository = new CommentsRepository(m);

const usersService = new UsersService(usersRepository);
const bloggerService = new BloggersService(bloggerRepository);
const postService = new PostsService(postRepository, bloggerService);
const authService = new AuthService(usersService);
const commentsService = new CommentsService(
    postService,
    usersService,
    commentsRepository
);

const usersController = new UsersController(usersService);
const postController = new PostsController(
    bloggerService,
    postService,
    commentsService
);
const bloggerController = new BloggersController(bloggerService, postService);
const authController = new AuthController(authService);

export const ioc = {
    usersController,
    postController,
    bloggerController,
    authService,
    authController,
};
