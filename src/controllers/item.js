import {Router} from 'express';
import * as auth from '../middleware/auth';
import Item from '../models/item';
import Cycle from '../models/cycle';
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
        let audit_type = req.body.mode;
        let items = req.body.items;
        let cycle_id = 0;
        console.log(req.body.items);
        return new Cycle().getCurrent()
            .then((currentCycle) => {
                if (!currentCycle) throw new Error('Current cycle wasnt found!');

                cycle_id = currentCycle.attributes.cycle_id;

                return Promise.map(Object.keys(items), function (item_id) {
                    if (Object.keys(items[item_id]).length === 0) return null;

                    return new Item({item_id})
                        .fetch({require: true})
                        .then(function (item) {
                            let obj = {item_id: item_id};
                            if (!item) return null;

                            _.assign(obj, items[item_id]);

                            if(obj.quantity)
                                obj['quantity'] = item.attributes.quantity + obj.quantity;

                            return item.save(obj);
                        })
                        .then(function (result) {
                            if (!result) return null;
                            console.log(result.toJSON());

                            return ItemAudit.create({
                                cycle_id,
                                item_id,
                                audit_type,

                                sell_price: result.attributes.sell_price,
                                cost: result.attributes.cost,

                                created_by: req.session.user.userID || null,
                                change: items[item_id].quantity
                            });
                        })
                        .then(() => item_id);
                })
            })
            .then(function (result) {


                res.json({
                    success: true,
                    results: _.omitBy(result, _.isNil),
                    message: 'Items updated.'
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