import express from 'express';
import { ioc } from '../ioCController';

export const testingRoute = express
    .Router()
    .delete(
        '/all-data',
        ioc.testingController.clearDatabase.bind(ioc.testingController)
    );
