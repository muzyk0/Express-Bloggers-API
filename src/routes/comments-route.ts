import express from "express";
import { ioc } from "../ioCController";
import { isAuth } from "../middlewares/isAuth";

export const commentsRoute = express.Router();

commentsRoute
    .get("/:id", ioc.commentsController.getCommentById.bind(ioc.postController))
    .put(
        "/:id",
        isAuth,
        ioc.postController.updatePost.bind(ioc.postController)
    )
    .delete(
        "/:id",
        isAuth,
        ioc.postController.deleteBlogger.bind(ioc.postController)
    )
