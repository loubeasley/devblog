import { Router } from 'express';
import user from './user';
import article from './article';
import comment from './comments';
import session from './session';
import role from '../models/role';
import roleassignment from '../models/roleassignment';


export default () => {
    let api = Router();

    api.use('/user', user);
    api.use('/article', article);
    api.use('/comments', comment);
    api.use('/session', session);

    api.get('/', (req, res) => {
        res.json({
            success: true,
            message: 'you took a wrong turn at asdalbuquerque'
        });
    });

    return api;
}