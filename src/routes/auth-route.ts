import express from "express";
import { ioc } from "../ioCController";

export const authRoute = express.Router();

authRoute.post("/login", ioc.authController.login.bind(ioc.authController));
