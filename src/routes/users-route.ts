import express from "express";
import { ioc } from "../ioCController";

export const usersRoute = express.Router();

usersRoute.get("/", ioc.usersController.getAllUsers.bind(ioc.usersController));
