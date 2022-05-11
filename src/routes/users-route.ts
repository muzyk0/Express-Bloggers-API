import express from "express";
import { ioc } from "../ioCController";
import { isAuthWithBase } from "../middlewares/isAuthWithBase";

export const usersRoute = express.Router();

usersRoute
    .get("/", ioc.usersController.getAllUsers.bind(ioc.usersController))
    .post(
        "/",
        isAuthWithBase,
        ioc.usersController.createNewUser.bind(ioc.usersController)
    )
    .delete(
        "/:id",
        isAuthWithBase,
        ioc.usersController.deleteUser.bind(ioc.usersController)
    );
