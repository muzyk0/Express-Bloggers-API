import express from 'express';
import { ioc } from '../ioCController';
import { isAuth } from '../middlewares/isAuth';
import { isBaseAuth } from '../middlewares/isBaseAuth';

export const postsRoute = express.Router();

postsRoute
    .get('/', ioc.postController.getAllPosts.bind(ioc.postController))
    .get('/:id', ioc.postController.getPostById.bind(ioc.postController))
    .post(
        '/',
        isBaseAuth,
        ioc.postController.createNewPost.bind(ioc.postController)
    )

    .put(
        '/:id',
        isBaseAuth,
        ioc.postController.updatePost.bind(ioc.postController)
    )
    .delete(
        '/:id',
        isBaseAuth,
        ioc.postController.deleteBlogger.bind(ioc.postController)
    )
    .get(
        '/:id/comments',
        ioc.postController.getPostComments.bind(ioc.postController)
    )
    .post(
        '/:id/comments',
        isAuth,
        ioc.postController.createPostComment.bind(ioc.postController)
    );
