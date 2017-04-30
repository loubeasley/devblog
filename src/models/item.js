import bookshelf from '../config/bookshelf';
import * as _Joi from 'joi';
import _modelbase from 'bookshelf-modelbase';

let Joi = _Joi.default;
let ModelBase = _modelbase(bookshelf);
let Item = ModelBase.extend({
    tableName: 'items',
    idAttribute: 'item_id',
    category: function() {
        return this.hasOne(bookshelf.model('Category'), 'category_id');
    },

    hasTimestamps: false,

    validate: {
        item_id: Joi.number().positive().min(1),
        name: Joi.string().length(50).alphanum(),
        category_id: Joi.number().positive().min(1),
        description: Joi.string().length(255).alphanum(),
        unit: Joi.string().length(50).alphanum(),
        quantity: Joi.number().positive(),
        sell_price: Joi.number().min(0).precision(2),
        cost: Joi.number().min(0).precision(2),
    }
});

let ItemCollection = bookshelf.collection('Item', {
    model: Item
});

export default Item;
export {Item as model, ItemCollection as collection};