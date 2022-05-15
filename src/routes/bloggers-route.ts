import express from "express";
import { ioc } from "../ioCController";
import { isBaseAuth } from "../middlewares/isAuthWithBase";

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
        isBaseAuth,
        ioc.bloggerController.createNewBlogger.bind(ioc.bloggerController)
    )
    .post(
        "/:bloggerId/posts",
        isBaseAuth,
        ioc.bloggerController.createNewBloggerPost.bind(ioc.bloggerController)
    )
    .put(
        "/:id",
        isBaseAuth,
        ioc.bloggerController.updateBloggerPost.bind(ioc.bloggerController)
    )
    .delete(
        "/:id",
        isBaseAuth,
        ioc.bloggerController.deleteBlogger.bind(ioc.bloggerController)
    );
