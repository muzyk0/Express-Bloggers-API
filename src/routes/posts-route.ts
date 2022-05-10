import express from "express";
import { ioc } from "../ioCController";
import { isAuthWithBase } from "../middlewares/isAuthWithBase";

export const postsRoute = express.Router();

postsRoute
    .get("/", ioc.postController.getAllPosts.bind(ioc.postController))
    .get("/:id", ioc.postController.getPostById.bind(ioc.postController))
    .post(
        "/",
        isAuthWithBase,
        ioc.postController.createNewPost.bind(ioc.postController)
    )

    .put(
        "/:id",
        isAuthWithBase,
        ioc.postController.updatePost.bind(ioc.postController)
    )
    .delete(
        "/:id",
        isAuthWithBase,
        ioc.postController.deleteBlogger.bind(ioc.postController)
    );
