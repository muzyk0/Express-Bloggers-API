import express from 'express';
import { ioc } from '../ioCController';
import { checkLimitsMiddleware } from '../middlewares/checkLimitsMiddleware';

export const authRoute = express.Router();

authRoute
    .post(
        '/login',
        checkLimitsMiddleware,
        ioc.authController.login.bind(ioc.authController)
    )
    .post(
        '/registration',
        checkLimitsMiddleware,
        ioc.usersController.createNewUser.bind(ioc.usersController)
    );
