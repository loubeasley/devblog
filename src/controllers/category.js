import {Router} from 'express';
import * as auth from '../middleware/auth';
import Item from '../models/item';
import * as Category from '../models/category';
import ItemAudit from '../models/itemAudit';
import * as Promise from 'bluebird';

import * as _Joi from 'joi';
import * as _ from "lodash";

let Joi = _Joi.default;

let router = Router();

router.route('/')
    .get(function (req, res) {
        return Category.model.forge()
            .fetchAll()
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

export default router;