import express from "express";
import { ioc } from "../ioCController";
import { isAuthWithBase } from "../middlewares/isAuthWithBase";

export const bloggersRouter = express.Router();

bloggersRouter
    .get(`/`, ioc.bloggerController.getAllBloggers.bind(ioc.bloggerController))
    .get(
        "/:id",
        ioc.bloggerController.getOneBlogger.bind(ioc.bloggerController)
    )
    .get(
        `/:id/posts`,
        ioc.bloggerController.getBloggerPosts.bind(ioc.bloggerController)
    )
    .post(
        "/",
        isAuthWithBase,
        ioc.bloggerController.createNewBlogger.bind(ioc.bloggerController)
    )
    .post(
        "/:bloggerId/posts",
        isAuthWithBase,
        ioc.bloggerController.createNewBloggerPost.bind(ioc.bloggerController)
    )
    .put(
        "/:id",
        isAuthWithBase,
        ioc.bloggerController.updateBloggerPost.bind(ioc.bloggerController)
    )
    .delete(
        "/:id",
        isAuthWithBase,
        ioc.bloggerController.deleteBlogger.bind(ioc.bloggerController)
    );
