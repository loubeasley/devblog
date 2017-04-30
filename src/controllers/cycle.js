import {Router} from 'express';
import * as auth from '../middleware/auth';
import Cycle from '../models/cycle';
import ItemAudit from '../models/itemAudit';
import * as Promise from 'bluebird';
import * as _Joi from 'joi';
import * as _ from "lodash";

let Joi = _Joi.default;
let router = Router();

router.route('/')
    .get(function (req, res) {
        console.log(req.query);
        //req.query.parentID = req.query.parentID || null;
        //if(req.query.parentID == 'root') req.query.parentID = null;

        Cycle
            .findAll(req.query || {})
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
    });

router.route('/current')
    .get(function (req, res) {
        Cycle
            .findOne({ended: false})
            .then(function (collection) {
                console.log(collection);

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
    });

export default router;