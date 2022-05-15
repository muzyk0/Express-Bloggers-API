import express from "express";
import { ioc } from "../ioCController";
import { isBaseAuth } from "../middlewares/isAuthWithBase";

export const usersRoute = express.Router();

usersRoute
    .get("/", ioc.usersController.getAllUsers.bind(ioc.usersController))
    .post(
        "/",
        isBaseAuth,
        ioc.usersController.createNewUser.bind(ioc.usersController)
    )
    .delete(
        "/:id",
        isBaseAuth,
        ioc.usersController.deleteUser.bind(ioc.usersController)
    );
