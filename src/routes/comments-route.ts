import express from 'express';
import { ioc } from '../ioCController';
import { isAuth } from '../middlewares/isAuth';
import { isOwnership } from '../middlewares/isOwnership';

export const commentsRoute = express.Router();

commentsRoute
    .get('/:id', ioc.commentsController.getCommentById.bind(ioc.postController))
    .put(
        '/:id',
        isAuth,
        isOwnership,
        ioc.commentsController.updateComment.bind(ioc.postController)
    )
    .delete(
        '/:id',
        isAuth,
        isOwnership,
        ioc.commentsController.deleteComment.bind(ioc.postController)
    );
