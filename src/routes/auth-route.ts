import express from 'express';
import { ioc } from '../ioCController';

export const authRoute = express.Router();

authRoute
    .post('/login', ioc.authController.login.bind(ioc.authController))
    .post(
        '/registration',
        ioc.limitsController.checkLimitsMiddleware.bind(ioc.limitsController),
        ioc.usersController.createNewUser.bind(ioc.usersController)
    );
