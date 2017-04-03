import { Router } from 'express';
import user from './user';
import article from './article';
import comment from './comments';
import session from './session';
import item from './item';
import category from './category';
import bookshelf from '../config/bookshelf';
import role from '../models/role';
import roleassignment from '../models/roleassignment';

import _knexLogger from 'knex-logger';
let KnexLogger = _knexLogger(bookshelf.knex);

export default () => {
    let api = Router();
    api.use(KnexLogger);
    api.use('/user', user);
    api.use('/article', article);
    api.use('/comments', comment);
    api.use('/session', session);
    api.use('/item', item);
    api.use('/category', category);

    api.get('/', (req, res) => {
        res.json({
            success: true,
            message: 'you took a wrong turn at asdalbuquerque'
        });
    });

    return api;
}