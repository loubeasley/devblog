import { Router } from 'express';
import * as auth from '../middleware/auth';
import * as Comment from '../models/comment';
let router = Router();

router.route('/')
    .get(function (req, res) {
        console.log(req.query);
        //req.query.parentID = req.query.parentID || null;
        //if(req.query.parentID == 'root') req.query.parentID = null;

        Comment.model.forge()
            .query({where: req.query})

            .fetchAll({withRelated: ['user'/* 'reply'*/]})
            /*.fetchPage({
                pageSize: 15,
                page: req.query.page || 1,
                withRelated: ['user', 'reply']
            })*/
            .then(function (collection) {
                res.json({
                    success: true,
                    results: collection.toJSON(),
                    pagination: collection.pagination
                });
            })
            .catch(function (err) {
                res.status(500)
                    .json({
                        success: false,
                        message: err.message
                    });
            });
    })
    .post(auth.user, function (req, res) {
        console.log(req.body);
        //var marked = require('marked');
        //req.body.body = marked(req.body.body);
        Comment.model
            .forge(req.body)
            .save()
            .then(function (comment) {
                return comment.load(['user']);
            })
            .then(function (comment) {
                return res.json({
                    success: true,
                    message: 'Article created.',
                    results: comment.toJSON()
                });
            })
            .catch(function (err) {
                return res.status(500)
                    .json({
                        success: false,
                        message: err.message
                    });
            });
    });

export default router;