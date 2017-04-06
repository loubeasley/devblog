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
let validators = {
    itemsort: Joi.object().keys({
        page: Joi.number().positive().min(1),
        sort: Joi.string().regex(/\w+\s+(asc|desc|ASC|DESC)$/),
        limit: Joi.number().positive().min(1),
        search: Joi.object(),
    })
};

router.route('/')
    .get(function (req, res) {
        /*console.log(req.query);*/

        let defaultQuery = {
            page: 1,
            limit: 50,
            sort: "name asc",
            search: {}
        };

        //return Item.findAll(req.query, {withRelated: ['category']})

        let {error, value} = Joi.validate(req.query, validators.itemsort, {
            stripUnknown: true,
            abortEarly: false
        });

        if (error) {
            let test = _.map(error.details, 'path');
            value = _.omit(value, test);
         /*   console.log(error);*/
        }

        let query = _.assign(defaultQuery, value);

        console.log(query);

        return new Item()
            .query(function (qb) {

                if (query.search && query.search.name)
                    qb.where('name', 'LIKE', '%' + query.search.name + '%');

                if (query.search && query.search.category_id)
                    qb.where('category_id', '=', query.search.category_id);

                if (query.search && query.search.quantity)
                    qb.where('quantity', query.search.quantity);

                let sort = query.sort.split(' ');
                qb.orderBy(sort[0], sort[1]);
                /*if(query.search.hasOwnProperty('quantity')) {
                 qb.andWhere('quantity', 'LIKE', '%' + query.search.quantity + '%');
                 }*/
                /*console.log(qb.toString());*/


            })

            .fetchPage({page: query.page, pageSize: query.limit, withRelated: ['category']})
            .then(function (collection) {
                /*console.log(collection.query(function (qb){
                    return console.log(qb.toString());
                }));*/
                /*console.log(collection.toJSON());*/
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
        return Promise.map(Object.keys(req.body), function (id) {
            if(Object.keys(req.body[id]).length === 0) return null;
            console.log(req.body[id]);
            return new Item({item_id: id})
                .fetch({require: true})
                .then(function (item) {
                    let obj = {item_id: id};
                    if (!item) return null;

                    _.assign(obj, req.body[id]);

                    obj['quantity'] = item.attributes.quantity + obj.quantity;

                    return item.save(obj).then((result)=> {
                        if(!result) return;


                        //req.body[id].quantity
                        //result = result.toJSON();

                        return ItemAudit.create({
                            cycle_id: 1,
                            item_id: id,
                            created_by: req.session.user.userID || null,
                            change: req.body[id].quantity
                        })

                    })
                });
        })
            .then(function (result) {
                //result = _.omitBy(result, _.isNil);
                console.log(result);
                res.json({
                    success: true,
                    results: result,
                    message: 'Article updated.'
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